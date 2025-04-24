import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileSidebarProvider, useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useMobileSidebar();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 relative">
        {!isMobile && <Sidebar />}
        {isMobile && isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40" 
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <MobileSidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </MobileSidebarProvider>
  );
}