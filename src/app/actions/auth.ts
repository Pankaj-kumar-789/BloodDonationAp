"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  try {
    console.log("Starting loginAction...");
    console.log("Credentials provided:", formData.get("email"));
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error: any) {
    console.error("loginAction Error caught:", error.name, error.message, error.stack);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    // Re-throw if it's NEXT_REDIRECT
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
