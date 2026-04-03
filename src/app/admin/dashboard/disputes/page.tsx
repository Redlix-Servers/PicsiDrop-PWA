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
       <div className="border-b border-gray-100 pb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-black tracking-tight">Help & Issues</h1>
            <p className="text-[10px] text-gray-400 font-medium mt-2 tracking-widest uppercase">Handling wrong OTPs, late deliveries, and other problems.</p>
          </div>
       </div>

       <div className="bg-white border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-6 text-[10px] uppercase font-medium tracking-widest pl-8">Order ID</th>
                <th className="p-6 text-[10px] uppercase font-medium tracking-widest">Problem Type</th>
                <th className="p-6 text-[10px] uppercase font-medium tracking-widest text-center">People Involved</th>
                <th className="p-6 text-[10px] uppercase font-medium tracking-widest text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {potentialDisputes.map((parcel: any) => (
                    <tr key={parcel.id} className="hover:bg-red-50/10 transition-colors">
                        <td className="p-8 pl-8">
                            <span className="text-xs font-mono text-red-500 font-medium">#{parcel.id.slice(0, 5).toUpperCase()}</span>
                            <p className="text-[10px] text-gray-300 mt-2 font-medium tracking-widest uppercase">{new Date(parcel.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="p-8">
                            <p className="text-base font-normal text-black">
                                {parcel.rating ? `Low Rating (${parcel.rating}★)` : 'Late Order Error'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[9px] font-medium text-gray-400 tracking-widest">{parcel.pickupLocation}</span>
                                <span className="text-[9px] font-medium text-gray-200">→</span>
                                <span className="text-[9px] font-medium text-gray-400 tracking-widest">{parcel.dropLocation}</span>
                            </div>
                        </td>
                        <td className="p-8">
                            <div className="text-[10px] space-y-2 flex flex-col items-center">
                                <div className="bg-gray-50 px-3 py-1 font-medium text-gray-500 tracking-widest uppercase">User: {parcel.user.name}</div>
                                <div className="bg-gray-50 px-3 py-1 font-medium text-gray-500 tracking-widest uppercase">Driver: {parcel.partner?.name || 'Searching...'}</div>
                            </div>
                        </td>
                        <td className="p-8 text-right pr-8">
                            <div className="flex items-center justify-end space-x-3">
                                <button className="px-6 py-2.5 border border-gray-200 bg-white text-black text-[10px] font-medium uppercase tracking-widest hover:border-black transition-all">
                                    Flag Fraud
                                </button>
                                <button className="px-6 py-2.5 bg-black text-white text-[10px] font-medium uppercase tracking-widest hover:bg-gray-800 transition-all">
                                    Send Refund
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {potentialDisputes.length === 0 && (
                     <tr>
                        <td colSpan={4} className="p-24 text-center text-[10px] font-medium text-gray-400 tracking-[0.4em] uppercase">Everything is running correctly.</td>
                     </tr>
                )}
            </tbody>
          </table>
       </div>
    </div>
  );
}
