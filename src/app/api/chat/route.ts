import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const systemPrompt = "You are RaktaSetu's AI Medical & Eligibility Assistant. Your ONLY purpose is to answer questions related to blood donation eligibility, the donation process, post-donation care, and to help users find live statistics from the RaktaSetu database. Be professional, compassionate, and concise. Format your answers beautifully with markdown, bullet points, and short paragraphs. If a user asks about anything unrelated to blood donation or health, politely redirect them to blood donation topics. Do not provide actual medical diagnoses; always advise consulting a doctor for serious medical concerns.";

export async function POST(req: Request) {
  console.log("=== API CHAT ROUTE CALLED ===");
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response("Error: The GOOGLE_GENERATIVE_AI_API_KEY environment variable is missing on Vercel. Please add it in your Vercel Project Settings.", { status: 200 });
    }

    // Direct test to catch hidden Google API errors on Vercel
    try {
      const testRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
      });
      if (!testRes.ok) {
        const errText = await testRes.text();
        return new Response(`[AI Connection Error: Google API rejected the request on Vercel: ${errText}]`, { status: 200 });
      }
    } catch (fetchErr: any) {
      return new Response(`[AI Connection Error: Failed to reach Google API from Vercel: ${fetchErr.message}]`, { status: 200 });
    }

    const { messages } = await req.json();
    console.log("Messages:", JSON.stringify(messages));

    // Fetch live database stats directly to bypass tool streaming bugs
    let liveStatsStr = "";
    try {
      const statsPromise = Promise.all([
        prisma.user.count(),
        prisma.donorProfile.count(),
        prisma.bloodRequest.count(),
        prisma.hospitalProfile.count()
      ]);
      const [totalUsers, totalDonors, totalRequests, totalHospitals] = await Promise.race([
        statsPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Database connection timed out")), 1500))
      ]) as [number, number, number, number];
      
      liveStatsStr = `\n\nLive Database Stats: Currently, RaktaSetu has ${totalUsers} total users, ${totalDonors} registered donors, ${totalHospitals} hospitals, and ${totalRequests} active blood requests. You can share these numbers if asked.`;
    } catch (dbErr) {
      console.log("Database connection error/timeout, skipping stats:", dbErr);
    }

    const result = streamText({
      model: google('gemini-3.6-flash'), // Automatically uses GOOGLE_GENERATIVE_AI_API_KEY from .env
      system: systemPrompt + liveStatsStr,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (err: any) {
    console.error("AI Route Error:", err);
    return new Response(err.message, { status: 500 });
  }
}
