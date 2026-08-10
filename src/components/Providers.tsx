"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({ children, session }: { children: React.ReactNode, session?: any }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  );
}
