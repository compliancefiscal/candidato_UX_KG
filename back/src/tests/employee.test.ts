import request from 'supertest';
import app from '../app';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.employee.deleteMany();
  await prisma.employee.create({
    data: {
      name: 'Teste',
      address: 'Rua T, 1',
      salary: 1000,
      contractDate: new Date(),
      role: 'QA'
    }
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/employees', () => {
  it('should return employees list', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body.list).toBeInstanceOf(Array);
  });
});
