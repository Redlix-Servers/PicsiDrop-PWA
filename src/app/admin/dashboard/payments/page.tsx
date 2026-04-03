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
       <div className="border-b border-gray-300 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-black tracking-tight uppercase">Payments & Earnings</h1>
            <p className="text-xs text-gray-500 font-normal mt-2 tracking-widest uppercase italic">Tracking your 20% commission and driver payments.</p>
          </div>
          <div className="px-6 py-3 bg-[#D2E32B] text-black text-[12px] font-bold uppercase tracking-widest border border-black">
             Settlement: Active
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-black text-white p-12 border border-black shadow-[8px_8px_0px_rgba(210,227,43,1)]">
                <p className="text-[10px] uppercase font-bold text-[#D2E32B] tracking-widest mb-4">Gross Sales</p>
                <h2 className="text-5xl font-light tracking-tight">₹{grossVol.toLocaleString()}</h2>
          </div>
          <div className="bg-white border border-gray-200 p-12">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4">Total Commission Earned (20%)</p>
                <h2 className="text-5xl font-light tracking-tight text-black">₹{commission.toLocaleString()}</h2>
          </div>
       </div>

       <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
             <h3 className="text-[10px] uppercase font-bold tracking-widest text-black">Recent Transactions</h3>
             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{allParcels.length} deliveries recorded</span>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-[#fafafa] border-b border-gray-100">
                      <th className="p-4 pl-8 text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-loose">TX-ID</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest whitespace-nowrap">Driver Info</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest whitespace-nowrap">Order Amount</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest whitespace-nowrap">Payout (80%)</th>
                      <th className="p-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest whitespace-nowrap text-right pr-8">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {allParcels.map((parcel: any) => (
                        <tr key={parcel.id} className="hover:bg-gray-50 transition-colors">
                           <td className="p-5 pl-8 text-xs font-mono text-gray-400">#{parcel.id.slice(0, 5).toUpperCase()}</td>
                           <td className="p-5">
                              <p className="text-sm font-bold text-black uppercase tracking-tight">{parcel.partner?.name || 'Driver'}</p>
                              <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{parcel.partner?.upiId || 'No UPI ID'}</p>
                           </td>
                           <td className="p-5 text-sm font-bold text-black">₹{parcel.price.toFixed(2)}</td>
                           <td className="p-5 text-sm font-bold text-green-600">₹{(parcel.price * 0.8).toFixed(2)}</td>
                           <td className="p-5 text-right pr-8">
                               <span className="px-2 py-1 bg-white border border-gray-200 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap">Ready to Pay</span>
                           </td>
                        </tr>
                    ))}
                    {allParcels.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-16 text-center text-xs text-gray-400 uppercase tracking-widest italic leading-relaxed">No payments recorded yet.</td>
                        </tr>
                    )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
