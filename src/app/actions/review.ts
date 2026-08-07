"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReviewAction(reviewedUserId: string, rating: number, comment?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };
    if (session.user.id === reviewedUserId) return { error: "You cannot review yourself" };
    
    if (rating < 1 || rating > 5) return { error: "Rating must be between 1 and 5" };

    // Create the review
    const review = await prisma.review.create({
      data: {
        reviewerId: session.user.id,
        reviewedId: reviewedUserId,
        rating,
        comment: comment?.trim() || null,
      }
    });

    // Recalculate average rating for the reviewed user
    const allReviews = await prisma.review.findMany({
      where: { reviewedId: reviewedUserId },
      select: { rating: true }
    });
    
    const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = allReviews.length > 0 ? sum / allReviews.length : 0;

    // Update the DonorProfile rating if it exists
    await prisma.donorProfile.updateMany({
      where: { userId: reviewedUserId },
      data: { rating: averageRating }
    });

    revalidatePath("/search");
    revalidatePath(`/donor/${reviewedUserId}`);
    
    return { success: true, review };
  } catch (error: any) {
    console.error("Create review error:", error);
    return { error: "Failed to submit review" };
  }
}
