import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

async function main() {
  await prisma.employee.createMany({
    data: [
      {
        name: 'Alice Silva',
        address: 'Rua A, 123',
        neighborhood: 'Centro',
        zipCode: '01001-000',
        phone: '11999990000',
        salary: 5000.00,
        contractDate: new Date('2025-01-15'),
        role: 'Desenvolvedor'
      },
    ]
  });
  console.log('Seed completed successfully.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
