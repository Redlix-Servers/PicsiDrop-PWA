"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyPickupOTP } from '../../actions/parcelActions';

export default function ActiveMissionConsole({ activeParcel }: { activeParcel: any }) {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        setIsLoading(true);
        setError(null);
        
        const res = await verifyPickupOTP(activeParcel.id, otp);
        if (res.success) {
            router.refresh(); // Triggers server component to refetch InTransit state
        } else {
            setError(res.error || "Verification failed");
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-8 max-w-2xl mx-auto animate-fade-in relative">
            <div className={`absolute top-0 right-0 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 ${activeParcel.status === 'Accepted' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}>
                {activeParcel.status === 'Accepted' ? 'Awaiting Handshake' : 'In Transit'}
            </div>

            <div className="mb-6 border-b border-gray-100 pb-6">
                <h2 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Sender Information</h2>
                <p className="text-xl font-light tracking-tight text-black">{activeParcel.user?.name || "Verified Network User"}</p>
                <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500 font-mono">{activeParcel.user?.phoneNumber || "Contact hidden"}</span>
                </div>
            </div>

            <div className="flex border-b border-gray-100 pb-6 mb-6">
                 <div className="flex-1 border-r border-gray-100 pr-6">
                      <p className="text-[10px] uppercase font-bold text-black tracking-widest mb-1">Origin Pickup</p>
                      <h3 className="text-lg font-medium text-black">{activeParcel.pickupLocation}</h3>
                 </div>
                 <div className="flex-1 pl-6">
                      <p className="text-[10px] uppercase font-bold text-black tracking-widest mb-1">Final Drop</p>
                      <h3 className="text-lg font-medium text-black">{activeParcel.dropLocation}</h3>
                 </div>
            </div>

             <div className="grid grid-cols-3 gap-4 mb-8 text-center bg-[#fafafa] border border-gray-200 py-4">
                  <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Payout</p>
                      <p className="text-lg font-bold text-green-600">₹{activeParcel.price.toFixed(2)}</p>
                  </div>
                  <div className="border-l border-r border-gray-200">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Cargo Weight</p>
                      <p className="text-sm font-bold text-gray-700 mt-1">{activeParcel.weight} KG</p>
                  </div>
                  <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Dimension</p>
                      <p className="text-sm font-bold text-gray-700 mt-1 uppercase">{activeParcel.dimensions || "N/A"}</p>
                  </div>
              </div>

            {/* OTP INTERACTION BLOCK */}
            {activeParcel.status === 'Accepted' && (
                <div className="bg-[#fafafa] border border-gray-200 p-6 text-center space-y-4">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                        To establish chain of custody, input the <span className="text-black">terminal authorization code</span> provided securely by the sender at the origin.
                    </p>
                    
                    {error && (
                        <div className="text-xs text-red-600 font-bold bg-red-50 py-2 border border-red-200">{error}</div>
                    )}

                    <div className="flex items-center space-x-4 max-w-sm mx-auto">
                        <input 
                            type="text" 
                            placeholder="OTP CODE" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={4}
                            className="flex-1 border-2 border-black p-4 text-center text-xl font-light tracking-[0.3em] outline-none transition-all rounded-none text-black bg-white focus:ring-4 focus:ring-black/10"
                        />
                        <button 
                            onClick={handleVerify}
                            disabled={isLoading || otp.length < 4}
                            className="bg-black text-white px-6 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                        >
                            {isLoading ? 'Verifying...' : 'Validate'}
                        </button>
                    </div>
                </div>
            )}

            {activeParcel.status === 'InTransit' && (
                <div className="bg-black text-white p-6 text-center space-y-4 border border-black shadow-[4px_4px_0px_rgba(200,200,200,1)]">
                    <p className="text-[10px] text-[#D2E32B] font-bold uppercase tracking-widest leading-relaxed">
                        Cargo chain-of-custody established. Proceed to exact destination coordinates and await receiver proxy.
                    </p>
                    <div className="py-4 text-sm font-mono text-gray-300 border border-gray-800 bg-[#111]">
                        WAITING FOR RECEIVER TO CONFIRM DELIVERY APP-SIDE...
                    </div>
                </div>
            )}
        </div>
    );
}
