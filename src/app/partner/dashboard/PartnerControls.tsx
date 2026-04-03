"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleUpdatePartnerRoute } from '../../actions/authActions';

export default function PartnerControls({ 
    partner, 
    earnings 
}: { 
    partner: any, 
    earnings: number 
}) {
    const router = useRouter();
    const [from, setFrom] = useState(partner.routeFrom || '');
    const [to, setTo] = useState(partner.routeTo || '');
    const [frequency, setFrequency] = useState(partner.travelFrequency || 'One-time');
    const [time, setTime] = useState(partner.travelTime || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const updateRoute = async () => {
        setIsLoading(true);
        setMessage(null);
        const res = await handleUpdatePartnerRoute(partner.email, from, to, frequency, time);
        if (res.success) {
            setMessage("Your route has been updated.");
            router.refresh();
        } else {
            setMessage("Failed to update your route.");
        }
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12 animate-fade-in">
            {/* Wallet Section */}
            <div className="bg-black text-white p-10 border border-black shadow-[12px_12px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#D2E32B] text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2">
                    Your Money
                </div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-4">Total Earnings</p>
                <h2 className="text-6xl font-light tracking-tighter text-white mb-10">₹{earnings.toFixed(2)}</h2>
                
                <div className="flex gap-4">
                    <button className="flex-1 bg-white text-black py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#D2E32B] transition-all active:translate-y-1">
                        Get Paid (UPI)
                    </button>
                    <button className="flex-1 border border-white/20 text-white/50 py-4 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all">
                        History
                    </button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">v 1.0</span>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Bank Link: Connected</span>
                    </div>
                </div>
            </div>

            {/* Route Management Section */}
            <div className="bg-white border-2 border-black p-10 shadow-[12px_12px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2">
                    Route Settings
                </div>
                <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-10 border-b border-gray-100 pb-4">Where are you going?</h3>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">From City</label>
                            <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border-b border-gray-200 p-2 text-sm font-bold text-black focus:border-black outline-none rounded-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">To City</label>
                            <input type="text" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border-b border-gray-200 p-2 text-sm font-bold text-black focus:border-black outline-none rounded-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">How often?</label>
                            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full border-b border-gray-200 p-2 text-[10px] font-bold text-black outline-none rounded-none bg-transparent">
                                <option>One-time</option>
                                <option>Daily</option>
                                <option>Weekly</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1">Date & Time</label>
                            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. Monday 10 AM" className="w-full border-b border-gray-200 p-2 text-xs font-bold text-black outline-none rounded-none" />
                        </div>
                    </div>

                    {message && (
                        <div className="text-[10px] font-bold text-black bg-gray-50 py-3 uppercase tracking-widest pl-4 mb-4 border-l-4 border-black">{message}</div>
                    )}

                    <button 
                        onClick={updateRoute}
                        disabled={isLoading || !from || !to}
                        className="w-full bg-black text-white py-5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all"
                    >
                        {isLoading ? 'Updating...' : 'Save My Route'}
                    </button>
                    <p className="text-[9px] text-gray-400 font-normal italic text-center mt-4">We will show you delivery requests matching this route.</p>
                </div>
            </div>
        </div>
    );
}
