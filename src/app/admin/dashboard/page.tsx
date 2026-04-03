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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Earnings Total</p>
          <h2 className="text-4xl font-light text-black tracking-tight">₹{totalRevenue._sum.price?.toFixed(2) || "0.00"}</h2>
        </div>
        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Today's Orders</p>
          <h2 className="text-4xl font-light text-black tracking-tight">{dailyParcels}</h2>
        </div>
        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Active Deliveries</p>
          <h2 className="text-4xl font-light text-black tracking-tight">{activeDeliveriesCount}</h2>
        </div>
        <div className="bg-black text-white p-8 border border-black shadow-[4px_4px_0px_rgba(210,227,43,1)]">
          <p className="text-[10px] uppercase font-bold text-[#D2E32B] tracking-widest mb-2">System Status</p>
          <h2 className="text-4xl font-light tracking-tight text-white uppercase">Good</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white border border-gray-200 p-10">
          <h3 className="text-sm uppercase font-bold tracking-widest text-black mb-8 border-b border-gray-100 pb-4">Top Cities</h3>
          <div className="space-y-6">
            {cityPerformance.map((city: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-mono text-gray-300">{idx + 1}</span>
                  <span className="text-base font-light text-black uppercase tracking-tight">{city.pickupLocation}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-48 h-1 bg-gray-50 overflow-hidden hidden md:block">
                     <div 
                        className="h-full bg-black" 
                        style={{ width: `${(city._count.id / dailyParcels) * 100 || 0}%` }}
                     ></div>
                  </div>
                  <span className="text-sm font-bold text-black">{city._count.id} Orders</span>
                </div>
              </div>
            ))}
            {cityPerformance.length === 0 && <p className="text-xs text-gray-400 font-normal italic">No city data available yet...</p>}
          </div>
        </div>

        <div className="bg-[#fafafa] border border-gray-200 p-8">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-black mb-6">Recent Alerts</h3>
            <div className="space-y-5">
                <div className="border-l-2 border-black pl-4">
                    <p className="text-xs font-bold text-black uppercase">Monitoring</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">All servers are on</p>
                </div>
                <div className="border-l-2 border-gray-100 pl-4 opacity-50">
                    <p className="text-xs font-bold text-gray-400 uppercase">Wait Time</p>
                    <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest">Low lag detected</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
