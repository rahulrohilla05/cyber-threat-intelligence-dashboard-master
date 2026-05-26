
"use client";

import { useState, useEffect, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Removed AvatarImage
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/auth-context';
import { Loader2, Save, UploadCloud } from 'lucide-react';
import type { UserProfile } from '@/types'; 
import { mockUserProfile } from '@/lib/mock-data'; 
import Link from 'next/link';

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  inAppNotifications: z.boolean().default(true),
});

export default function SettingsPage() {
  const { user, loading: authLoading, login: updateUserAuthContext } = useAuth(); 
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);


  useEffect(() => {
    if (user) {
      const storedProfile = localStorage.getItem(`userProfile_${user.email}`);
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setUserProfile(parsedProfile);
        if (parsedProfile.avatarDataUrl) {
          setAvatarPreview(parsedProfile.avatarDataUrl);
        } else {
          setAvatarPreview(user.avatarUrl || null); // Use auth context avatar if available
        }
      } else {
        setUserProfile({
          ...mockUserProfile, 
          name: user.name,
          email: user.email,
          // avatarUrl is no longer in mockUserProfile directly for display
        });
        setAvatarPreview(user.avatarUrl || null);
      }
    }
  }, [user]);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    values: { 
      name: userProfile?.name || "",
      email: userProfile?.email || "",
    }
  });
  
  useEffect(() => { 
    if (userProfile && userProfile.email) {
      localStorage.setItem(`userProfile_${userProfile.email}`, JSON.stringify({...userProfile, avatarDataUrl: avatarPreview }));
    }
  }, [userProfile, avatarPreview]);


  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    values: { 
      emailNotifications: userProfile?.preferences?.notifications?.email ?? true,
      inAppNotifications: userProfile?.preferences?.notifications?.inApp ?? true,
    }
  });

  useEffect(() => {
    if (userProfile) {
        notificationsForm.reset({
            emailNotifications: userProfile?.preferences?.notifications?.email ?? true,
            inAppNotifications: userProfile?.preferences?.notifications?.inApp ?? true,
        });
    }
  }, [userProfile, notificationsForm]);


  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedProfile = userProfile ? { ...userProfile, ...values, avatarDataUrl: avatarPreview } : null;
    setUserProfile(updatedProfile);
    
    // Update auth context if email or name changed
    if (user && updatedProfile && (values.email !== user.email || values.name !== user.name)) {
      const authUser = { ...user, name: values.name, email: values.email, avatarUrl: avatarPreview || user.avatarUrl };
      const storedAuth = localStorage.getItem('cyberwatch_auth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        authData.user = authUser;
        localStorage.setItem('cyberwatch_auth', JSON.stringify(authData));
      }
      // Defer the auth context update to avoid setState during render
      setTimeout(() => {
        updateUserAuthContext(values.email);
      }, 0);
    }
    
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    setIsLoading(false);
  }

  async function onNotificationsSubmit(values: z.infer<typeof notificationsFormSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUserProfile(prev => prev ? {
       ...prev, 
       preferences: { 
         ...(prev.preferences || {}), 
         notifications: {
           email: values.emailNotifications,
           inApp: values.inAppNotifications,
         }
       } 
      } : null);
    toast({ title: "Notification Settings Updated", description: "Your notification preferences have been saved." });
    setIsLoading(false);
  }

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarDataUrl = reader.result as string;
        setAvatarPreview(newAvatarDataUrl);

        // Update userProfile state and localStorage
        if (userProfile) {
          const updatedProfile = { ...userProfile, avatarDataUrl: newAvatarDataUrl };
          setUserProfile(updatedProfile);
          
          if (user && userProfile.email === user.email) { 
            const storedAuth = localStorage.getItem('cyberwatch_auth');
            if (storedAuth) {
              const authData = JSON.parse(storedAuth);
              authData.user.avatarUrl = newAvatarDataUrl;
              localStorage.setItem('cyberwatch_auth', JSON.stringify(authData));
            }
          }
        }
        
        toast({ title: "Avatar Updated", description: "Your new avatar has been set. Save profile to persist." });
      };
      reader.readAsDataURL(file);
    }
  };
  
  if (authLoading || !userProfile) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your personal details and avatar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt={userProfile.name} className="h-full w-full object-cover rounded-full" />
              ) : (
                <AvatarFallback>{userProfile.name.charAt(0).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <Input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
            <Button variant="outline" size="icon" aria-label="Upload New Avatar" onClick={handleAvatarUploadClick}>
              <UploadCloud className="h-4 w-4" />
            </Button>
          </div>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                     <FormDescription>Changing email will require re-verification (mock).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Choose how you receive alerts and updates.</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...notificationsForm}>
            <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-4">
               <FormField
                control={notificationsForm.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Email Notifications</FormLabel>
                      <FormDescription>Receive important alerts via email.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={notificationsForm.control}
                name="inAppNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>In-App Notifications</FormLabel>
                      <FormDescription>Show notifications directly within CyberWatch.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Notifications
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Link href="/dashboard/change-password"> 
                <Button variant="outline">Change Password</Button>
            </Link>
            <Button variant="destructive" disabled>Delete Account (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
