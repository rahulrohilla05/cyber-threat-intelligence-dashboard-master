"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
}

export function FeatureCard({ icon: Icon, title, description, linkHref, linkLabel }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group relative flex flex-col overflow-hidden h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border-2 hover:border-primary/50 transform hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <Icon className={`w-10 h-10 text-primary transition-all duration-500 ${
              isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
            }`} />
            {isHovered && (
              <div className="absolute inset-0 w-10 h-10 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
            )}
          </div>
          <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
        </div>
        <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col justify-end relative z-10">
        <Link href={linkHref} className="mt-auto">
          <Button 
            variant="outline" 
            className="w-full group/btn border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105"
          >
            <span className="flex items-center justify-center w-full">
              {linkLabel} 
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
        </Link>
      </CardContent>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full"></div>
    </Card>
  );
}
