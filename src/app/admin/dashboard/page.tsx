import React from 'react';
import { prisma } from "../../lib/prisma";

export default async function AdminOverviewPage() {
  // Real-time aggregate stats
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

  // City Performance Aggregate
  const cityPerformance = await prisma.parcel.groupBy({
    by: ['pickupLocation'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5
  });

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Total Revenue</p>
          <h2 className="text-4xl font-light text-black tracking-tight">₹{totalRevenue._sum.price?.toFixed(2) || "0.00"}</h2>
        </div>
        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Daily Deliveries</p>
          <h2 className="text-4xl font-light text-black tracking-tight">{dailyParcels}</h2>
        </div>
        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Active In-Transit</p>
          <h2 className="text-4xl font-light text-black tracking-tight">{activeDeliveriesCount}</h2>
        </div>
        <div className="bg-black text-white p-8 border border-black shadow-[4px_4px_0px_rgba(210,227,43,1)]">
          <p className="text-[10px] uppercase font-bold text-[#D2E32B] tracking-widest mb-2">Network Health</p>
          <h2 className="text-4xl font-light tracking-tight text-white uppercase">Optimal</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* City Performance Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-10">
          <h3 className="text-sm uppercase font-bold tracking-widest text-black mb-8 border-b border-gray-100 pb-4">Top Hub Performance</h3>
          <div className="space-y-6">
            {cityPerformance.map((city, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-mono text-gray-300">0{idx + 1}</span>
                  <span className="text-base font-light text-black uppercase tracking-tight">{city.pickupLocation}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-48 h-1.5 bg-gray-50 overflow-hidden hidden md:block">
                     <div 
                        className="h-full bg-black transition-all duration-1000" 
                        style={{ width: `${(city._count.id / dailyParcels) * 100 || 0}%` }}
                     ></div>
                  </div>
                  <span className="text-sm font-bold text-black">{city._count.id} Orders</span>
                </div>
              </div>
            ))}
            {cityPerformance.length === 0 && <p className="text-xs text-gray-400 font-normal italic">Waiting for initial order distribution data...</p>}
          </div>
        </div>

        {/* Quick System Alerts */}
        <div className="bg-[#fafafa] border border-gray-200 p-8">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-black mb-6">Real-time Signals</h3>
            <div className="space-y-5">
                <div className="border-l-2 border-black pl-4">
                    <p className="text-xs font-bold text-black uppercase">Live Monitoring</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Active nodes synchronized</p>
                </div>
                <div className="border-l-2 border-gray-200 pl-4 opacity-50">
                    <p className="text-xs font-bold text-gray-400 uppercase">System Latency</p>
                    <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest">14ms average cluster response</p>
                </div>
                <div className="pt-6 border-t border-gray-100">
                    <button className="w-full bg-black text-white py-3.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        Inspect Network Node
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
