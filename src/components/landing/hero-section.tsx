"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Zap, Lock, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [threatCount, setThreatCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Generate particles only on client side
    const newParticles = [...Array(30)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 10}s`,
    }));
    setParticles(newParticles);
    
    // Animated threat counter
    const interval = setInterval(() => {
      setThreatCount(prev => {
        if (prev >= 1247) {
          clearInterval(interval);
          return 1247;
        }
        return prev + Math.floor(Math.random() * 50) + 10;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section 
      className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background via-secondary/10 to-background relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      {/* Floating Particles - Only render after mount */}
      {particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-float"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Interactive Glow Effect */}
      <div 
        className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl transition-all duration-300 pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Pulsing Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-64 h-64 border-2 border-primary/20 rounded-full animate-ping-slow"></div>
        <div className="absolute inset-0 w-64 h-64 border-2 border-primary/30 rounded-full animate-ping-slower"></div>
      </div>

      <div className={`container mx-auto px-4 md:px-6 text-center relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Animated Shield Icon */}
        <div className="relative inline-block mb-6">
          <ShieldCheck className="h-20 w-20 text-primary animate-pulse-glow" />
          <div className="absolute inset-0 h-20 w-20 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
        </div>

        {/* Main Title with Gradient Animation */}
        <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl mb-6">
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-accent animate-gradient-x">
            CyberWatch
          </span>
        </h1>

        {/* Subtitle with Typewriter Effect */}
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl lg:text-2xl">
          Stay Ahead of Threats. Real-time intelligence, advanced analytics, and AI-powered insights for ultimate cybersecurity.
        </p>

        {/* Live Stats */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 md:gap-8">
          <div className="group cursor-pointer">
            <div className="flex items-center gap-2 text-primary transition-transform group-hover:scale-110">
              <Zap className="h-5 w-5 animate-pulse" />
              <span className="text-3xl font-bold">{threatCount.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Threats Detected</p>
          </div>
          <div className="group cursor-pointer">
            <div className="flex items-center gap-2 text-green-500 transition-transform group-hover:scale-110">
              <Lock className="h-5 w-5" />
              <span className="text-3xl font-bold">99.9%</span>
            </div>
            <p className="text-sm text-muted-foreground">Protection Rate</p>
          </div>
          <div className="group cursor-pointer">
            <div className="flex items-center gap-2 text-blue-500 transition-transform group-hover:scale-110">
              <TrendingUp className="h-5 w-5" />
              <span className="text-3xl font-bold">24/7</span>
            </div>
            <p className="text-sm text-muted-foreground">Real-time Monitoring</p>
          </div>
        </div>

        {/* CTA Buttons with Enhanced Animations */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-red-500 hover:from-primary/90 hover:to-red-500/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/50"
            >
              <span className="relative z-10 flex items-center">
                Get Started 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </Button>
          </Link>
          <Link href="/#features">
            <Button 
              size="lg" 
              variant="outline" 
              className="group border-2 hover:border-primary hover:bg-primary/10 transform hover:scale-105 transition-all duration-300"
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>ISO 27001 Certified</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-slower {
          animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 10px hsl(var(--primary))); }
          50% { filter: drop-shadow(0 0 20px hsl(var(--primary))); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
}
