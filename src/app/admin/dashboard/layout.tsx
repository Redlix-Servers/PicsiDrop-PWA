import React from 'react';
import Link from 'next/link';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] font-sans selection:bg-black/5">
      {/* Sidebar - Dark theme for Admin */}
      <aside className="w-64 bg-black flex flex-col h-full z-10 shrink-0 shadow-2xl relative">
        
        {/* Branding Area */}
        <div className="p-8 pb-10 border-b border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-xl font-light tracking-tight text-white">
              Picsi<span className="font-semibold text-white ml-0.5">Drop</span>
              <span className="ml-2 text-[9px] font-medium text-black bg-[#D2E32B] px-1.5 py-0.5 leading-none">
                 Admin
              </span>
            </span>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          <h3 className="text-[10px] font-medium text-gray-500 tracking-widest px-4 mb-4">Admin Control</h3>
          
          <Link 
            href="/admin/dashboard" 
            className="flex items-center px-4 py-3 text-sm font-normal text-gray-300 hover:text-white hover:bg-gray-900 border-l-2 border-transparent hover:border-white transition-all group"
          >
            <span className="group-hover:translate-x-1 transition-transform">Main Summary</span>
          </Link>
          <Link 
            href="/admin/dashboard/monitor" 
            className="flex items-center px-4 py-3 text-sm font-normal text-gray-300 hover:text-white hover:bg-gray-900 border-l-2 border-transparent hover:border-white transition-all group"
          >
            <span className="group-hover:translate-x-1 transition-transform">Watch Deliveries</span>
          </Link>

          <h3 className="text-[10px] font-medium text-gray-500 tracking-widest px-4 pt-10 mb-4">Manage People</h3>
          <Link 
            href="/admin/dashboard/users" 
            className="flex items-center px-4 py-3 text-sm font-normal text-gray-300 hover:text-white hover:bg-gray-900 border-l-2 border-transparent hover:border-white transition-all group"
          >
            <span className="group-hover:translate-x-1 transition-transform">User List</span>
          </Link>
          <Link 
            href="/admin/dashboard/partners" 
            className="flex items-center px-4 py-3 text-sm font-normal text-gray-300 hover:text-white hover:bg-gray-900 border-l-2 border-transparent hover:border-white transition-all group"
          >
            <span className="group-hover:translate-x-1 transition-transform">Driver List</span>
          </Link>

          <h3 className="text-[10px] font-medium text-gray-500 tracking-widest px-4 pt-10 mb-4">Help & Money</h3>
          <Link 
            href="/admin/dashboard/disputes" 
            className="flex items-center px-4 py-3 text-sm font-normal text-gray-300 hover:text-white hover:bg-gray-900 border-l-2 border-transparent hover:border-white transition-all group"
          >
            <span className="group-hover:translate-x-1 transition-transform">Help & Disputes</span>
          </Link>
          <Link 
            href="/admin/dashboard/payments" 
            className="flex items-center px-4 py-3 text-sm font-normal text-gray-300 hover:text-white hover:bg-gray-900 border-l-2 border-transparent hover:border-white transition-all group"
          >
            <span className="group-hover:translate-x-1 transition-transform">Payments & Earnings</span>
          </Link>
        </nav>

        {/* Footer Area */}
        <div className="p-6 border-t border-gray-800">
           <Link 
              href="/admin/login" 
              className="flex items-center px-4 py-2 text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest transition-all rounded-none gap-2"
            >
              <span>×</span> System Logout
            </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f4f4f5]">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-10 shrink-0 z-20">
            <div className="flex items-center space-x-3">
                 <div className="w-2 h-2 bg-black rounded-none"></div>
                 <h2 className="text-sm font-bold text-black tracking-widest uppercase">Command Center</h2>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Online</span>
                </div>
            </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-12">
          <div className="max-w-[1400px] mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
