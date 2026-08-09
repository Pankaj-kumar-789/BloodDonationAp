import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

// Use scrypt instead of bcryptjs to prevent Vercel Serverless crashes
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function comparePassword(password: string, hash: string): boolean {
  try {
    if (!hash || !hash.includes(":")) return false;
    const [salt, key] = hash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = scryptSync(password, salt, 64);
    return timingSafeEqual(keyBuffer, derivedKey);
  } catch (error) {
    console.error("comparePassword error:", error);
    return false;
  }
}
