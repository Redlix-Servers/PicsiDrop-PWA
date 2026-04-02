import React from 'react';
import { prisma } from "../../../../lib/prisma";

// Ensure this route is dynamically rendered to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-gray-300 pb-6">
        <div>
          <h1 className="text-3xl font-light text-black tracking-tight">Logistics Partners</h1>
          <p className="text-sm text-gray-500 font-normal mt-1">Found {partners.length} delivery partner accounts.</p>
        </div>
        <div className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest">
           Export CSV
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#fafafa] border-b border-gray-200">
              <th className="p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-6">Identifier</th>
              <th className="p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest">Partner Name</th>
              <th className="p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest">Contact Info</th>
              <th className="p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest">Primary Route</th>
              <th className="p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest text-center">KYC Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partners.map((partner: any) => (
              <tr key={partner.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4 pl-6 text-xs font-mono text-gray-400 group-hover:text-black transition-colors">
                    {partner.id.split('-')[0] || partner.id.slice(0, 8)}...
                </td>
                <td className="p-4 text-sm font-medium text-black">
                    {partner.name || <span className="text-gray-300 italic">Not provided</span>}
                    {partner.username && <div className="text-[10px] text-gray-400 font-normal mt-0.5">@{partner.username}</div>}
                </td>
                <td className="p-4 text-sm text-gray-600">
                    <div>{partner.email}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{partner.phoneNumber || 'No phone'}</div>
                </td>
                <td className="p-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    {partner.routeFrom && partner.routeTo ? (
                        <span>{partner.routeFrom} <span className="text-gray-300 mx-1">→</span> {partner.routeTo}</span>
                    ) : (
                        <span className="text-gray-300 normal-case font-normal italic">Unassigned</span>
                    )}
                </td>
                <td className="p-4 text-center">
                    {partner.kycCompleted ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest border border-green-200">
                            Verified
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-widest border border-yellow-200">
                            Pending
                        </span>
                    )}
                </td>
              </tr>
            ))}
            
            {partners.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-sm text-gray-400 italic">No partner records found in the database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
