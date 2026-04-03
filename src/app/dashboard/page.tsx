import React from 'react';
import { prisma } from "@/lib/prisma";
import ParcelFlow from "../../components/ParcelFlow";

export default async function DashboardPage() {
  // Fetch real user data for the greet
  // Note: in a production app with sessions, we'd query by session email
  const recentUser = await prisma.user.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const userName = recentUser?.name?.split(' ')[0] || "User";
  
  return (
    <div className="max-w-6xl mx-auto animate-fade-in pt-6 md:pt-12 px-4 md:px-0 space-y-8 md:space-y-12">
      <div>
        <h1 className="text-3xl md:text-5xl font-normal text-black tracking-tighter leading-none">
          Welcome back, {userName}
        </h1>
        <div className="mt-8 h-px w-24 bg-gray-100 mb-2"></div>
      </div>

      <div className="w-full">
         <ParcelFlow userId={recentUser?.id || "fallback-id"} />
      </div>
    </div>
  );
}
