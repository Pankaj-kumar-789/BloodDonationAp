const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ where: { role: 'BLOOD_BANK' }});
  console.log('BLOOD BANK USERS:', users.length);
  for (const u of users) {
    console.log(u.id, u.name, u.email);
  }
  
  const banks = await prisma.bloodBankProfile.findMany({ include: { user: true }});
  console.log('BLOOD BANK PROFILES:', banks.length);
  for (const b of banks) {
    console.log('Profile ID:', b.id, 'User:', b.user?.name, 'isVerified:', b.isVerified);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
