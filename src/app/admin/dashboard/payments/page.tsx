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
       <div className="border-b border-gray-100 pb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-black tracking-tight">Money Tracking</h1>
            <p className="text-[10px] text-gray-400 font-medium mt-2 tracking-widest uppercase">Calculating your 20% cut and driver payouts.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-black text-white p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-[#D2E32B] text-black px-4 py-2 text-[10px] font-medium tracking-widest uppercase">Gross Sales</div>
                <p className="text-[10px] lowercase font-medium text-gray-500 tracking-widest mb-4 uppercase">Total Platform Revenue</p>
                <h2 className="text-5xl font-light tracking-tight">₹{grossVol.toLocaleString()}</h2>
          </div>
          <div className="bg-white border border-gray-100 p-12 relative">
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-2 text-[10px] font-medium tracking-widest uppercase">Earnings</div>
                <p className="text-[10px] lowercase font-medium text-gray-400 tracking-widest mb-4 uppercase">Your 20% Profit</p>
                <h2 className="text-5xl font-light tracking-tight text-black">₹{commission.toLocaleString()}</h2>
          </div>
       </div>

       <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white/50">
             <h3 className="text-[10px] font-medium tracking-widest text-black uppercase">Completed Transactions</h3>
             <span className="text-[10px] font-medium text-gray-300 tracking-widest uppercase">{allParcels.length} deliveries</span>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-black text-white">
                      <th className="p-6 text-[10px] uppercase font-medium tracking-widest pl-8">TX ID</th>
                      <th className="p-6 text-[10px] uppercase font-medium tracking-widest">Driver Info</th>
                      <th className="p-6 text-[10px] uppercase font-medium tracking-widest">Total Pay</th>
                      <th className="p-6 text-[10px] uppercase font-medium tracking-widest">Driver Cut (80%)</th>
                      <th className="p-6 text-[10px] uppercase font-medium tracking-widest text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {allParcels.map((parcel: any) => (
                        <tr key={parcel.id} className="hover:bg-gray-50 transition-colors">
                           <td className="p-6 text-xs font-mono text-gray-300">#{parcel.id.slice(0, 5).toUpperCase()}</td>
                           <td className="p-6">
                              <p className="text-sm font-medium text-black">{parcel.partner?.name || 'Driver'}</p>
                              <p className="text-[9px] text-gray-400 font-medium tracking-widest mt-1 uppercase">{parcel.partner?.upiId || 'No UPI ID'}</p>
                           </td>
                           <td className="p-6 text-sm font-normal text-black">₹{parcel.price.toFixed(2)}</td>
                           <td className="p-6 text-sm font-medium text-green-600 font-normal">₹{(parcel.price * 0.8).toFixed(2)}</td>
                           <td className="p-6 text-right">
                               <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[9px] font-medium uppercase tracking-widest border border-gray-100">Success</span>
                           </td>
                        </tr>
                    ))}
                    {allParcels.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-24 text-center text-[10px] font-medium text-gray-400 tracking-[0.4em] uppercase">No financial data yet.</td>
                        </tr>
                    )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
