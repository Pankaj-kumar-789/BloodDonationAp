import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { comparePassword } from "@/lib/hash"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("authorize called with email:", credentials?.email);
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          console.log("Finding user in database...");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          });
          console.log("User found:", user ? user.email : "none");
          
          if (!user || !user.password) return null;
          
          console.log("Comparing password (async)...");
          const isValid = await comparePassword(credentials.password as string, user.password);
          console.log("Password valid:", isValid);
          if (!isValid) return null;
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error: any) {
          console.error("Authorize error:", error.name, error.message, error.stack);
          throw error;
        }
      }
    })
  ],
})
