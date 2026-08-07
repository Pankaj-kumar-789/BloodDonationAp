import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { donorId } = await req.json();

    const donorProfile = await prisma.donorProfile.findUnique({
      where: { id: donorId },
      include: { user: true }
    });

    if (!donorProfile) {
      return NextResponse.json({ message: "Donor not found" }, { status: 404 });
    }

    // Platform fee ₹20 + Donor Fee
    const platformFee = 20;
    const donorFee = donorProfile.contactFee || 0;
    const totalAmount = platformFee + donorFee;

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Unlock Contact - ${donorProfile.user.name}`,
              description: `Blood Group: ${donorProfile.bloodGroup.replace("_", " ")}`,
            },
            unit_amount: totalAmount * 100, // Stripe expects amounts in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/success?session_id={CHECKOUT_SESSION_ID}&donor=${donorId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/search`,
      metadata: {
        userId: session.user.id,
        donorId: donorId,
        type: "CONTACT_UNLOCK"
      },
    });

    return NextResponse.json({ id: stripeSession.id });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
