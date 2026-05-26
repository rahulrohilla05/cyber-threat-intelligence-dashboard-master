
"use client";
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Shield } from 'lucide-react';
import { APP_NAME, NAV_LINKS, DASHBOARD_NAV_LINKS } from '@/lib/constants';
import { UserNav } from './user-nav';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  isDashboard?: boolean;
}

export function Header({ isDashboard = false }: HeaderProps) {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <div className="relative">
            <Shield className="h-6 w-6 text-primary group-hover:text-accent transition-colors duration-300" />
            <div className="absolute inset-0 h-6 w-6 bg-primary/20 rounded-full blur-md group-hover:bg-accent/30 transition-all duration-300"></div>
          </div>
          <span className="font-bold sm:inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{APP_NAME}</span>
        </Link>
        
        <nav className="hidden md:flex gap-4 text-sm font-medium items-center flex-1">
          {isDashboard 
            ? DASHBOARD_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-foreground/60 transition-colors hover:text-foreground/80",
                    pathname === link.href && "text-primary font-semibold"
                  )}
                >
                  {link.label}
                </Link>
              ))
            : NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-foreground/60 transition-colors hover:text-foreground/80",
                     pathname === link.href && "text-primary font-semibold"
                  )}
                >
                  {link.label}
                </Link>
              ))}
        </nav>

        <div className={cn("flex flex-1 items-center justify-end space-x-4", isDashboard ? "justify-end" : "justify-end")}>
          <UserNav />
        </div>

        {/* Mobile Menu for both dashboard and public pages */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden ml-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {(isDashboard ? DASHBOARD_NAV_LINKS : NAV_LINKS).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-2 py-1 text-lg hover:bg-accent hover:text-accent-foreground rounded-md",
                    pathname === link.href && "bg-accent text-accent-foreground"
                  )}
                >
                  {link.iconName && (
                    // Dynamically create icon component if needed, or just use label
                    // For simplicity, just using label for mobile menu too
                    // <LucideIcon name={link.iconName} className="mr-2 h-5 w-5" />
                    <span /> // Placeholder for icon if you want to add them
                  )}
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
