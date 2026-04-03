import React from 'react';
import { prisma } from "../../../../lib/prisma";
import LiveRouteMap from "../../../../components/LiveRouteMap";

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
            <h1 className="text-3xl font-light text-black tracking-tight tracking-tight uppercase">Live Operations</h1>
            <p className="text-xs text-gray-500 font-normal mt-2 tracking-widest uppercase">Monitoring {activeParcels.length} active transit nodes in the network.</p>
          </div>
          <div className="flex items-center space-x-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600">Syncing Live Map</span>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Log */}
          <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-4 scrollbar-thin">
              {activeParcels.map((parcel) => (
                  <div key={parcel.id} className="bg-white border border-gray-200 p-6 hover:border-black transition-all group cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                          <span className="text-[9px] font-bold bg-black text-white px-2 py-0.5 uppercase tracking-widest leading-loose">#{parcel.id.slice(0, 6)}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${parcel.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                             {parcel.status.replace('_', ' ')}
                          </span>
                      </div>
                      <div className="text-sm font-light text-black truncate mb-1">
                          {parcel.pickupLocation} <span className="text-gray-300 mx-2">→</span> {parcel.dropLocation}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                          <div className="text-[10px] text-gray-400 font-normal uppercase tracking-widest leading-none">
                              Driver: <span className="text-black font-bold ml-1">{parcel.partner?.name || 'Unassigned'}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-normal uppercase tracking-widest leading-none">
                              Client: <span className="text-black font-bold ml-1">{parcel.user?.name || 'User'}</span>
                          </div>
                      </div>
                  </div>
              ))}

              {activeParcels.length === 0 && (
                  <div className="bg-[#fafafa] border border-gray-100 p-12 text-center">
                      <p className="text-xs text-gray-400 font-normal italic">No active logistics operations found.</p>
                  </div>
              )}
          </div>

          {/* Map View */}
          <div className="lg:col-span-2 relative h-[700px] bg-white border border-gray-200 shadow-inner overflow-hidden flex flex-col">
              <div className="flex-1 overflow-hidden z-0 bg-[#f9f9f9] flex items-center justify-center">
                  {/* Since we can't show ALL on one map component easily, we show the first one or a placeholder if empty */}
                  {activeParcels.length > 0 ? (
                      <LiveRouteMap pickup={activeParcels[0].pickupLocation} drop={activeParcels[0].dropLocation} />
                  ) : (
                      <div className="text-center opacity-20">
                          <div className="w-16 h-16 border-2 border-black rounded-full mx-auto mb-4 animate-ping"></div>
                          <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Network Idle</p>
                      </div>
                  )}
              </div>
              <div className="h-20 border-t border-gray-100 bg-black flex items-center px-10 justify-between">
                  <div className="flex items-center space-x-8">
                     <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Active Velocity</span>
                        <span className="text-white text-xs font-mono font-bold">42.5 KM/H AVG</span>
                     </div>
                     <div className="flex flex-col border-l border-gray-800 pl-8">
                        <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Network Load</span>
                        <span className="text-white text-xs font-mono font-bold">0.42 OPS/SEC</span>
                     </div>
                  </div>
                  <button className="bg-[#D2E32B] text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
                      Optimize Grid
                  </button>
              </div>
          </div>
       </div>
    </div>
  );
}
