"use server";

import { prisma } from "../../lib/prisma";

export async function calculateParcelPrice(weight: number, urgency: string) {
  let baseRate = 250.00; // Base logistics rate in INR 
  let weightMultiplier = weight * 45.00; // ₹45.00 flat per KG
  let urgencyMultiplier = urgency === "Express" ? 1.5 : urgency === "Urgent" ? 2.0 : 1.0;

  return Number(((baseRate + weightMultiplier) * urgencyMultiplier).toFixed(2));
}

export async function createParcelRequest(formData: any) {
  try {
    const { userId, pickupLocation, dropLocation, weight, dimensions, urgency, paymentMethod } = formData;
    
    // Simulate dynamic route distance calculation (hardcoded proxy for map API)
    const price = await calculateParcelPrice(Number(weight), urgency);

    // Create tracking OTPs natively
    const pickupOTP = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryOTP = Math.floor(1000 + Math.random() * 9000).toString();

    const parcel = await prisma.parcel.create({
      data: {
        userId,
        pickupLocation,
        dropLocation,
        weight: Number(weight),
        dimensions,
        urgency,
        price,
        paymentMethod,
        status: "Searching",
        pickupOTP,
        deliveryOTP
      }
    });

    return { success: true, parcel };
  } catch (error: any) {
    console.error("Create parcel error:", error);
    return { error: error.message || "Failed to create parcel request." };
  }
}

import { isValidSubRoute } from "../../lib/routeAnalyzer";

export async function matchPartnersToParcel(pickup: string, drop: string) {
    try {
        // Fetch all verified partners to run them through our Intelligent Corridor Analyzer
        const partners = await prisma.partner.findMany({
            where: { kycCompleted: true }
        });

        // Run partners sequentially through our Geospatial Route Validator
        const validMatches = [];
        for (const p of partners) {
            if (p.routeFrom && p.routeTo) {
                const isMatch = await isValidSubRoute(p.routeFrom, p.routeTo, pickup, drop);
                if (isMatch) validMatches.push(p);
            }
        }

        return { success: true, matches: validMatches.slice(0, 3) };
    } catch (err: any) {
        console.error("Route matching failed", err);
        return { error: "Failed finding route matches" };
    }
}

export async function acceptParcelRequest(parcelId: string, partnerId: string) {
    try {
        const updatedParcel = await prisma.parcel.update({
            where: { id: parcelId },
            data: {
                status: "Accepted",
                partnerId: partnerId
            }
        });
        return { success: true, parcel: updatedParcel };
    } catch (err: any) {
        console.error("Failed to accept parcel", err);
        return { error: "Failed to accept parcel." };
    }
}

export async function verifyPickupOTP(parcelId: string, submittedOTP: string) {
    try {
        const parcel = await prisma.parcel.findUnique({ where: { id: parcelId } });
        
        if (!parcel) return { error: "Parcel not found." };
        if (parcel.pickupOTP !== submittedOTP) return { error: "Invalid Authentication Code." };
        
        const updatedParcel = await prisma.parcel.update({
            where: { id: parcelId },
            data: { status: "InTransit" }
        });
        
        return { success: true, parcel: updatedParcel };
    } catch (err: any) {
        console.error("Failed to verify OTP", err);
        return { error: "System error during verification." };
    }
}

export async function completeParcelDelivery(parcelId: string) {
    try {
        const updatedParcel = await prisma.parcel.update({
            where: { id: parcelId },
            data: { status: "Completed" },
        });
        
        return { success: true, parcel: updatedParcel };
    } catch (err: any) {
        console.error("Failed to complete delivery", err);
        return { error: "System error executing Escrow release." };
    }
}


