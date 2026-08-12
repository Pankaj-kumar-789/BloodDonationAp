import { PrismaClient } from '@prisma/client';
import { hashPassword } from './src/lib/hash';
import dotenv from 'dotenv';
import path from 'path';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const h = await hashPassword('password123');
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { role: 'ADMIN' },
    create: {
      name: 'Super Admin',
      email: 'admin@example.com',
      password: h,
      phone: '0000000000',
      role: 'ADMIN'
    }
  });
  console.log('Admin user created successfully.');
  process.exit(0);
}

run();
