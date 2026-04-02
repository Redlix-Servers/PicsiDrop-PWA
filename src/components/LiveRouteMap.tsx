"use client";

import dynamic from 'next/dynamic';

// Next.js specific architectural requirement: React-Leaflet heavily interrogates the global 'window'
// object immediately at runtime. We must strictly prevent the server from compiling it during SSR.
const DynamicLeafletMap = dynamic(() => import('./LeafletMapCore'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#f4f4f5] text-gray-400 font-mono text-sm uppercase">
       <div className="w-12 h-12 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
       Initializing GPS Satellite Links...
    </div>
  )
});

export default function LiveRouteMap({ pickup, drop }: { pickup: string, drop: string }) {
  return (
    <div className="w-full h-full relative z-0">
        <DynamicLeafletMap pickup={pickup} drop={drop} />
    </div>
  );
}
