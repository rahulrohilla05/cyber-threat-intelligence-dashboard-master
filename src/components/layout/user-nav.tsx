
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { LogIn, LogOut, Settings, UserCircle, LayoutDashboard, ChevronDown } from "lucide-react";

export function UserNav() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  if (loading) {
    return <div className="h-10 w-32 animate-pulse rounded-full bg-muted"></div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <Link href="/login">
        <Button variant="outline" className="rounded-full border-primary/50 hover:bg-primary/10 hover:border-primary">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="relative h-10 gap-2 rounded-full border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300 group px-3"
        >
          <Avatar className="h-7 w-7 ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all">
            <AvatarImage src={user.avatarUrl || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name || 'User'} />
            <AvatarFallback className="bg-primary/20 text-primary">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline-block text-sm font-medium">{user.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-primary/30 rounded-2xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/20" />
        <DropdownMenuGroup>
          <Link href="/dashboard">
            <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 rounded-lg">
              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/settings">
            <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 rounded-lg">
              <Settings className="mr-2 h-4 w-4 text-primary" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-primary/20" />
        <DropdownMenuItem onClick={logout} className="cursor-pointer hover:bg-destructive/10 text-destructive focus:text-destructive rounded-lg">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
