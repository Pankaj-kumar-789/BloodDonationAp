import { PrismaClient, BloodGroup } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../src/lib/hash';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with mock data...');

  const passwordHash = await hashPassword('password123');

  // 1. Create a Standard User (Recipient)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Rohan Sharma',
      email: 'user@example.com',
      password: passwordHash,
      phone: '9876543210',
      role: 'USER',
    },
  });

  // 2. Create a Donor
  const donor = await prisma.user.upsert({
    where: { email: 'donor@example.com' },
    update: {},
    create: {
      name: 'Aryan Kumar',
      email: 'donor@example.com',
      password: passwordHash,
      phone: '9123456789',
      role: 'DONOR',
      donorProfile: {
        create: {
          bloodGroup: 'O_POS',
          city: 'Mumbai',
          state: 'Maharashtra',
          isAvailable: true,
        }
      }
    },
  });

  // 3. Create a Hospital
  const hospital = await prisma.user.upsert({
    where: { email: 'hospital@example.com' },
    update: {},
    create: {
      name: 'Apollo Lifeline Hospital',
      email: 'hospital@example.com',
      password: passwordHash,
      phone: '1800112233',
      role: 'HOSPITAL',
      hospitalProfile: {
        create: {
          city: 'Mumbai',
          state: 'Maharashtra',
          isVerified: true,
        }
      }
    },
  });

  // 4. Create a Blood Bank
  const bloodBank = await prisma.user.upsert({
    where: { email: 'bloodbank@example.com' },
    update: {},
    create: {
      name: 'Red Cross Blood Bank',
      email: 'bloodbank@example.com',
      password: passwordHash,
      phone: '1800998877',
      role: 'BLOOD_BANK',
      bloodBankProfile: {
        create: {
          city: 'Mumbai',
          state: 'Maharashtra',
          inventory: {
            create: [
              { bloodGroup: 'O_POS', units: 45 },
              { bloodGroup: 'A_POS', units: 30 },
              { bloodGroup: 'B_POS', units: 25 },
              { bloodGroup: 'AB_POS', units: 10 },
              { bloodGroup: 'O_NEG', units: 5 },
            ]
          }
        }
      }
    },
  });

  // 5. Create some mock Emergency Requests (from Hospital)
  await prisma.bloodRequest.deleteMany(); // Clear old requests for clean seed

  await prisma.bloodRequest.create({
    data: {
      patientName: 'Karan Singh',
      bloodGroup: 'O_NEG',
      units: 3,
      hospital: 'Apollo Lifeline Hospital',
      city: 'Mumbai',
      contactNumber: '1800112233',
      requiredBefore: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      description: 'Accident victim, critical condition. Need O- blood urgently.',
      status: 'PENDING',
      creatorId: hospital.id,
    }
  });

  await prisma.bloodRequest.create({
    data: {
      patientName: 'Priya Patel',
      bloodGroup: 'A_POS',
      units: 2,
      hospital: 'Lilavati Hospital',
      city: 'Mumbai',
      contactNumber: '9898989898',
      requiredBefore: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      description: 'Scheduled surgery for cardiac bypass.',
      status: 'PENDING',
      creatorId: hospital.id,
    }
  });

  console.log('Seeding complete! You can now log in with the following accounts:');
  console.log('USER: user@example.com / password123');
  console.log('DONOR: donor@example.com / password123');
  console.log('HOSPITAL: hospital@example.com / password123');
  console.log('BLOOD BANK: bloodbank@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
