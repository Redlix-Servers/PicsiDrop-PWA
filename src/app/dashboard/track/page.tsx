import React from 'react';
import { prisma } from "../../../lib/prisma";
import LiveRouteMap from "../../../components/LiveRouteMap";
import DeliveryConfirmAction from "./DeliveryConfirmAction";

export const dynamic = 'force-dynamic';

export default async function TrackOrdersPage() {
  const recentUser = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  const parcels = await prisma.parcel.findMany({
      where: { userId: recentUser?.id || 'error' },
      orderBy: { createdAt: 'desc' },
      include: {
          partner: true
      }
  });

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pt-12 space-y-12">
      <div>
        <h1 className="text-5xl font-normal text-black tracking-tighter leading-none">
          Active Logistics Contracts
        </h1>
        <div className="mt-8 h-px w-24 bg-gray-100 mb-2"></div>
      </div>

      <div className="space-y-10">
          {parcels.map((parcel: any) => (
             <div key={parcel.id} className="bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-8">
                 <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
                     <div>
                         <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Tracking ID</p>
                         <p className="text-sm font-mono text-black">{parcel.id}</p>
                     </div>
                     <div className="text-right">
                         <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white ${
                            parcel.status === 'Searching' ? 'bg-orange-500 animate-pulse' : 
                            parcel.status === 'Accepted' ? 'bg-blue-600' :
                            parcel.status === 'InTransit' ? 'bg-green-500' : 'bg-black'
                         }`}>
                             {parcel.status === 'Searching' ? 'Awaiting Allocation' : parcel.status}
                         </span>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                           <div className="flex">
                               <div className="flex-1">
                                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Origin Drop</p>
                                  <h3 className="text-xl font-medium tracking-tight text-black">{parcel.pickupLocation}</h3>
                               </div>
                               <div className="px-4 text-gray-300">→</div>
                               <div className="flex-1">
                                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Final Destination</p>
                                  <h3 className="text-xl font-medium tracking-tight text-black">{parcel.dropLocation}</h3>
                               </div>
                           </div>

                           <div className="bg-[#fafafa] border border-gray-200 p-6 flex items-center justify-between">
                               <div>
                                   <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Assigned Operational Partner</p>
                                   <p className="text-sm font-bold text-black">{parcel.partner?.name || "Pending Network Match"}</p>
                                   {parcel.partner && <p className="text-xs text-gray-500 mt-1">{parcel.partner.phoneNumber}</p>}
                               </div>
                           </div>

                           {/* Interactive Checkpoint States */}
                           {parcel.status === 'Accepted' && (
                               <div className="border border-black p-6 space-y-3">
                                   <p className="text-[10px] uppercase font-bold text-black tracking-widest mb-1">Pick-up Code</p>
                                   <p className="text-sm text-gray-600 leading-relaxed font-normal">
                                       Give this code to your driver when they arrive to pick up your package:
                                   </p>
                                   <div className="text-4xl font-light tracking-[0.2em] text-center pt-2">
                                       {parcel.pickupOTP}
                                   </div>
                               </div>
                           )}

                           {parcel.status === 'InTransit' && (
                               <div className="bg-black text-white p-6 space-y-3 border-2 border-black shadow-[4px_4px_0px_rgba(200,200,200,1)] mt-6">
                                   <p className="text-[10px] uppercase font-bold text-[#D2E32B] tracking-widest mb-1">Package on the way</p>
                                   <p className="text-sm text-gray-300 leading-relaxed font-normal mb-6">
                                       Your package is being delivered. Give this final code to the person receiving the package:
                                   </p>
                                   
                                   <div className="bg-[#111] border border-gray-800 p-4 mb-4">
                                       <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 text-center">Delivery Code</div>
                                       <div className="text-4xl font-light tracking-[0.2em] text-center pt-2 pb-2 text-white">
                                           {parcel.deliveryOTP}
                                       </div>
                                   </div>

                                   <DeliveryConfirmAction parcelId={parcel.id} />
                               </div>
                           )}

                           {parcel.status === 'Completed' && (
                               <div className="bg-[#fafafa] border border-gray-200 p-6 mt-6 text-center">
                                   <div className="w-12 h-12 bg-black text-[#D2E32B] rounded-full mx-auto flex items-center justify-center mb-4 text-xl">✓</div>
                                   <p className="text-[10px] uppercase font-bold text-black tracking-widest mb-1">Delivered</p>
                                   <p className="text-sm text-gray-500 font-normal">Thank you for using PicsiDrop!</p>
                               </div>
                           )}

                      </div>

                      {/* Radar Screen for all non-idle parcels */}
                      <div className="relative border border-gray-200 bg-[#f4f4f5] h-full min-h-[350px]">
                           <LiveRouteMap pickup={parcel.pickupLocation} drop={parcel.dropLocation} />
                      </div>
                 </div>
             </div>
          ))}

          {parcels.length === 0 && (
              <div className="border border-dashed border-gray-300 p-16 text-center">
                  <p className="text-sm text-gray-500 font-normal">No active or historical logistics records discovered.</p>
              </div>
          )}
      </div>
    </div>
  );
}
