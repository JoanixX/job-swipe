import React from 'react';
import BottomNavigation from './BottomNavigation';

interface StudentAppLayoutProps {
  children: React.ReactNode;
  activePage: "inicio" | "movimientos" | "matches" | "perfil";
}

export default function StudentAppLayout({ children, activePage }: StudentAppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      {/* Mobile container - acts like a phone screen on desktop */}
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl flex flex-col overflow-hidden">
        
        {/* Main scrollable content area */}
        <div className="flex-1 overflow-y-auto pb-[70px]">
          {children}
        </div>
        
        {/* Fixed bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0">
          <BottomNavigation activePage={activePage} />
        </div>
        
      </div>
    </div>
  );
}
