import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const userId = session.metadata?.userId;
    const donorId = session.metadata?.donorId;
    
    if (userId && donorId) {
      // 1. Create the ContactUnlock record
      await prisma.contactUnlock.upsert({
        where: {
          userId_donorId: {
            userId: userId,
            donorId: donorId
          }
        },
        update: {},
        create: {
          userId: userId,
          donorId: donorId
        }
      });

      // 2. Record the transaction
      await prisma.transaction.create({
        data: {
          userId: userId,
          amount: (session.amount_total || 0) / 100, // Convert from paise to INR
          currency: "INR",
          status: "COMPLETED",
          stripeSessionId: session.id,
          type: "CONTACT_UNLOCK"
        }
      });
    }
  }

  return NextResponse.json({ received: true });
}
