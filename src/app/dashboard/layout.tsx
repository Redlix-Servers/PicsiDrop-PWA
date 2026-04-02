"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-white font-sans selection:bg-black/5 overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar - Slide in from left */}
      <div className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-[70] lg:hidden transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/PicsiDrop/User.png" alt="PicsiDrop" className="w-6 h-6 rounded-none border border-gray-200" />
              <span className="text-lg font-light tracking-tight text-gray-900">
                Picsi<span className="font-semibold text-black ml-0.5">Drop</span>
              </span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <nav className="p-6 space-y-4">
          <Link 
            href="/dashboard" 
            onClick={() => setIsSidebarOpen(false)}
            className="block text-sm font-normal text-gray-600 hover:text-black transition-colors"
          >
            Create Order
          </Link>
          <Link 
            href="/dashboard/track" 
            onClick={() => setIsSidebarOpen(false)}
            className="block text-sm font-normal text-gray-600 hover:text-black transition-colors"
          >
            My Orders
          </Link>
        </nav>
      </div>

      {/* Sidebar - Hidden on mobile, flex on desktop */}
      <aside className="hidden lg:flex w-64 bg-[#f2f2f2] border-r border-gray-200 flex-col h-full z-10 shrink-0">
        <div className="p-8 pb-10 flex items-center space-x-3">
          <img src="/PicsiDrop/User.png" alt="PicsiDrop" className="w-8 h-8 rounded-none border border-gray-200" />
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-light tracking-tight text-gray-900">
              Picsi<span className="font-semibold text-black ml-0.5">Drop</span>
            </span>
          </Link>
        </div>

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

        <div className="p-6 border-t border-gray-200/50">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest pl-1 italic">V 1.0.0</span>
        </div>
      </aside>

      {/* Main content + Header */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-black flex items-center justify-between px-4 md:px-10 shrink-0 z-20">
            <div className="flex items-center space-x-2 md:space-x-3">
                 {/* Hamburger Menu - The "Three Lines" for Mobile Access */}
                 <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden w-10 h-10 flex flex-col justify-center items-center space-y-1.5 text-white active:bg-white/10 transition-colors"
                 >
                    <span className="w-6 h-0.5 bg-white"></span>
                    <span className="w-6 h-0.5 bg-white"></span>
                    <span className="w-6 h-0.5 bg-white"></span>
                 </button>

                 <div className="hidden md:block w-2 h-2 bg-white rounded-none"></div>
                 <h2 className="text-[11px] md:text-sm font-light text-white tracking-tight uppercase md:normal-case">Dashboard</h2>
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-8">
                <Link 
                  href="/login" 
                  className="text-[10px] md:text-xs font-normal text-white/70 hover:text-white transition-all border border-white/20 px-3 md:px-4 py-1 md:py-1.5 hover:bg-white/10 rounded-none transform active:scale-95"
                >
                  Log Out
                </Link>
                <div className="w-6 h-6 md:w-7 md:h-7 bg-white/20 border border-white/30 rounded-none"></div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-white">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
