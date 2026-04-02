"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { completeParcelDelivery } from '../../actions/parcelActions';

export default function DeliveryConfirmAction({ parcelId }: { parcelId: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        const res = await completeParcelDelivery(parcelId);
        if (res.success) {
            router.refresh();
        } else {
            setIsLoading(false);
            alert(res.error || "Failed to confirm delivery.");
        }
    };

    return (
        <div className="mt-6 border-t border-gray-800 pt-6">
            <label className="flex items-start space-x-3 cursor-pointer group mb-4">
                <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border-2 border-white/30 checked:border-[#D2E32B] checked:bg-[#D2E32B] hover:border-white transition-colors cursor-pointer rounded-none"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-white transition-colors leading-relaxed">
                    I confirm via proxy that the physical cargo has been securely deposited at the destination coordinates. By checking this box, I authorize the immediate release of Escrow funds.
                </span>
            </label>

            <button 
                onClick={handleConfirm}
                disabled={isLoading || !agreed}
                className="w-full bg-[#D2E32B] text-black hover:bg-white disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed py-3 text-xs font-bold uppercase tracking-widest transition-colors"
            >
                {isLoading ? 'Executing Escrow Release...' : 'Confirm Delivery & Release Funds'}
            </button>
        </div>
    );
}
