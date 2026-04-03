import React from 'react';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const allParcels = await prisma.parcel.findMany({
    where: { status: 'DELIVERED' },
    include: { partner: true },
    orderBy: { updatedAt: 'desc' }
  });

  const grossVol = allParcels.reduce((acc: number, p: any) => acc + (p.price || 0), 0);
  const commission = grossVol * 0.2; // 20% commission

  return (
    <div className="space-y-12 animate-fade-in">
       <div className="border-b border-black pb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tight uppercase">Money Tracking</h1>
            <p className="text-[10px] text-gray-500 font-bold mt-2 tracking-widest uppercase">Calculating your 20% cut and driver payouts.</p>
          </div>
          <div className="px-6 py-3 bg-[#D2E32B] text-black text-[12px] font-bold uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
             Payment System: Online
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-black text-white p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-[#D2E32B] text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest">Gross Sales</div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4">Total Platform Revenue</p>
                <h2 className="text-6xl font-light tracking-tight">₹{grossVol.toLocaleString()}</h2>
          </div>
          <div className="bg-white border-2 border-black p-12 relative">
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest">Earnings</div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4">Your 20% Profit</p>
                <h2 className="text-6xl font-bold tracking-tight text-black">₹{commission.toLocaleString()}</h2>
          </div>
       </div>

       <div className="bg-white border-2 border-black overflow-hidden shadow-[12px_12px_0px_rgba(0,0,0,0.05)]">
          <div className="p-8 border-b-2 border-black flex items-center justify-between bg-white">
             <h3 className="text-xs font-bold uppercase tracking-widest text-black">Completed Transactions</h3>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{allParcels.length} deliveries</span>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-50 border-b border-black">
                      <th className="p-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest">TX ID</th>
                      <th className="p-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Driver Info</th>
                      <th className="p-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Total Pay</th>
                      <th className="p-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Driver Cut (80%)</th>
                      <th className="p-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {allParcels.map((parcel: any) => (
                        <tr key={parcel.id} className="hover:bg-gray-50 transition-colors">
                           <td className="p-6 text-xs font-mono text-gray-300">#{parcel.id.slice(0, 5).toUpperCase()}</td>
                           <td className="p-6">
                              <p className="text-sm font-bold text-black uppercase">{parcel.partner?.name || 'Driver'}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{parcel.partner?.upiId || 'No UPI ID'}</p>
                           </td>
                           <td className="p-6 text-sm font-bold text-black italic-none">₹{parcel.price.toFixed(2)}</td>
                           <td className="p-6 text-sm font-bold text-green-600">₹{(parcel.price * 0.8).toFixed(2)}</td>
                           <td className="p-6 text-right">
                               <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest">Success</span>
                           </td>
                        </tr>
                    ))}
                    {allParcels.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-24 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">No financial data yet.</td>
                        </tr>
                    )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
