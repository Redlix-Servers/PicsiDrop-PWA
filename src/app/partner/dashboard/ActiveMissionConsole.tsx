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
            <div className={`absolute top-0 right-0 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 ${isInTransit ? 'bg-blue-600' : isDelivered ? 'bg-green-600' : 'bg-orange-500'}`}>
                {activeParcel.status === 'Accepted' ? 'Awaiting Pickup' : activeParcel.status === 'InTransit' ? 'Onto Delivery' : 'Delivered'}
            </div>

            <div className="mb-8 border-b border-gray-100 pb-8">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-3">Sender Name</p>
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-black text-[#D2E32B] flex items-center justify-center font-bold text-2xl border-2 border-black">
                        {activeParcel.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h2 className="text-2xl font-light tracking-tight text-black">{activeParcel.user?.name || "Customer"}</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">{activeParcel.user?.phoneNumber || "+91 ••••• •••••"}</p>
                    </div>
                </div>
            </div>

            <div className="flex border-b border-gray-100 pb-8 mb-8 gap-10">
                 <div className="flex-1 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-black tracking-widest">Pick Up From</p>
                      <h3 className="text-xl font-light text-black truncate">{activeParcel.pickupLocation}</h3>
                 </div>
                 <div className="flex-1 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-black tracking-widest text-[#D2E32B]">Drop Off To</p>
                      <h3 className="text-xl font-light text-black truncate">{activeParcel.dropLocation}</h3>
                 </div>
            </div>

             <div className="grid grid-cols-3 gap-6 mb-10 text-center bg-gray-50 border border-gray-100 p-6 shadow-inner">
                  <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">You Earn</p>
                      <p className="text-xl font-bold text-black">₹{(activeParcel.price * 0.8).toFixed(2)}</p>
                  </div>
                  <div className="border-l border-r border-gray-200 space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Weight</p>
                      <p className="text-sm font-bold text-gray-700">{activeParcel.weight} KG</p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Speed</p>
                      <p className="text-xs font-bold text-red-600 uppercase tracking-widest">{activeParcel.urgency}</p>
                  </div>
              </div>

            {/* OTP INTERACTION BLOCK */}
            {(isPickup || isInTransit) && (
                <div className="bg-black text-white p-8 space-y-6">
                    <div className="space-y-2">
                        <p className="text-[10px] text-[#D2E32B] font-bold uppercase tracking-widest">
                            {isPickup ? 'STEP 1: GET PICKUP OTP' : 'STEP 2: GET DELIVERY OTP'}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-widest">
                            {isPickup 
                                ? "Ask the sender for the 4-digit code to start the delivery." 
                                : "Ask the receiver for the 4-digit code to finish the delivery."}
                        </p>
                    </div>
                    
                    {error && (
                        <div className="text-[10px] text-red-400 font-bold bg-white/5 py-3 border border-red-900/50 uppercase tracking-widest pl-4">
                           Error: {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <input 
                            type="text" 
                            placeholder="Enter OTP" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={4}
                            className="w-full md:flex-1 border border-white/20 bg-white/5 p-5 text-center text-2xl font-light outline-none focus:border-[#D2E32B] transition-all rounded-none text-white"
                        />
                        <button 
                            onClick={handleVerify}
                            disabled={isLoading || otp.length < 4}
                            className="w-full md:w-auto bg-[#D2E32B] text-black px-10 py-5 font-bold uppercase tracking-widest hover:bg-white disabled:bg-gray-700 transition-all"
                        >
                            {isLoading ? 'Checking...' : 'Verify'}
                        </button>
                    </div>
                </div>
            )}

            {isDelivered && (
                 <div className="bg-green-600 text-white p-10 text-center animate-fade-in">
                    <h2 className="text-3xl font-light tracking-tight mb-2">Delivery Done!</h2>
                    <p className="text-xs text-white/80 font-bold uppercase tracking-[0.2em]">Money has been added to your wallet.</p>
                </div>
            )}
        </div>
    );
}
