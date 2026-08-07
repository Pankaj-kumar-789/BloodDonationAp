import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
  await prisma.bloodInventory.deleteMany({});
  console.log("Wiped blood inventory to allow unique constraint creation.");
  process.exit(0);
}

main();
