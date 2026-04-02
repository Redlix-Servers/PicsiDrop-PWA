"use server";

import { prisma } from "@/lib/prisma";

export async function handleSignUp(formData: any) {
  try {
    const { name, email, password, phoneNumber } = formData;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Simple create (You should hash passwords in production!)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Ideally hashed with bcrypt!
        phoneNumber,
      },
    });

    return { success: true, user: { email: user.email, name: user.name } };
  } catch (error: any) {
    console.error("Sign-up error:", error);
    return { error: error.message || "An error occurred during registration" };
  }
}

export async function handleSignIn(formData: any) {
  try {
    const { email, password } = formData;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return { error: "Invalid email or password" };
    }

    return { success: true, user: { email: user.email, name: user.name } };
  } catch (error: any) {
    console.error("Sign-in error:", error);
    return { error: error.message || "An error occurred during sign-in" };
  }
}

export async function handlePartnerSignUp(formData: any) {
  try {
    const { name, email, password, phoneNumber } = formData;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const existingPartner = await prisma.partner.findUnique({
      where: { email },
    });

    if (existingPartner) {
      return { error: "Partner with this email already exists" };
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        email,
        password,
        phoneNumber,
      },
    });

    return { success: true, partner: { email: partner.email, name: partner.name } };
  } catch (error: any) {
    console.error("Partner sign-up error:", error);
    return { error: error.message || "An error occurred during partner registration" };
  }
}

export async function handlePartnerSignIn(formData: any) {
  try {
    const { email, password } = formData;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const partner = await prisma.partner.findUnique({
      where: { email },
    });

    if (!partner || partner.password !== password) {
      return { error: "Invalid email or password" };
    }

    return { success: true, partner: { email: partner.email, name: partner.name } };
  } catch (error: any) {
    console.error("Partner sign-in error:", error);
    return { error: error.message || "An error occurred during partner sign-in" };
  }
}

export async function handlePartnerKYC(formData: any) {
  try {
    const { email, ...kycData } = formData;

    if (!email) {
      return { error: "Partner email is required to save KYC details." };
    }

    const updatedPartner = await prisma.partner.update({
      where: { email },
      data: {
        ...kycData,
        kycCompleted: true,
      },
    });

    return { success: true, partner: { email: updatedPartner.email, kycCompleted: updatedPartner.kycCompleted } };
  } catch (error: any) {
    console.error("KYC submission error:", error);
    return { error: error.message || "An error occurred while saving KYC details." };
  }
}

export async function handleAdminSignIn(formData: any) {
  try {
    const { email, password } = formData;

    const correctEmail = process.env.ADMIN_EMAIL;
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctEmail || !correctPassword) {
        return { error: "Admin credentials are not configured in environment variables." };
    }

    if (email !== correctEmail || password !== correctPassword) {
      return { error: "Invalid administrator credentials" };
    }

    return { success: true, admin: { email: correctEmail } };
  } catch (error: any) {
    console.error("Admin sign-in error:", error);
    return { error: error.message || "An error occurred during admin sign-in" };
  }
}


