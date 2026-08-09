"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  try {
    console.log("Starting loginAction...");
    console.log("Credentials provided:", formData.get("email"));
    const res = await signIn("credentials", { ...Object.fromEntries(formData), redirect: false });
    console.log("signIn completed:", res);
  } catch (error: any) {
    console.error("loginAction Error caught:", error?.name, error?.message, error?.stack);
    
    // Allow NEXT_REDIRECT to bubble up so Next.js handles the redirect
    if (error?.message?.includes("NEXT_REDIRECT") || error?.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: `Auth Error: ${error.message || "Unknown"}` };
      }
    }
    
    return { error: `Server Error: ${error?.message || "Unknown error"}` };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
