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
       <div className="border-b border-gray-100 pb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-black tracking-tight">Live watch</h1>
            <p className="text-[10px] text-gray-400 font-medium mt-2 tracking-widest uppercase">Tracking {activeParcels.length} deliveries across the network.</p>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 px-6 py-2.5 text-[10px] font-medium tracking-widest uppercase border border-gray-100 text-gray-500">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
             <span>System Online</span>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Log */}
          <div className="lg:col-span-1 space-y-6 max-h-[700px] overflow-y-auto pr-4 scrollbar-hide">
              {activeParcels.map((parcel: any) => (
                  <div key={parcel.id} className="bg-white border border-gray-100 p-6 hover:border-black transition-all group">
                      <div className="flex justify-between items-start mb-6">
                          <span className="text-[10px] font-medium bg-black text-white px-3 py-1 uppercase tracking-widest leading-none">Order #{parcel.id.slice(0, 6)}</span>
                          <span className={`text-[10px] font-medium uppercase tracking-widest px-2 py-1 ${parcel.status === 'IN_TRANSIT' ? 'text-blue-600' : 'text-orange-500'}`}>
                             {parcel.status}
                          </span>
                      </div>
                      <div className="space-y-4">
                          <div>
                              <p className="text-[9px] uppercase font-medium text-gray-300 tracking-widest mb-1">Pick Up</p>
                              <p className="text-sm font-normal text-black truncate">{parcel.pickupLocation}</p>
                          </div>
                          <div>
                              <p className="text-[9px] uppercase font-medium text-gray-300 tracking-widest mb-1">Drop Off</p>
                              <p className="text-sm font-normal text-black truncate">{parcel.dropLocation}</p>
                          </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-6">
                          <div className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                              Driver: <span className="text-black font-medium ml-1">{parcel.partner?.name || 'Searching...'}</span>
                          </div>
                      </div>
                  </div>
              ))}

              {activeParcels.length === 0 && (
                  <div className="bg-gray-50 border border-dashed border-gray-100 p-20 text-center">
                      <p className="text-[10px] text-gray-300 font-medium uppercase tracking-widest">No active orders right now.</p>
                  </div>
              )}
          </div>

          <div className="lg:col-span-2 relative h-[700px] border border-gray-200 overflow-hidden flex flex-col bg-[#fafafa]">
              <div className="flex-1 overflow-hidden">
                  {activeParcels.length > 0 ? (
                      <LiveRouteMap pickup={activeParcels[0].pickupLocation} drop={activeParcels[0].dropLocation} />
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                          <div className="w-16 h-16 border border-black flex items-center justify-center mb-6">
                              <div className="w-6 h-6 bg-black opacity-10"></div>
                          </div>
                          <p className="text-[10px] uppercase font-medium tracking-widest">Waiting for orders...</p>
                      </div>
                  )}
              </div>
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm border border-gray-100 text-black px-4 py-2 text-[10px] font-medium tracking-widest uppercase">
                  Network Active
              </div>
          </div>
       </div>
    </div>
  );
}
