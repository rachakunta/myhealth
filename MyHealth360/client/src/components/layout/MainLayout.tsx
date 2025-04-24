import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNavbar } from "./MobileNavbar";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useMobileSidebar();
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Topbar */}
        <div className="md:hidden bg-white px-4 py-3 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                <i className="fas fa-heartbeat text-white text-lg"></i>
              </div>
              <span className="ml-2 font-semibold text-lg text-neutral-900">MyHealth360</span>
            </div>
            <button 
              type="button" 
              className="bg-white p-2 rounded-md text-neutral-700"
              onClick={() => setMobileSidebarOpen(prev => !prev)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
        )}
        
        {/* Mobile Sidebar */}
        <div className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out`}>
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-100 p-4 md:p-6">
          {children}
        </main>
        
        {/* Mobile Navigation Footer */}
        <MobileNavbar />
      </div>
    </div>
  );
}
