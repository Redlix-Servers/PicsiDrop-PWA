import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white font-sans selection:bg-black/5 overflow-hidden">
      {/* Sidebar - Hidden on mobile, flex on desktop */}
      <aside className="hidden lg:flex w-64 bg-[#f2f2f2] border-r border-gray-200 flex-col h-full z-10 shrink-0">
        
        {/* Branding Area */}
        <div className="p-8 pb-10 flex items-center space-x-3">
          <img src="/PicsiDrop/User.png" alt="PicsiDrop" className="w-8 h-8 rounded-none border border-gray-200" />
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-light tracking-tight text-gray-900">
              Picsi<span className="font-semibold text-black ml-0.5">Drop</span>
            </span>
          </Link>
        </div>

        {/* Primary Navigation - Simple Menu */}
        <nav className="flex-1 px-4 space-y-1">
          <Link 
            href="/dashboard" 
            className="flex items-center px-4 py-3 text-sm font-normal text-gray-500 hover:text-black hover:bg-gray-50 transition-all rounded-none group"
          >
            Create Order
          </Link>
          <Link 
            href="/dashboard/track" 
            className="flex items-center px-4 py-3 text-sm font-normal text-gray-500 hover:text-black hover:bg-gray-50 transition-all rounded-none group"
          >
            My Orders
          </Link>
        </nav>

        {/* Footer Area - Minimal */}
        <div className="p-6 border-t border-gray-200/50">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest pl-1 italic">V 1.0.0</span>
        </div>
      </aside>

      {/* Main content + Header */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header - Black, Normal Font, Log Out on Right */}
        <header className="h-14 bg-black flex items-center justify-between px-4 md:px-10 shrink-0 z-20">
            <div className="flex items-center space-x-2 md:space-x-3">
                 <div className="hidden md:block w-2 h-2 bg-white rounded-none"></div>
                 <h2 className="text-[11px] md:text-sm font-light text-white tracking-tight uppercase md:normal-case">Dashboard</h2>
            </div>
            
            {/* Header Right Actions */}
            <div className="flex items-center space-x-3 md:space-x-8">
                <Link 
                  href="/login" 
                  className="text-[10px] md:text-xs font-normal text-white/70 hover:text-white transition-all border border-white/20 px-3 md:px-4 py-1 md:py-1.5 hover:bg-white/10 rounded-none transform active:scale-95"
                >
                  Log Out
                </Link>
                
                {/* Minimal User Avatar Placeholder */}
                <div className="w-6 h-6 md:w-7 md:h-7 bg-white/20 border border-white/30 rounded-none"></div>
            </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-white">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
