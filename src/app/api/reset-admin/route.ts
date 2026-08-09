import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export async function GET() {
  try {
    const hashedPassword = await hashPassword('admin123');

    const admin = await prisma.user.upsert({
      where: { email: 'admin@raktasetu.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email: 'admin@raktasetu.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    return NextResponse.json({ message: "Admin password successfully reset to new native hash format!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
