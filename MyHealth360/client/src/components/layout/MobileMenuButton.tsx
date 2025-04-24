import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";

export default function MobileMenuButton() {
  const { setMobileSidebarOpen } = useMobileSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setMobileSidebarOpen(true)}
      className="md:hidden"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
}