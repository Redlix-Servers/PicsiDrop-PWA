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
       <div className="border-b border-gray-300 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-black tracking-tight uppercase">Live Deliveries</h1>
            <p className="text-xs text-gray-400 font-normal mt-2 tracking-widest uppercase italic">Currently monitoring {activeParcels.length} active orders across the map.</p>
          </div>
          <div className="flex items-center space-x-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600">Map is Syncing</span>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Log */}
          <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-4">
              {activeParcels.map((parcel: any) => (
                  <div key={parcel.id} className="bg-white border border-gray-200 p-6 hover:border-black transition-all group">
                      <div className="flex justify-between items-start mb-4">
                          <span className="text-[9px] font-bold bg-black text-white px-2 py-0.5 uppercase tracking-widest">Order #{parcel.id.slice(0, 6)}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${parcel.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                             {parcel.status}
                          </span>
                      </div>
                      <div className="text-sm font-light text-black truncate mb-1">
                          {parcel.pickupLocation} → {parcel.dropLocation}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                          <div className="text-[10px] text-gray-400 font-normal uppercase tracking-widest">
                              Driver: <span className="text-black font-bold ml-1">{parcel.partner?.name || 'Waiting...'}</span>
                          </div>
                      </div>
                  </div>
              ))}

              {activeParcels.length === 0 && (
                  <div className="bg-[#fafafa] border border-gray-100 p-12 text-center">
                      <p className="text-xs text-gray-400 italic font-normal uppercase tracking-widest">No active deliveries found.</p>
                  </div>
              )}
          </div>

          <div className="lg:col-span-2 relative h-[700px] bg-white border border-gray-200 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {activeParcels.length > 0 ? (
                      <LiveRouteMap pickup={activeParcels[0].pickupLocation} drop={activeParcels[0].dropLocation} />
                  ) : (
                      <div className="text-center opacity-20">
                          <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Network Idle</p>
                      </div>
                  )}
              </div>
          </div>
       </div>
    </div>
  );
}
