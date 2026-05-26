"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, Eye, EyeOff, Shield, Lock, Mail, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  rememberMe: z.boolean().default(false),
  mfaCode: z.string().optional(),
});

export function LoginForm() {
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [requireMFA, setRequireMFA] = useState(false);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>("");

  useEffect(() => {
    // Generate device fingerprint
    const fingerprint = `${navigator.userAgent}-${screen.width}x${screen.height}-${navigator.language}`;
    setDeviceFingerprint(btoa(fingerprint).substring(0, 16));

    // Simulate IP detection
    setIpAddress(`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);

    // Check for lockout
    const lockout = localStorage.getItem('login_lockout');
    if (lockout) {
      const lockoutData = JSON.parse(lockout);
      const timeRemaining = lockoutData.until - Date.now();
      if (timeRemaining > 0) {
        setIsLocked(true);
        setLockoutTime(Math.ceil(timeRemaining / 1000));
      } else {
        localStorage.removeItem('login_lockout');
      }
    }

    // Load saved attempts
    const attempts = localStorage.getItem('login_attempts');
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
    }
  }, []);

  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            localStorage.removeItem('login_lockout');
            setLoginAttempts(0);
            localStorage.removeItem('login_attempts');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      mfaCode: "",
    },
  });

  const logSecurityEvent = (event: string, details: any) => {
    const securityLog = {
      timestamp: new Date().toISOString(),
      event,
      details,
      ipAddress,
      deviceFingerprint,
    };
    console.log('Security Event:', securityLog);
    
    // Store in localStorage for demo
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(securityLog);
    localStorage.setItem('security_logs', JSON.stringify(logs.slice(-50))); // Keep last 50 logs
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLocked) {
      toast({
        title: "Account Locked",
        description: `Too many failed attempts. Please wait ${lockoutTime} seconds.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate login validation
    const isValidCredentials = values.email && values.password.length >= 8;
    
    if (isValidCredentials) {
      // Check if MFA is required
      if (!requireMFA) {
        setRequireMFA(true);
        setIsLoading(false);
        toast({
          title: "MFA Required",
          description: "Please enter your 6-digit authentication code.",
        });
        logSecurityEvent('MFA_REQUESTED', { email: values.email });
        return;
      }

      // Validate MFA code
      if (requireMFA && values.mfaCode !== '123456') {
        setIsLoading(false);
        toast({
          title: "Invalid MFA Code",
          description: "The authentication code is incorrect.",
          variant: "destructive",
        });
        logSecurityEvent('MFA_FAILED', { email: values.email });
        return;
      }

      // Successful login
      logSecurityEvent('LOGIN_SUCCESS', { 
        email: values.email,
        rememberMe: values.rememberMe,
        mfaUsed: true,
      });

      // Reset attempts
      setLoginAttempts(0);
      localStorage.removeItem('login_attempts');

      // Store session info
      if (values.rememberMe) {
        localStorage.setItem('remember_me', values.email);
      }

      login(values.email);
      toast({
        title: "Login Successful",
        description: "Welcome back to CyberWatch! Your session is secured.",
      });
    } else {
      // Failed login
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('login_attempts', newAttempts.toString());

      logSecurityEvent('LOGIN_FAILED', { 
        email: values.email,
        attempts: newAttempts,
      });

      if (newAttempts >= 5) {
        // Lock account for 5 minutes
        const lockUntil = Date.now() + (5 * 60 * 1000);
        localStorage.setItem('login_lockout', JSON.stringify({ until: lockUntil }));
        setIsLocked(true);
        setLockoutTime(300);
        
        logSecurityEvent('ACCOUNT_LOCKED', { 
          email: values.email,
          reason: 'Too many failed attempts',
        });

        toast({
          title: "Account Locked",
          description: "Too many failed login attempts. Account locked for 5 minutes.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: `Invalid credentials. ${5 - newAttempts} attempts remaining.`,
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* Security Status Indicators */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Shield className="h-3 w-3 text-green-500" />
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Lock className="h-3 w-3 text-green-500" />
          <span>MFA Enabled</span>
        </div>
      </div>

      {/* Lockout Warning */}
      {isLocked && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Account locked due to multiple failed attempts. Unlocks in {Math.floor(lockoutTime / 60)}:{(lockoutTime % 60).toString().padStart(2, '0')}
          </AlertDescription>
        </Alert>
      )}

      {/* Attempt Warning */}
      {loginAttempts > 0 && loginAttempts < 5 && !isLocked && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}. {5 - loginAttempts} remaining before lockout.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="your@email.com" 
                      className="pl-10"
                      disabled={isLocked}
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10 pr-10"
                      disabled={isLocked}
                      {...field} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Must be 8+ characters with uppercase, lowercase, and numbers
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {requireMFA && (
            <FormField
              control={form.control}
              name="mfaCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two-Factor Authentication Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter 6-digit code" 
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Enter code from your authenticator app (Demo: use 123456)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLocked}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || isLocked}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Secure Login
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Security Info */}
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Device ID: {deviceFingerprint} • IP: {ipAddress}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Protected by advanced security measures
        </p>
      </div>
    </div>
  );
}
