"use client";
import { Header } from '@/components/layout/header';
import { HeroSection } from '@/components/landing/hero-section';
import { FeatureCard } from '@/components/landing/feature-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldAlert, BarChartBig, BrainCircuit, BellRing, Search, Users, CheckCircle, Sparkles } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Generate particles only on client side
    const newParticles = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 10}s`,
    }));
    setParticles(newParticles);
  }, []);

  const features = [
    {
      icon: ShieldAlert,
      title: "Real-time Threat Feed",
      description: "Access up-to-the-minute cybersecurity threat updates. Stay informed about the latest vulnerabilities, malware, and attack vectors.",
      linkHref: "/dashboard/threat-feed",
      linkLabel: "Explore Threat Feed",
    },
    {
      icon: BarChartBig,
      title: "Advanced Analytics",
      description: "Visualize threat landscapes with interactive charts. Understand common threats, severity distributions, and evolving trends.",
      linkHref: "/dashboard/analytics",
      linkLabel: "View Analytics Dashboard",
    },
    {
      icon: BrainCircuit,
      title: "AI Threat Summary",
      description: "Leverage AI to get concise summaries of complex security vulnerabilities. Understand threats at a glance and act faster.",
      linkHref: "/dashboard/ai-summary",
      linkLabel: "Use AI Summary Tool",
    },
    {
      icon: BellRing,
      title: "Custom Alerts",
      description: "Set up personalized alerts for specific risk levels, threat categories, or keywords. Get notified about what matters most to you.",
      linkHref: "/dashboard/alerts",
      linkLabel: "Configure Alerts",
    },
    {
      icon: Search,
      title: "Powerful Search & Filter",
      description: "Easily find relevant threats using keyword search and category filters. Pinpoint specific information quickly and efficiently.",
      linkHref: "/dashboard/threat-feed",
      linkLabel: "Try Search & Filter",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your security team. Share insights, manage roles, and collaborate on threat response in real-time.",
      linkHref: "/dashboard/settings",
      linkLabel: "Manage Team",
    }
  ];

  const benefits = [
    "Real-time threat intelligence from multiple sources",
    "AI-powered analysis and recommendations",
    "Customizable alerts and notifications",
    "Advanced visualization and reporting",
    "Team collaboration and access management",
    "24/7 monitoring and protection"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className={`container mx-auto px-4 md:px-6 relative z-10 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Powerful Features</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Core Features of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{APP_NAME}</span>
              </h2>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto md:text-lg">
                Empowering you with comprehensive tools to navigate the complex world of cybersecurity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-secondary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
                  Why Choose <span className="text-primary">{APP_NAME}</span>?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Stay ahead of cyber threats with our comprehensive security intelligence platform.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 group cursor-pointer"
                    >
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-base group-hover:text-primary transition-colors">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border-2 border-primary/30 p-8 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <ShieldAlert className="h-48 w-48 text-primary/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
          {particles.length > 0 && (
            <div className="absolute inset-0">
              {particles.map((particle, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
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
          
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
              Ready to Secure Your Digital World?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 md:text-lg">
              Join {APP_NAME} today and gain the upper hand against cyber threats.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-gradient-to-r from-primary to-red-500 hover:from-primary/90 hover:to-red-500/90 text-primary-foreground shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10">Sign Up Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 hover:border-primary hover:bg-primary/10 transform hover:scale-105 transition-all duration-300"
                >
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved. Secure your future.</p>
          <p className="mt-2 text-xs">Protected by advanced security measures • ISO 27001 Certified</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
