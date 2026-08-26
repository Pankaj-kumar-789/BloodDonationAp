import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donorId } = await req.json();

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ message: "Razorpay keys are missing in Vercel Environment Variables." }, { status: 500 });
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
    }

    // Get the donor profile
    const donorProfile = await prisma.donorProfile.findUnique({
      where: { userId: donorId }
    });

    if (!donorProfile) {
      return NextResponse.json({ message: "Donor profile not found" }, { status: 404 });
    }

    // Update Transaction to COMPLETED
    await prisma.transaction.updateMany({
      where: { providerOrderId: razorpay_order_id },
      data: { status: "COMPLETED" }
    });

    // Create ContactUnlock record
    const existingUnlock = await prisma.contactUnlock.findUnique({
      where: {
        userId_donorId: {
          userId: session.user.id,
          donorId: donorProfile.id
        }
      }
    });

    if (!existingUnlock) {
      await prisma.contactUnlock.create({
        data: {
          userId: session.user.id,
          donorId: donorProfile.id,
        }
      });
      
      // Optional: Create notification for donor
      await prisma.notification.create({
        data: {
          userId: donorProfile.userId,
          title: "Contact Detail Unlocked",
          body: "Someone has unlocked your contact details.",
          link: "/dashboard/history"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
