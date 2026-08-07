import NextAuth, { type DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

export type ExtendedUser = DefaultSession["user"] & {
  id: string
  role: Role
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
