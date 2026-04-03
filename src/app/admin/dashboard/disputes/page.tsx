import React from 'react';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminDisputesPage() {
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
       <div className="border-b border-black pb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tight uppercase">Help & Issues</h1>
            <p className="text-[10px] text-gray-500 font-bold mt-2 tracking-widest uppercase italic-none">Handling wrong OTPs, late deliveries, and other problems.</p>
          </div>
       </div>

       <div className="bg-white border-2 border-black">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-6 text-[10px] uppercase font-bold tracking-widest pl-8">Order ID</th>
                <th className="p-6 text-[10px] uppercase font-bold tracking-widest">Problem Type</th>
                <th className="p-6 text-[10px] uppercase font-bold tracking-widest text-center">People Involved</th>
                <th className="p-6 text-[10px] uppercase font-bold tracking-widest text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {potentialDisputes.map((parcel: any) => (
                    <tr key={parcel.id} className="hover:bg-red-50/10 transition-colors">
                        <td className="p-8 pl-8">
                            <span className="text-xs font-mono text-red-500 font-bold">#{parcel.id.slice(0, 5).toUpperCase()}</span>
                            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">{new Date(parcel.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="p-8">
                            <p className="text-base font-bold text-black">
                                {parcel.rating ? `Low Rating (${parcel.rating}★)` : 'Late Order Error'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{parcel.pickupLocation}</span>
                                <span className="text-[9px] font-bold text-gray-200">→</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{parcel.dropLocation}</span>
                            </div>
                        </td>
                        <td className="p-8">
                            <div className="text-[10px] space-y-2 flex flex-col items-center">
                                <div className="bg-gray-100 px-3 py-1 font-bold text-gray-600 uppercase tracking-widest">User: {parcel.user.name}</div>
                                <div className="bg-gray-100 px-3 py-1 font-bold text-gray-600 uppercase tracking-widest">Driver: {parcel.partner?.name || 'Searching...'}</div>
                            </div>
                        </td>
                        <td className="p-8 text-right pr-8">
                            <div className="flex items-center justify-end space-x-3">
                                <button className="px-6 py-3 border-2 border-black bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                    Flag Fraud
                                </button>
                                <button className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all">
                                    Send Refund
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {potentialDisputes.length === 0 && (
                     <tr>
                        <td colSpan={4} className="p-32 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Everything is running correctly.</td>
                     </tr>
                )}
            </tbody>
          </table>
       </div>
    </div>
  );
}
