
"use client";
// This component is no longer used after removing the sidebar.
// It can be safely deleted or kept for future reference if a complex top nav is needed.
// For now, its content is commented out to prevent any build issues if still imported elsewhere.
/*
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Add type safety for icon names
type IconName = keyof typeof LucideIcons;

interface NavLink {
  href: string;
  label: string;
  iconName?: IconName; // Make iconName optional
  subItems?: NavLink[]; // For nested navigation
}

interface MainNavProps {
  links: NavLink[];
}

export function MainNav({ links }: MainNavProps) {
  const pathname = usePathname();
  // Not needed here as SidebarMenuButton handles its own state
  // const { open, collapsible } = useSidebar(); 

  const renderLink = (link: NavLink, isSubItem: boolean = false) => {
    const IconComponent = link.iconName ? LucideIcons[link.iconName] as LucideIcons.LucideIcon : LucideIcons.ChevronRight;
    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

    if (isSubItem) {
      return (
        <SidebarMenuSubItem key={link.href}>
          <Link href={link.href} legacyBehavior passHref>
            <SidebarMenuSubButton isActive={isActive} aria-label={link.label}>
              {link.iconName && <IconComponent />} 
              <span className="group-data-[icon-collapsed=true]:hidden whitespace-nowrap">{link.label}</span>
            </SidebarMenuSubButton>
          </Link>
        </SidebarMenuSubItem>
      );
    }

    return (
      <SidebarMenuItem key={link.href}>
        <Link href={link.href} legacyBehavior passHref>
          <SidebarMenuButton isActive={isActive} tooltip={link.label}>
            <IconComponent />
            <span className="group-data-[icon-collapsed=true]:hidden whitespace-nowrap">{link.label}</span>
          </SidebarMenuButton>
        </Link>
        {link.subItems && link.subItems.length > 0 && isActive && ( // Submenu still depends on 'open' state if it's not to be shown when parent is icon only
           <SidebarMenuSub>
            {link.subItems.map(subLink => renderLink(subLink, true))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };
  
  const mainLinks = links.filter(link => !link.href.includes('settings'));
  const settingsLinks = links.filter(link => link.href.includes('settings'));


  return (
    <SidebarMenu>
        {mainLinks.map(link => renderLink(link))}
      
      {settingsLinks.length > 0 && (
        <SidebarGroup className="pt-4 border-t border-sidebar-border">
          {settingsLinks.map(link => renderLink(link))}
        </SidebarGroup>
      )}
    </SidebarMenu>
  );
}
*/

export {}; // Add an empty export to make it a module if all content is commented out
