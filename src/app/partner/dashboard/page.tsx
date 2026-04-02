import React from 'react';
import { prisma } from "../../../lib/prisma";
import PartnerAcceptAction from "./PartnerAcceptAction";
import ActiveMissionConsole from "./ActiveMissionConsole";

// Ensure dynamic rendering to grab active requests immediately
export const dynamic = 'force-dynamic';

import { isValidSubRoute } from "../../../lib/routeAnalyzer";

export default async function PartnerDashboardPage() {
  // Fetch real partner data for the greeting
  const recentPartner = await prisma.partner.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  const partnerName = recentPartner?.name?.split(' ')[0] || "Partner";
  
  // 1. Verify if the partner is currently engaged in an active mission
  let activeParcel = null;
  if (recentPartner) {
      activeParcel = await prisma.parcel.findFirst({
          where: { 
              partnerId: recentPartner.id, 
              status: { in: ['Accepted', 'InTransit'] } 
          },
          include: { user: true } // Need standard user data
      });
  }

  // 2. If no active missions, scan ALL searching packages through our Route Analyzer
  let pendingRequest = null;
  if (!activeParcel && recentPartner?.routeFrom && recentPartner?.routeTo) {
      const allSearchingParcels = await prisma.parcel.findMany({
          where: { status: "Searching" },
          orderBy: { createdAt: 'desc' }
      });
      
      // Run valid GPS Haversine verification sequentially across pending unassigned packages
      for (const parcel of allSearchingParcels) {
          const isMatch = await isValidSubRoute(recentPartner.routeFrom!, recentPartner.routeTo!, parcel.pickupLocation, parcel.dropLocation);
          if (isMatch) {
              pendingRequest = parcel;
              break;
          }
      }
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pt-12">
      <h1 className="text-5xl font-normal text-black tracking-tighter leading-none">
        Welcome aboard, {partnerName}
      </h1>
      <div className="mt-8 h-px w-24 bg-gray-100 mb-12"></div>

      {activeParcel ? (
          /* ACTIVE MISSION OVERRIDE */
          <ActiveMissionConsole activeParcel={activeParcel} />
      ) : pendingRequest ? (
          /* RADAR PENDING REQUEST */
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-8 max-w-2xl relative animate-fade-in">
              <div className="absolute top-0 right-0 bg-red-600 animate-pulse text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5">
                  New Contract Offer
              </div>
              
              <div className="flex border-b border-gray-100 pb-6 mb-6 mt-4">
                 <div className="flex-1 border-r border-gray-100 pr-6">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Origin</p>
                      <h3 className="text-xl font-medium tracking-tight text-black">{pendingRequest.pickupLocation}</h3>
                 </div>
                 <div className="flex-1 pl-6">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Destination</p>
                      <h3 className="text-xl font-medium tracking-tight text-black">{pendingRequest.dropLocation}</h3>
                 </div>
              </div>

               <div className="grid grid-cols-3 gap-4 mb-8 text-center bg-[#fafafa] border border-gray-200 py-4">
                  <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Payout</p>
                      <p className="text-lg font-bold text-black">₹{pendingRequest.price.toFixed(2)}</p>
                  </div>
                  <div className="border-l border-r border-gray-200">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Weight</p>
                      <p className="text-sm font-bold text-gray-700 mt-1">{pendingRequest.weight} KG</p>
                  </div>
                  <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Priority</p>
                      <p className="text-sm font-bold text-red-600 mt-1 uppercase tracking-wider">{pendingRequest.urgency}</p>
                  </div>
              </div>

             <PartnerAcceptAction parcelId={pendingRequest.id} partnerId={recentPartner!.id} />
          </div>
      ) : (
          /* IDLE RADAR */
          <div className="border-t border-b border-gray-100 py-12 flex flex-col items-center justify-center text-center">
              <div className="relative w-16 h-16 mb-6">
                 <div className="absolute inset-0 border border-gray-200 rounded-full animate-ping opacity-60"></div>
                 <div className="absolute inset-4 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">IDLE</span>
                 </div>
              </div>
              <p className="text-sm text-gray-500 font-normal">Your radar is active. Awaiting logistics requests for your route.</p>
          </div>
      )}
    </div>
  );
}
