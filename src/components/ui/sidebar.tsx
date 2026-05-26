
"use client";
// This component is no longer used after removing the sidebar.
// It can be safely deleted or kept for future reference.
// For now, its content is commented out to prevent any build issues if still imported elsewhere.
/*
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

// === Context ===

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapsible: "icon" | "button" | "none";
  isMobile: boolean;
  // For dynamic width based on open/closed state
  width: string;
  iconWidth: string;
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// === Provider ===

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: "icon" | "button" | "none";
}

function SidebarProvider({
  children,
  defaultOpen = true,
  collapsible = "icon",
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(isMobile ? false : defaultOpen);

  // Dynamic width based on CSS variables
  const [width, setWidth] = React.useState("var(--sidebar-width, 280px)");
  const [iconWidth, setIconWidth] = React.useState(
    "var(--sidebar-width-icon, 56px)"
  ); // Standard button size

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const rootStyle = getComputedStyle(document.documentElement);
      setWidth(rootStyle.getPropertyValue("--sidebar-width").trim() || "280px");
      setIconWidth(
        rootStyle.getPropertyValue("--sidebar-width-icon").trim() || "56px"
      );
    }
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      setOpen(false); // Close sidebar on mobile by default
    } else {
      setOpen(defaultOpen); // Respect defaultOpen on desktop
    }
  }, [isMobile, defaultOpen]);

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, collapsible, isMobile, width, iconWidth }}
    >
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
}

// === Root Component ===

const sidebarRootVariants = cva(
  "fixed inset-y-0 left-0 z-40 flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out data-[state=closed]:[--sidebar-width:var(--sidebar-width-icon)] group",
  {
    variants: {
      collapsible: {
        icon: "",
        button: "",
        none: "",
      },
      isMobile: {
        true: "data-[state=closed]:-translate-x-full",
        false: "",
      },
    },
    compoundVariants: [
      {
        collapsible: "icon",
        isMobile: false,
        className: "data-[state=closed]:w-[--sidebar-width-icon]",
      },
      {
        collapsible: "button",
        isMobile: false,
        className: "data-[state=closed]:w-[--sidebar-width-icon]",
      },
    ],
  }
);

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarRootVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    const { open, collapsible, isMobile, width, iconWidth } = useSidebar();
    const currentWidth = open ? width : iconWidth;

    return (
      <div
        ref={ref}
        data-state={open ? "expanded" : "closed"}
        data-collapsible={collapsible}
        className={cn(
          sidebarRootVariants({ collapsible, isMobile }),
          className
        )}
        style={{ width: currentWidth, "--current-sidebar-width": currentWidth } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

// === Header ===
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open, collapsible } = useSidebar();
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-16 items-center border-b border-sidebar-border px-4 shrink-0",
        className
      )}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

// === Content ===
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

// === Footer ===
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-auto border-t border-sidebar-border p-2 shrink-0",
      className
    )}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

// === Trigger ===
interface SidebarTriggerProps extends ButtonProps {
  asChild?: boolean;
}

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, children, asChild, ...props }, ref) => {
  const { open, setOpen, collapsible, isMobile } = useSidebar();

  const handleClick = () => {
    setOpen(!open);
  };

  if (collapsible === "none" && !isMobile) return null;

  const Comp = asChild ? Slot : Button;

  if (asChild && children) {
    return (
      <Comp onClick={handleClick} ref={ref} {...props}>
        {children}
      </Comp>
    );
  }
  
  let triggerClassName = className;
  if (isMobile) {
    triggerClassName = cn("fixed bottom-4 right-4 z-50 lg:hidden", className);
  } else if (collapsible === 'button') {
    triggerClassName = cn("absolute -right-4 top-1/2 -translate-y-1/2 hidden md:flex", className);
  } else if (collapsible === 'icon') {
    triggerClassName = cn("hidden", className); 
  }


  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        triggerClassName
      )}
      onClick={handleClick}
      data-state={open ? "open" : "closed"}
      aria-label={open ? "Close sidebar" : "Open sidebar"}
      {...props}
    >
      {children || (
        <>
          <PanelLeft />
          <span className="sr-only">{open ? "Close" : "Open"} sidebar</span>
        </>
      )}
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

// === Menu Components ===
const menuBaseStyles =
  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring group";

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  );
});
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  asChild?: boolean;
  tooltip?: string;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    { className, children, isActive, asChild = false, tooltip, ...props },
    ref
  ) => {
    const { open, collapsible } = useSidebar();
    const Comp = asChild ? Slot : "button";
    
    const isIconCollapsed = collapsible === 'icon' && !open;

    const buttonContent = (
      <Comp
        ref={ref}
        data-icon-collapsed={isIconCollapsed} // Add data attribute
        className={cn(
          menuBaseStyles,
          "w-full justify-start", 
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isIconCollapsed && "justify-center", 
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );

    if (isIconCollapsed && tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      );
    }
    return buttonContent;
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

// === Grouping ===
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-2 space-y-1", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, collapsible } = useSidebar();
  if (collapsible === "icon" && !open) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

// === Optional Inset (for visual structure when collapsed) ===
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, collapsible } = useSidebar();
  if (collapsible !== "icon" || open) return <>{children}</>;

  return (
    <div
      ref={ref}
      className={cn("flex justify-center", className)}
      {...props}
    >
      <div className="w-[var(--sidebar-width-icon)] flex justify-center items-center">
        {children}
      </div>
    </div>
  );
});
SidebarInset.displayName = "SidebarInset";

// === SubMenu Components (Basic Example) ===
const SidebarMenuSub = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, collapsible } = useSidebar();
  if (collapsible === "icon" && !open) return null; 

  return (
    <div
      ref={ref}
      className={cn("ml-4 pl-3 border-l border-sidebar-border/50 space-y-1", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props} />
));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

interface SidebarMenuSubButtonProps extends SidebarMenuButtonProps {}

const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuSubButtonProps
>(({ className, children, isActive, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        menuBaseStyles,
        "w-full justify-start text-sm",
        isActive
          ? "bg-sidebar-accent/80 text-sidebar-accent-foreground hover:bg-sidebar-accent"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";


export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
};
*/
export {}; // Add an empty export to make it a module if all content is commented out
