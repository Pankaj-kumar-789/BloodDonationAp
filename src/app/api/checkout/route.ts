import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "dummy_key",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
    });

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { donorId } = await req.json();

    let donorProfile = await prisma.donorProfile.findUnique({
      where: { userId: donorId },
      include: { user: true }
    });

    if (!donorProfile) {
      // Create a default profile if they don't have one yet
      donorProfile = await prisma.donorProfile.create({
        data: {
          userId: donorId,
          bloodGroup: "O_POS",
          city: "Unknown",
          state: "Unknown",
        },
        include: { user: true }
      });
    }

    // Fixed fee of ₹20
    const totalAmount = 20;

    // Create a Razorpay order
    const options = {
      amount: totalAmount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        userId: session.user.id,
        donorId: donorProfile.id, // Must be DonorProfile ID, not User ID
        type: "CONTACT_UNLOCK"
      }
    };

    const order = await razorpay.orders.create(options);

    // Save the transaction in the database
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: totalAmount,
        providerOrderId: order.id,
        type: "CONTACT_UNLOCK",
        status: "PENDING",
      }
    });

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

