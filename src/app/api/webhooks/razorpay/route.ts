import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ message: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature (You can set this in Razorpay dashboard and .env later)
    // For now, if RAZORPAY_WEBHOOK_SECRET is not set, we skip strict verification but it's required for prod
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    // Handle the payment.captured event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const notes = payment.notes;

      // Update the transaction status
      const transaction = await prisma.transaction.update({
        where: { providerOrderId: orderId },
        data: { status: "COMPLETED" }
      });

      // If it's a contact unlock, create the ContactUnlock record
      if (notes && notes.type === "CONTACT_UNLOCK" && notes.userId && notes.donorId) {
        // Prevent duplicate unlocks
        const existingUnlock = await prisma.contactUnlock.findUnique({
          where: {
            userId_donorId: {
              userId: notes.userId,
              donorId: notes.donorId
            }
          }
        });

        if (!existingUnlock) {
          await prisma.contactUnlock.create({
            data: {
              userId: notes.userId,
              donorId: notes.donorId,
            }
          });
          
          // Optional: Create notification for donor
          await prisma.notification.create({
            data: {
              userId: notes.donorId,
              title: "Contact Detail Unlocked",
              body: "Someone has paid to unlock your contact details.",
              link: "/dashboard/history"
            }
          });
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Razorpay Webhook Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
