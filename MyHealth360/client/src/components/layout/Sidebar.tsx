import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Activity,
  Calendar,
  Home,
  Pill,
  Stethoscope,
  Heart,
  BarChart,
  UserCircle,
  FileText,
  Settings,
  Shield,
  LineChart,
  FirstAid,
  Dumbbell,
  BedDouble,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const SidebarLink = ({ 
  href, 
  icon: Icon, 
  label, 
  active 
}: { 
  href: string; 
  icon: React.ElementType; 
  label: string; 
  active: boolean;
}) => {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center gap-3 px-3 py-2 my-1 rounded-md text-sm transition-colors cursor-pointer",
        active 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted hover:text-foreground"
      )}>
        <Icon size={18} />
        <span>{label}</span>
      </div>
    </Link>
  );
};

export function Sidebar() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useMobileSidebar();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    return path !== "/" && location.startsWith(path);
  };

  const NavLinks = () => (
    <>
      <SidebarLink
        href="/"
        icon={Home}
        label="Dashboard"
        active={isActive("/")}
      />
      <SidebarLink
        href="/telemedicine"
        icon={Stethoscope}
        label="Telemedicine"
        active={isActive("/telemedicine")}
      />
      <SidebarLink
        href="/consult"
        icon={Calendar}
        label="Consultations"
        active={isActive("/consult")}
      />
      <SidebarLink
        href="/diagnose"
        icon={Activity}
        label="Diagnostics"
        active={isActive("/diagnose")}
      />
      <SidebarLink
        href="/pharmacy"
        icon={Pill}
        label="Pharmacy"
        active={isActive("/pharmacy")}
      />
      <SidebarLink
        href="/wellness"
        icon={Heart}
        label="Wellness"
        active={isActive("/wellness")}
      />
      <SidebarLink
        href="/health-data"
        icon={LineChart}
        label="Health Data"
        active={isActive("/health-data")}
      />
      <SidebarLink 
        href="/nursing" 
        icon={Stethoscope} 
        label="Nursing Care" 
        active={isActive("/nursing")}
      />
      <SidebarLink 
        href="/physiotherapy" 
        icon={Dumbbell} 
        label="Physiotherapy" 
        active={isActive("/physiotherapy")}
      />
      <SidebarLink 
        href="/bedside-attendant" 
        icon={BedDouble} 
        label="Bedside Attendant" 
        active={isActive("/bedside-attendant")}
      />
      <div className="mt-auto">
        <SidebarLink
          href="/settings"
          icon={Settings}
          label="Settings"
          active={isActive("/settings")}
        />
        <SidebarLink
          href="/privacy"
          icon={Shield}
          label="Privacy"
          active={isActive("/privacy")}
        />
        {user && (
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 px-3 py-2 my-1"
            onClick={handleLogout}
          >
            <FileText size={18} />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </>
  );

  if (isMobile) {
    // Return empty div when sidebar is closed on mobile
    if (!isMobileSidebarOpen) return null;

    return (
      <div className="w-64 h-screen fixed left-0 top-0 bg-background border-r border-border z-50 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSidebarOpen(false)}
          >
            ✕
          </Button>
        </div>
        <div className="flex flex-col h-full">
          <NavLinks />
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-screen bg-background border-r border-border p-4 flex flex-col sticky top-0 left-0">
      <div className="flex flex-col h-full">
        <NavLinks />
      </div>
    </div>
  );
}