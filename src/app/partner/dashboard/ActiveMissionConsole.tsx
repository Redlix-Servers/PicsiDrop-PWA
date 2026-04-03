"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyPickupOTP, verifyDeliveryOTP } from '../../actions/parcelActions';

export default function ActiveMissionConsole({ activeParcel }: { activeParcel: any }) {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isPickup = activeParcel.status === 'Accepted';
    const isInTransit = activeParcel.status === 'InTransit';
    const isDelivered = activeParcel.status === 'Delivered';

    const handleVerify = async () => {
        setIsLoading(true);
        setError(null);
        
        const action = isPickup ? verifyPickupOTP : verifyDeliveryOTP;
        const res = await action(activeParcel.id, otp);
        
        if (res.success) {
            setOtp('');
            router.refresh(); 
        } else {
            setError(res.error || "Verification failed");
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 md:p-12 max-w-2xl mx-auto animate-fade-in relative overflow-hidden">
            <div className={`absolute top-0 right-0 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 ${isInTransit ? 'bg-blue-600 animate-pulse' : isDelivered ? 'bg-green-600' : 'bg-orange-500 animate-pulse'}`}>
                {activeParcel.status === 'Accepted' ? 'Awaiting Handshake' : activeParcel.status === 'InTransit' ? 'In Transit' : 'Arrival Confirmed'}
            </div>

            <div className="mb-8 border-b border-gray-100 pb-8">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-3">Target Client</p>
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-black text-[#D2E32B] flex items-center justify-center font-bold text-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                        {activeParcel.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h2 className="text-2xl font-light tracking-tight text-black">{activeParcel.user?.name || "Verified Network User"}</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">{activeParcel.user?.phoneNumber || "+91 ••••• •••••"}</p>
                    </div>
                </div>
            </div>

            <div className="flex border-b border-gray-100 pb-8 mb-8 gap-10">
                 <div className="flex-1 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-black tracking-widest">Entry Point</p>
                      <h3 className="text-xl font-light text-black truncate">{activeParcel.pickupLocation}</h3>
                 </div>
                 <div className="flex-1 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-black tracking-widest text-[#D2E32B] border-b border-[#D2E32B]">Extraction Point</p>
                      <h3 className="text-xl font-light text-black truncate">{activeParcel.dropLocation}</h3>
                 </div>
            </div>

             <div className="grid grid-cols-3 gap-6 mb-10 text-center bg-gray-50 border border-gray-100 p-6 shadow-inner">
                  <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Net Payout</p>
                      <p className="text-xl font-bold text-black">₹{(activeParcel.price * 0.8).toFixed(2)}</p>
                  </div>
                  <div className="border-l border-r border-gray-200 space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Payload</p>
                      <p className="text-sm font-bold text-gray-700">{activeParcel.weight} KG</p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Type</p>
                      <p className="text-xs font-bold text-red-600 uppercase tracking-widest">{activeParcel.urgency}</p>
                  </div>
              </div>

            {/* OTP INTERACTION BLOCK */}
            {(isPickup || isInTransit) && (
                <div className="bg-black text-white p-8 space-y-6 shadow-[8px_8px_0px_rgba(210,227,43,1)]">
                    <div className="space-y-2">
                        <p className="text-[10px] text-[#D2E32B] font-bold uppercase tracking-widest">
                            {isPickup ? 'PHASE 01: ORIGIN HANDSHAKE' : 'PHASE 02: DESTINATION TERMINAL'}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-widest">
                            {isPickup 
                                ? "Validate the 4-digit pickup code provided by the sender." 
                                : "Collect the final authorization code from the receiver to release cargo."}
                        </p>
                    </div>
                    
                    {error && (
                        <div className="text-[10px] text-red-400 font-bold bg-white/5 py-3 border border-red-900/50 uppercase tracking-widest pl-4">
                           Signal Error: {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <input 
                            type="text" 
                            placeholder="INPUT CODE" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={4}
                            className="w-full md:flex-1 border-2 border-white/20 bg-white/5 p-5 text-center text-2xl font-light tracking-[0.5em] outline-none focus:border-[#D2E32B] transition-all rounded-none text-white"
                        />
                        <button 
                            onClick={handleVerify}
                            disabled={isLoading || otp.length < 4}
                            className="w-full md:w-auto bg-[#D2E32B] text-black px-10 py-5 font-bold uppercase tracking-widest hover:bg-white disabled:bg-gray-700 transition-all flex items-center justify-center gap-3"
                        >
                            {isLoading ? 'SYNCING...' : 'AUTH'}
                            <span className="text-lg">→</span>
                        </button>
                    </div>
                </div>
            )}

            {isDelivered && (
                 <div className="bg-green-600 text-white p-10 text-center animate-fade-in border-4 border-white shadow-[0_20px_50px_rgba(34,197,94,0.3)]">
                    <div className="w-20 h-20 bg-white text-green-600 rounded-none flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl">✓</div>
                    <h2 className="text-3xl font-light tracking-tight mb-4">Payload Delivered</h2>
                    <p className="text-xs text-white/80 font-bold uppercase tracking-[0.2em]">Escrow Funds Released to Wallet</p>
                </div>
            )}
        </div>
    );
}
