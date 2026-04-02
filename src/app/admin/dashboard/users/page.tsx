import React from 'react';
import { prisma } from "../../../../lib/prisma";

// Ensure this route is dynamically rendered to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-gray-300 pb-6">
        <div>
          <h1 className="text-3xl font-light text-black tracking-tight">Standard Users</h1>
          <p className="text-sm text-gray-500 font-normal mt-1">Found {users.length} registered accounts across the platform.</p>
        </div>
        <div className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest">
           Export CSV
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafafa] border-b border-gray-200">
              <th className="p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-6">Identifier</th>
              <th className="p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest">Name</th>
              <th className="p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest">Email Address</th>
              <th className="p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest">Phone Number</th>
              <th className="p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest whitespace-nowrap">Registration Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4 pl-6 text-xs font-mono text-gray-400 group-hover:text-black transition-colors">{user.id.split('-')[0] || user.id.slice(0, 8)}...</td>
                <td className="p-4 text-sm font-medium text-black">{user.name || <span className="text-gray-300 italic">Not provided</span>}</td>
                <td className="p-4 text-sm text-gray-600">{user.email}</td>
                <td className="p-4 text-sm text-gray-600">{user.phoneNumber || <span className="text-gray-300 italic">Not provided</span>}</td>
                <td className="p-4 text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-sm text-gray-400 italic">No user records found in the database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
