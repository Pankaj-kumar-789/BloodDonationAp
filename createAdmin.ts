import 'dotenv/config';
import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@raktasetu.com' },
    update: { role: 'ADMIN', password: hashedPassword },
    create: {
      email: 'admin@raktasetu.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Admin user created successfully!');
  console.log('Email: admin@raktasetu.com');
  console.log('Password: admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
