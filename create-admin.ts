import { prisma } from './src/lib/prisma';
import { hashPassword } from './src/lib/hash';

async function main() {
  const hashedPassword = hashPassword('admin123');

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

  console.log('Admin user created/updated successfully:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
