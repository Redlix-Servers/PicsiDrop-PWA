// Dynamic Geospatial Route Engine
// Uses offline coordinate cache for mass-routing, falling back securely to rate-limited OpenStreetMap Nominatim.

const geoCache: Record<string, { lat: number; lon: number }> = {
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

async function geocodeCity(city: string): Promise<{ lat: number; lon: number } | null> {
    const query = city.toLowerCase().trim();
    if (geoCache[query]) return geoCache[query];

    // Nominatim uniquely demands maximum 1 Request Per Second to prevent global 429 blocks.
    await new Promise(resolve => setTimeout(resolve, 1100));

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&email=contact@picsidrop.com&q=${encodeURIComponent(query)}`, {
            cache: 'no-store',
            headers: {
                'User-Agent': 'PicsiDrop-Logistics-Platform/1.0 (contact@picsidrop.com)'
            }
        });
        
        if (!res.ok) {
            console.error(`Nominatim API returned structural error mapping ${city}: ${res.status} ${res.statusText}`);
            throw new Error(`Nominatim API returned status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data && data.length > 0) {
            const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            geoCache[query] = coords;
            return coords;
        }
    } catch (e: any) {
        console.error("Geocoding API failed for:", city, "ERR:", e?.message || e);
    }
    return null;
}

// Calculates curved distance between two points on Earth in Kilometers
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export async function isValidSubRoute(partnerFrom: string, partnerTo: string, parcelFrom: string, parcelTo: string): Promise<boolean> {
    // 1. Check exact string fallback (Zero physical distance)
    if (partnerFrom.toLowerCase().trim() === parcelFrom.toLowerCase().trim() && 
        partnerTo.toLowerCase().trim() === parcelTo.toLowerCase().trim()) return true;

    // 2. Fetch coordinates sequentially to avoid API throttling overlap limits
    const pFrom = await geocodeCity(partnerFrom);
    const pTo = await geocodeCity(partnerTo);
    const cFrom = await geocodeCity(parcelFrom);
    const cTo = await geocodeCity(parcelTo);

    // If API fails to map any node correctly, default false to avoid routing into the ocean
    if (!pFrom || !pTo || !cFrom || !cTo) return false;

    // 3. Mathematical Triangulation
    // Optimal path is Partner Origin -> Parcel Origin -> Parcel Drop -> Partner Drop
    const directPartnerDistance = getHaversineDistance(pFrom.lat, pFrom.lon, pTo.lat, pTo.lon);
    
    const segmentedDetourDistance = 
        getHaversineDistance(pFrom.lat, pFrom.lon, cFrom.lat, cFrom.lon) + 
        getHaversineDistance(cFrom.lat, cFrom.lon, cTo.lat, cTo.lon) + 
        getHaversineDistance(cTo.lat, cTo.lon, pTo.lat, pTo.lon);

    // If the detour is purely backwards, the total distance balloons aggressively. 
    // If the detour is directly on the geographical line, Segmented ~ Direct distance.
    // We allow a maximum 18% physical spatial deviation tolerance across the Indian grid scale.
    const allowableDetour = directPartnerDistance * 1.18; 
    
    // Safety limit: Don't detour if the deviation throws them farther than mapping tolerance
    return segmentedDetourDistance <= allowableDetour;
}

