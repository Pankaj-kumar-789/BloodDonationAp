import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { auth } from "@/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RaktaSetu - Find Blood Donors Near You",
  description: "A platform that connects blood donors with people in need.",
};

import { prisma } from "@/lib/prisma";

import Sidebar from "@/components/Sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  let unreadCount = 0;
  if (session?.user?.id) {
    unreadCount = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false }
    });
  }
  
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] flex bg-background text-foreground overflow-hidden">
        <Providers session={session}>
          <Sidebar session={session} />
          <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-y-auto">
            <Navbar session={session} unreadCount={unreadCount} />
            <main className="flex-grow flex flex-col">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
