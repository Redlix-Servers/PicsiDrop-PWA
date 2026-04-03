import React from 'react';
import { prisma } from "../../../lib/prisma";
import PartnerAcceptAction from "./PartnerAcceptAction";
import ActiveMissionConsole from "./ActiveMissionConsole";
import PartnerControls from "./PartnerControls";
import { isValidSubRoute } from "../../../lib/routeAnalyzer";

export const dynamic = 'force-dynamic';

export default async function PartnerDashboardPage() {
  const recentPartner = await prisma.partner.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (!recentPartner) {
    return <div className="p-20 text-center uppercase tracking-widest text-gray-400">Partner Node Not Found</div>;
  }

  const partnerName = recentPartner.name?.split(' ')[0] || "Traveler";
  
  // 1. Fetch Active Mission
  const activeParcel = await prisma.parcel.findFirst({
      where: { 
          partnerId: recentPartner.id, 
          status: { in: ['Accepted', 'InTransit', 'Delivered'] } 
      },
      include: { user: true }
  });

  // 2. Fetch Earnings (Net 80% to Traveler)
  const completedParcels = await prisma.parcel.findMany({
      where: { partnerId: recentPartner.id, status: 'Completed' }
  });
  const totalEarnings = completedParcels.reduce((acc, p) => acc + (p.price * 0.8), 0);

  // 3. Scan Radar if idle
  let pendingRequest = null;
  if (!activeParcel && recentPartner.routeFrom && recentPartner.routeTo) {
      const allSearchingParcels = await prisma.parcel.findMany({
          where: { status: "Searching" },
          orderBy: { createdAt: 'desc' }
      });
      
      for (const parcel of allSearchingParcels) {
          const isMatch = await isValidSubRoute(recentPartner.routeFrom!, recentPartner.routeTo!, parcel.pickupLocation, parcel.dropLocation);
          if (isMatch) {
              pendingRequest = parcel;
              break;
          }
      }
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pt-12 pb-24 px-6 md:px-0 scrollbar-hide">
      
      {/* Network Identification Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 relative">
          <div>
            <h1 className="text-4xl md:text-6xl font-light text-black tracking-tighter leading-none">
                Node ID: <span className="font-bold">{partnerName.toUpperCase()}</span>
            </h1>
            <div className="mt-6 flex items-center space-x-6">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-none ${recentPartner.kycCompleted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">KYC: {recentPartner.kycCompleted ? 'VERIFIED' : 'PENDING'}</span>
                </div>
                <div className="w-px h-3 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-none"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">TRUST SCORE: 4.9</span>
                </div>
            </div>
          </div>
          
          <div className="hidden md:block bg-black text-white px-6 py-2 text-[10px] uppercase font-bold tracking-[0.3em] absolute -top-12 right-0 italic opacity-10">
              TRAVELER_CONSOLE_PRTCL_v1.0
          </div>
      </div>

      <div className="space-y-16">
          {/* PRIMARY MISSION CONSOLE */}
          <section>
                <div className="flex items-center space-x-4 mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Current Mission</h3>
                    <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                
                {activeParcel ? (
                    <ActiveMissionConsole activeParcel={activeParcel} />
                ) : pendingRequest ? (
                    <div className="bg-white border-2 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] p-10 max-w-2xl relative animate-fade-in mx-auto md:mx-0 group hover:translate-x-2 hover:-translate-y-2 transition-transform duration-300">
                        <div className="absolute top-0 right-0 bg-red-600 animate-pulse text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 shadow-xl">
                            Live Match
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-between mb-8 pb-8 border-b border-gray-100 gap-6">
                            <div className="space-y-1">
                                <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Inbound</p>
                                <h3 className="text-2xl font-light tracking-tight text-black">{pendingRequest.pickupLocation}</h3>
                            </div>
                            <div className="space-y-1 md:text-right">
                                <p className="text-[9px] uppercase font-bold text-gray-300 tracking-widest border-b border-gray-200 inline-block">Outbound Target</p>
                                <h3 className="text-2xl font-light tracking-tight text-black">{pendingRequest.dropLocation}</h3>
                            </div>
                        </div>

                        <div className="bg-[#fcfcfc] border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
                            <div>
                                <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">Contract Value</p>
                                <p className="text-xl font-bold text-black italic">₹{(pendingRequest.price * 0.8).toFixed(2)}</p>
                            </div>
                            <div className="border-l border-gray-200 pl-8">
                                <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">Payload Weight</p>
                                <p className="text-sm font-bold text-black">{pendingRequest.weight} KG</p>
                            </div>
                            <div className="hidden md:block border-l border-gray-200 pl-8">
                                <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">Priority Protocol</p>
                                <p className="text-sm font-bold text-red-600 uppercase tracking-widest">{pendingRequest.urgency}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <PartnerAcceptAction parcelId={pendingRequest.id} partnerId={recentPartner.id} />
                            <button className="px-8 py-5 border border-gray-200 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:border-black hover:text-black transition-all">Decline</button>
                        </div>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-200 py-20 flex flex-col items-center justify-center text-center group cursor-crosshair">
                        <div className="relative w-20 h-20 mb-8">
                            <div className="absolute inset-0 border-2 border-gray-100 rounded-none animate-ping opacity-40"></div>
                            <div className="absolute inset-4 bg-gray-50 border border-gray-200 rounded-none flex items-center justify-center">
                                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-[0.3em]">Scan</span>
                            </div>
                        </div>
                        <h4 className="text-xl font-light text-black tracking-tight mb-2">Logs Idle: Monitoring Grid</h4>
                        <p className="text-xs text-gray-400 font-normal uppercase tracking-[.2em] px-12 leading-relaxed">System awaiting logistics requests synchronized with your Trajectory Corridor.</p>
                    </div>
                )}
          </section>

          {/* CONTROLS & WALLET PORT */}
          <section>
                <div className="flex items-center space-x-4 mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Logistics Settings</h3>
                    <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                <PartnerControls partner={recentPartner} earnings={totalEarnings} />
          </section>
      </div>

      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]">
          <div className="absolute top-1/4 left-10 w-px h-64 bg-black"></div>
          <div className="absolute bottom-1/4 right-20 w-px h-96 bg-black"></div>
          <div className="absolute top-1/3 right-1/3 w-96 h-px bg-black"></div>
      </div>
    </div>
  );
}
