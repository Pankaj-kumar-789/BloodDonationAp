"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReviewAction(reviewedId: string, rating: number, comment?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };
    if (session.user.id === reviewedId) return { error: "Cannot review yourself" };

    if (rating < 1 || rating > 5) return { error: "Invalid rating" };

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId: session.user.id,
        reviewedId
      }
    });

    if (existingReview) {
      // Update existing
      await prisma.review.update({
        where: { id: existingReview.id },
        data: { rating, comment }
      });
    } else {
      // Create new
      await prisma.review.create({
        data: {
          reviewerId: session.user.id,
          reviewedId,
          rating,
          comment
        }
      });
    }

    // Recalculate average rating if it's a donor
    const donorProfile = await prisma.donorProfile.findUnique({
      where: { userId: reviewedId }
    });

    if (donorProfile) {
      const allReviews = await prisma.review.findMany({
        where: { reviewedId }
      });
      const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

      await prisma.donorProfile.update({
        where: { userId: reviewedId },
        data: { rating: avg }
      });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/donor/${reviewedId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return { error: "Failed to submit review" };
  }
}

export async function getUserReviewsAction(userId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { reviewedId: userId },
      include: {
        reviewer: {
          select: { id: true, name: true, image: true, role: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, reviews };
  } catch (error: any) {
    console.error("Failed to fetch reviews:", error);
    return { error: "Failed to fetch reviews" };
  }
}
