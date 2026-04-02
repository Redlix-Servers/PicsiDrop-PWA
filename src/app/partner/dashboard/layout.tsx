import React from 'react';
import Link from 'next/link';

export default function PartnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-white font-sans selection:bg-black/5">
      {/* Sidebar - Grey background */}
      <aside className="w-64 bg-[#f2f2f2] border-r border-gray-200 flex flex-col h-full z-10 shrink-0">
        
        {/* Branding Area */}
        <div className="p-8 pb-10">
          <Link href="/partner/dashboard" className="flex items-center">
            <span className="text-xl font-light tracking-tight text-gray-900">
              Picsi<span className="font-semibold text-black ml-0.5">Drop</span>
              <span className="ml-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none pt-1">
                 Partner
              </span>
            </span>
          </Link>
        </div>

        {/* Primary Navigation - Simple Menu */}
        <nav className="flex-1 px-4 space-y-1">
          <Link 
            href="/partner/dashboard" 
            className="flex items-center px-4 py-3.5 text-sm font-normal text-black bg-white border-l-4 border-black transition-all shadow-sm rounded-none"
          >
            Overview
          </Link>
          <Link 
            href="#" 
            className="flex items-center px-4 py-3.5 text-sm font-normal text-gray-500 hover:text-black hover:bg-gray-50 border-l-4 border-transparent transition-all rounded-none"
          >
            My Deliveries
          </Link>
          <Link 
            href="#" 
            className="flex items-center px-4 py-3.5 text-sm font-normal text-gray-500 hover:text-black hover:bg-gray-50 border-l-4 border-transparent transition-all rounded-none"
          >
            Earnings Wallet
          </Link>
        </nav>

        {/* Footer Area - Minimal */}
        <div className="p-6 border-t border-gray-200/50">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest pl-1 italic">V 1.0.0</span>
        </div>
      </aside>

      {/* Main content + Header */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header - Black */}
        <header className="h-14 bg-black flex items-center justify-between px-10 shrink-0 z-20">
            <div className="flex items-center space-x-3">
                 <div className="w-2 h-2 bg-white rounded-none"></div>
                 <h2 className="text-sm font-light text-white tracking-tight">Partner Dashboard Overview</h2>
            </div>
            
            {/* Header Right Actions */}
            <div className="flex items-center space-x-8">
                <Link 
                  href="/partner/login" 
                  className="text-xs font-normal text-white/70 hover:text-white transition-all border border-white/20 px-4 py-1.5 hover:bg-white/10 rounded-none transform active:scale-95"
                >
                  Log Out
                </Link>
                
                {/* Minimal User Avatar Placeholder */}
                <div className="w-7 h-7 bg-[#222] border border-[#333] rounded-none flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">PT</span>
                </div>
            </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-12 bg-white">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
