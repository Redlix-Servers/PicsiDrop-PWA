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
            setMessage("Logistics Corridor Updated Successfully.");
            router.refresh();
        } else {
            setMessage("Failed to update corridor.");
        }
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12 animate-fade-in">
            {/* Wallet Section */}
            <div className="bg-black text-white p-10 border border-black shadow-[12px_12px_0px_rgba(210,227,43,1)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-[#D2E32B] text-black text-[10px] font-extrabold uppercase tracking-widest px-4 py-2">
                    Settlement Port
                </div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.3em] mb-4">Total Life-cycle Earnings</p>
                <h2 className="text-6xl font-light tracking-tighter text-white mb-10">₹{earnings.toFixed(2)}</h2>
                
                <div className="flex gap-4">
                    <button className="flex-1 bg-white text-black py-4 text-[10px] font-extrabold uppercase tracking-widest hover:bg-[#D2E32B] transition-all shadow-xl active:translate-y-1">
                        Withdraw (UPI)
                    </button>
                    <button className="flex-1 border border-white/20 text-white/50 py-4 text-[10px] font-extrabold uppercase tracking-widest hover:text-white hover:border-white transition-all">
                        Ledger
                    </button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">V 1.0 Logistics Protocol</span>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Bank Sync: Active</span>
                    </div>
                </div>
            </div>

            {/* Route Management Section */}
            <div className="bg-white border-2 border-black p-10 shadow-[12px_12px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2">
                    Trajectory Config
                </div>
                <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-10 border-b border-gray-100 pb-4">Manage Logistics Corridor</h3>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">Starting Point</label>
                            <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border-b border-gray-200 p-2 text-sm font-bold text-black transition-all focus:border-black outline-none rounded-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">End Point</label>
                            <input type="text" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border-b border-gray-200 p-2 text-sm font-bold text-black transition-all focus:border-black outline-none rounded-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">Travel Intensity</label>
                            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full border-b border-gray-200 p-2 text-[10px] font-bold text-black outline-none rounded-none bg-transparent">
                                <option>One-time</option>
                                <option>Daily</option>
                                <option>Weekly</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">Date & Time</label>
                            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="01-Apr • 09:00" className="w-full border-b border-gray-200 p-2 text-xs font-bold text-black outline-none rounded-none" />
                        </div>
                    </div>

                    {message && (
                        <div className="text-[10px] font-bold text-black bg-gray-50 py-3 uppercase tracking-widest pl-4 mb-4 border-l-4 border-[#D2E32B]">{message}</div>
                    )}

                    <button 
                        onClick={updateRoute}
                        disabled={isLoading || !from || !to}
                        className="w-full bg-black text-white py-5 text-[11px] font-extrabold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all shadow-xl"
                    >
                        {isLoading ? 'Recalibrating Operations...' : 'Update Active Corridor'}
                    </button>
                </div>
            </div>
        </div>
    );
}
