import React from 'react';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const totalRevenue = await prisma.parcel.aggregate({
    _sum: { price: true },
    where: { status: 'DELIVERED' }
  });

  const activeDeliveriesCount = await prisma.parcel.count({
    where: { status: { in: ['ASSIGNED', 'IN_TRANSIT'] } }
  });

  const dailyParcels = await prisma.parcel.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  });

  const cityPerformance = await prisma.parcel.groupBy({
    by: ['pickupLocation'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5
  });

  return (
    <div className="space-y-12 animate-fade-in">
       <div className="border-b border-black pb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tight uppercase">Dashboard Summary</h1>
            <p className="text-[10px] text-gray-500 font-bold mt-2 tracking-widest uppercase">Everything happening in the network today.</p>
          </div>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-black text-white p-10 border-2 border-black shadow-[8px_8px_0px_rgba(210,227,43,1)]">
          <p className="text-[10px] uppercase font-bold text-[#D2E32B] tracking-widest mb-4">Total Money Made</p>
          <h2 className="text-5xl font-light tracking-tighter text-white uppercase">₹{totalRevenue._sum.price?.toFixed(2) || "0.00"}</h2>
        </div>
        <div className="bg-white border-2 border-black p-10">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4">Orders Today</p>
          <h2 className="text-5xl font-bold text-black tracking-tighter uppercase">{dailyParcels}</h2>
        </div>
        <div className="bg-white border-2 border-black p-10">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4">Active Trucks</p>
          <h2 className="text-5xl font-bold text-black tracking-tighter uppercase">{activeDeliveriesCount}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white border-2 border-black p-10">
          <h3 className="text-xs uppercase font-bold tracking-widest text-black mb-10 border-b border-gray-100 pb-4">Top Performance Cities</h3>
          <div className="space-y-8">
            {cityPerformance.map((city: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4">
                <div className="flex items-center space-x-6">
                  <span className="text-xs font-bold text-black border border-black px-2 py-1 leading-none">{idx + 1}</span>
                  <span className="text-lg font-bold text-black uppercase tracking-tight">{city.pickupLocation}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-bold text-black">{city._count.id} Orders</span>
                </div>
              </div>
            ))}
            {cityPerformance.length === 0 && <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No data collected yet...</p>}
          </div>
        </div>

        <div className="bg-gray-50 border-2 border-black p-10 flex flex-col justify-between">
            <div>
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-black mb-8">Network Guard Alerts</h3>
                <div className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-6">
                        <p className="text-[10px] font-bold text-black uppercase tracking-widest">System Online</p>
                        <p className="text-[11px] text-gray-500 mt-2 font-normal leading-relaxed uppercase">Everything is running successfully.</p>
                    </div>
                </div>
            </div>
            <div className="mt-20 pt-8 border-t border-gray-200">
                <p className="text-[10px] font-bold text-black uppercase tracking-widest italic-none">V 1.0 Logistics Core</p>
            </div>
        </div>
      </div>
    </div>
  );
}
