import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users and employees...');

  const users = [];
  for (let i = 1; i <= 5; i++) {
    const hashedPassword = await bcrypt.hash(`password${i}`, 10);
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword
      }
    });
    users.push(user);
    console.log(`Created user: ${user.name} (${user.email})`);
  }

  const neighborhoods = ['Centro', 'Jardins', 'Pinheiros', 'Vila Madalena', 'Moema', 'Itaim', 'Brooklin', 'Morumbi'];
  const roles = ['Desenvolvedor', 'Designer', 'Gerente', 'Analista', 'QA', 'DevOps', 'Produto', 'Marketing'];
  const streets = ['Rua A', 'Avenida B', 'Rua C', 'Avenida D', 'Rua E', 'Avenida F', 'Rua G', 'Avenida H'];

  for (const user of users) {
    const employees = [];

    for (let i = 1; i <= 10; i++) {
      const employeeNumber = i;
      const randomNeighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      const randomStreet = streets[Math.floor(Math.random() * streets.length)];
      const randomHouseNumber = Math.floor(Math.random() * 1000) + 1;
      const randomSalary = (Math.floor(Math.random() * 10) + 3) * 1000; // Between 3000 and 12000

      const today = new Date();
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(today.getFullYear() - 5);
      const randomDate = new Date(
        fiveYearsAgo.getTime() + Math.random() * (today.getTime() - fiveYearsAgo.getTime())
      );

      const areaCode = Math.floor(Math.random() * 90) + 10; // 10-99
      const firstPart = Math.floor(Math.random() * 90000) + 10000; // 10000-99999
      const secondPart = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
      const phone = `${areaCode}${firstPart}${secondPart}`;

      const zipCode = `${Math.floor(Math.random() * 90000) + 10000}${Math.floor(Math.random() * 900) + 100}`;

      const employee = await prisma.employee.create({
        data: {
          name: `Employee ${employeeNumber} of ${user.name}`,
          address: `${randomStreet}, ${randomHouseNumber}`,
          neighborhood: randomNeighborhood,
          zipCode: zipCode,
          phone: phone,
          salary: randomSalary,
          contractDate: randomDate,
          role: randomRole,
          ownerId: user.id
        }
      });

      employees.push(employee);
    }

    console.log(`Created 10 employees for user: ${user.name}`);
  }

  console.log('Seed completed successfully.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
