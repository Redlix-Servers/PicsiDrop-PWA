"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Next.js Leaflet default icon bug
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customPartnerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function LeafletMapCore({ pickup, drop }: { pickup: string, drop: string }) {
    const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
    const [dropCoords, setDropCoords] = useState<[number, number] | null>(null);
    const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default India

    // Offline mapping metrics for zero-latency cartography bounds
    const localGeoCache: Record<string, { lat: number; lon: number }> = {
        "hyderabad": { lat: 17.3850, lon: 78.4867 },
        "vijayawada": { lat: 16.5062, lon: 80.6480 },
        "gudivada": { lat: 16.4344, lon: 80.9930 },
        "suryapet": { lat: 17.1396, lon: 79.6234 },
        "eluru": { lat: 16.7107, lon: 81.1031 },
        "mumbai": { lat: 19.0760, lon: 72.8777 },
        "pune": { lat: 18.5204, lon: 73.8567 },
        "bangalore": { lat: 12.9716, lon: 77.5946 },
        "chennai": { lat: 13.0827, lon: 80.2707 }
    };

    // Geocode cities dynamically
    useEffect(() => {
        const fetchCoordinates = async (query: string) => {
            if (!query) return null;
            
            const normalizedQuery = query.toLowerCase().trim();
            if (localGeoCache[normalizedQuery]) return [localGeoCache[normalizedQuery].lat, localGeoCache[normalizedQuery].lon] as [number, number];

            try {
                // Ensure Nominatim minimum 1-second gap protocol natively in browser map
                await new Promise(resolve => setTimeout(resolve, 1100));

                // Injected auth email and restricted search to Indian bounds to prevent 403 rejections
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(query)}&email=contact@picsidrop.com`);
                
                if (!res.ok) {
                    throw new Error(`Nominatim API returned status: ${res.status}`);
                }
                
                const data = await res.json();
                if (data && data.length > 0) {
                    return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
                }
            } catch (err: any) {
                console.error("Geocoding failed for:", query, err?.message || err);
            }
            return null;
        };

        const loadRoutes = async () => {
            const pCode = await fetchCoordinates(pickup);
            const dCode = await fetchCoordinates(drop);
            if (pCode) setPickupCoords(pCode);
            if (dCode) setDropCoords(dCode);

            // Auto center between the two if both exist
            if (pCode && dCode) {
                setCenter([
                    (pCode[0] + dCode[0]) / 2,
                    (pCode[1] + dCode[1]) / 2,
                ]);
            } else if (pCode) {
                setCenter(pCode);
            } else if (dCode) {
                setCenter(dCode);
            }
        };

        loadRoutes();
    }, [pickup, drop]);

    const MapBoundsFitter = () => {
        const map = useMap();
        useEffect(() => {
            if (pickupCoords && dropCoords) {
                map.fitBounds([pickupCoords, dropCoords], { padding: [50, 50] });
            }
        }, [pickupCoords, dropCoords, map]);
        return null;
    };

    return (
        <MapContainer center={center} zoom={6} className="w-full h-full z-0 font-sans" zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {pickupCoords && (
                <Marker position={pickupCoords}>
                    <Popup>
                        <div className="font-bold text-xs uppercase tracking-widest">Origin Pickup</div>
                        <div className="text-gray-500">{pickup}</div>
                    </Popup>
                </Marker>
            )}
            {dropCoords && (
                <Marker position={dropCoords}>
                    <Popup>
                        <div className="font-bold text-xs uppercase tracking-widest text-red-600">Final Drop</div>
                        <div className="text-gray-500">{drop}</div>
                    </Popup>
                </Marker>
            )}
            {pickupCoords && dropCoords && (
                <Polyline 
                    positions={[pickupCoords, dropCoords]} 
                    color="black" 
                    weight={3} 
                    dashArray="10, 10" 
                    className="animate-pulse"
                />
            )}
            
            {/* Simulate Partner Transit halfway */}
            {pickupCoords && dropCoords && (
                <Marker position={[(pickupCoords[0] + dropCoords[0]) / 2, (pickupCoords[1] + dropCoords[1]) / 2]} icon={customPartnerIcon}>
                     <Popup>
                        <div className="font-bold text-xs uppercase tracking-widest text-[#D2E32B] bg-black px-2 py-1 inline-block mb-1">PARTNER</div>
                        <div className="text-gray-600 font-mono text-[10px]">In Transit...</div>
                     </Popup>
                </Marker>
            )}

            <MapBoundsFitter />
        </MapContainer>
    );
}
