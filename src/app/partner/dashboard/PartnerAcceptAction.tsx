"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { acceptParcelRequest } from '../../actions/parcelActions';

export default function PartnerAcceptAction({ parcelId, partnerId }: { parcelId: string, partnerId: string }) {
    const [status, setStatus] = useState<'idle'|'loading'|'accepted'>('idle');
    const router = useRouter();

    const handleAccept = async () => {
        setStatus('loading');
        const res = await acceptParcelRequest(parcelId, partnerId);
        if (res.success) {
            setStatus('accepted');
            // Give partner a moment to see the success state, then refresh dashboard logic
            setTimeout(() => router.refresh(), 2000);
        }
    };

    if (status === 'accepted') {
        return (
            <div className="w-full py-4 text-center border border-black bg-black text-white text-sm font-bold uppercase tracking-[0.2em]">
                 Contract Accepted. Engage Protocol.
            </div>
        )
    }

    return (
        <button 
           onClick={handleAccept} 
           disabled={status === 'loading'}
           className="w-full py-5 text-sm font-bold uppercase tracking-[0.2em] transition-colors bg-white border border-gray-200 text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
        >
            {status === 'loading' ? 'Securing Contract...' : 'Accept Logistics Contract'}
        </button>
    );
}
