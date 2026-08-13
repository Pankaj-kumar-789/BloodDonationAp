import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET || "super-secret-jwt-key-for-development-only",
  trustHost: true,
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isPublicRoute = ["/", "/login", "/register", "/forgot-password"].includes(nextUrl.pathname);

      if (isApiAuthRoute) return true;

      if (isPublicRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) {
        return false; // Redirects to signIn page
      }

      // Basic Role Based Routing
      const role = (auth.user as any)?.role;
      if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.name = user.name;
        // Omit image from token because base64 images cause HTTP 431 Request Header Too Large errors
      }
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.name = token.name as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  }
} satisfies NextAuthConfig;
