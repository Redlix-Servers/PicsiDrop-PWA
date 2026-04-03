import React from 'react';
import { prisma } from "@/lib/prisma";
import LiveRouteMap from "@/components/LiveRouteMap";

export const dynamic = 'force-dynamic';

export default async function AdminMonitorPage() {
  const activeParcels = await prisma.parcel.findMany({
    where: { 
      status: { in: ['ASSIGNED', 'IN_TRANSIT'] } 
    },
    include: {
      user: true,
      partner: true
    },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="space-y-10 animate-fade-in">
       <div className="border-b border-black pb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tight uppercase">Live watch</h1>
            <p className="text-[10px] text-gray-500 font-bold mt-2 tracking-widest uppercase">Currently tracking {activeParcels.length} deliveries on the map.</p>
          </div>
          <button className="flex items-center space-x-3 bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest">
             <div className="w-1.5 h-1.5 bg-[#D2E32B] rounded-full animate-pulse"></div>
             <span>System Online</span>
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Log */}
          <div className="lg:col-span-1 space-y-6 max-h-[700px] overflow-y-auto pr-4 scrollbar-hide">
              {activeParcels.map((parcel: any) => (
                  <div key={parcel.id} className="bg-white border-2 border-black p-6 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                      <div className="flex justify-between items-start mb-6">
                          <span className="text-[10px] font-bold bg-black text-white px-3 py-1 uppercase tracking-widest leading-none">Order #{parcel.id.slice(0, 6)}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${parcel.status === 'IN_TRANSIT' ? 'text-blue-600' : 'text-orange-500'}`}>
                             • {parcel.status}
                          </span>
                      </div>
                      <div className="space-y-4">
                          <div>
                              <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">Pick Up</p>
                              <p className="text-sm font-bold text-black truncate">{parcel.pickupLocation}</p>
                          </div>
                          <div>
                              <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">Drop Off</p>
                              <p className="text-sm font-bold text-black truncate">{parcel.dropLocation}</p>
                          </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                              Driver: <span className="text-black font-extrabold ml-1">{parcel.partner?.name || 'Searching...'}</span>
                          </div>
                      </div>
                  </div>
              ))}

              {activeParcels.length === 0 && (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-20 text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">No active orders right now.</p>
                  </div>
              )}
          </div>

          <div className="lg:col-span-2 relative h-[700px] border-2 border-black overflow-hidden flex flex-col bg-gray-50 shadow-[10px_10px_50px_rgba(0,0,0,0.05)]">
              <div className="flex-1 overflow-hidden">
                  {activeParcels.length > 0 ? (
                      <LiveRouteMap pickup={activeParcels[0].pickupLocation} drop={activeParcels[0].dropLocation} />
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                          <div className="w-20 h-20 border-2 border-black flex items-center justify-center mb-6">
                              <div className="w-8 h-8 bg-black animate-ping opacity-10"></div>
                          </div>
                          <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Waiting for orders...</p>
                      </div>
                  )}
              </div>
              <div className="absolute bottom-6 left-6 bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                  Live Feed Node: Alpha-01
              </div>
          </div>
       </div>
    </div>
  );
}
