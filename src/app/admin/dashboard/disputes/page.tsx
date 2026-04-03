import React from 'react';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminDisputesPage() {
  // We simulate "disputes" by looking for low ratings or older uncompleted parcels
  const potentialDisputes = await prisma.parcel.findMany({
    where: {
      OR: [
        { rating: { lte: 2 } },
        { status: { in: ['Searching', 'Accepted'] }, createdAt: { lte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
      ]
    },
    include: { user: true, partner: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-10 animate-fade-in">
       <div className="border-b border-gray-300 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-black tracking-tight uppercase italic">Safety & Disputes</h1>
            <p className="text-xs text-gray-500 font-normal mt-2 tracking-widest uppercase">Handling OTP Mismatches, Non-Delivery, and Fraud reports.</p>
          </div>
       </div>

       <div className="bg-white border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-gray-200">
                <th className="p-5 text-[10px] uppercase font-bold text-gray-400 tracking-widest pl-8">Incident Ref</th>
                <th className="p-5 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Description</th>
                <th className="p-5 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Involved Parties</th>
                <th className="p-5 text-[10px] uppercase font-bold text-gray-400 tracking-widest text-right pr-8">Remediation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {potentialDisputes.map((parcel) => (
                    <tr key={parcel.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="p-6 pl-8">
                            <span className="text-xs font-mono text-red-500 font-bold">DISP-{parcel.id.slice(0, 5).toUpperCase()}</span>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{new Date(parcel.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="p-6">
                            <p className="text-sm font-medium text-black">
                                {parcel.rating ? `Low Rating Alert (${parcel.rating}★)` : 'Stagnant State (Possible Non-Delivery)'}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{parcel.pickupLocation} → {parcel.dropLocation}</p>
                        </td>
                        <td className="p-6">
                            <div className="text-xs space-y-1">
                                <p className="text-black font-bold">U: <span className="font-normal text-gray-500">{parcel.user.name}</span></p>
                                <p className="text-black font-bold">P: <span className="font-normal text-gray-500">{parcel.partner?.name || 'Searching...'}</span></p>
                            </div>
                        </td>
                        <td className="p-6 text-right pr-8">
                            <div className="flex items-center justify-end space-x-3">
                                <button className="px-4 py-2 bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:border-black transition-colors">
                                    Flag Fraud
                                </button>
                                <button className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                    Full Refund
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {potentialDisputes.length === 0 && (
                     <tr>
                        <td colSpan={4} className="p-20 text-center text-sm text-gray-400 italic">No critical disputes flagged by the neural monitoring engine.</td>
                     </tr>
                )}
            </tbody>
          </table>
       </div>
    </div>
  );
}
