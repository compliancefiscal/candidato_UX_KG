import request from 'supertest';
import app from '../app';
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
let testUserId: string;
let testEmployeeId: string;
let authToken: string;

beforeAll(async () => {
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: '$2b$10$dJfVaAEZlRheHA/xKoJBseT138oPmbuIqCiYjKsM3rwPpKF2Q0zMO' // hashed 'password123'
    }
  });
  testUserId = user.id;

  authToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: '24h' }
  );

  const employee = await prisma.employee.create({
    data: {
      name: 'Test Employee',
      address: 'Test Address, 123',
      neighborhood: 'Test Neighborhood',
      zipCode: '12345678',
      phone: '1234567890',
      salary: 5000,
      contractDate: new Date().toISOString(),
      role: 'QA',
      ownerId: testUserId
    }
  });
  testEmployeeId = employee.id;
});

afterAll(async () => {
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Employee API', () => {
  describe('GET /api/employees', () => {
    it('should return employees list for authenticated user', async () => {
      const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app).get('/api/employees');
      expect(res.status).toBe(401);
    });

    it('should filter employees by name', async () => {
      const res = await request(app)
        .get('/api/employees?name=Test')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toContain('Test');
    });

    it('should filter employees by role', async () => {
      const res = await request(app)
        .get('/api/employees?role=QA')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].role).toBe('QA');
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return a specific employee', async () => {
      const res = await request(app)
        .get(`/api/employees/${testEmployeeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(testEmployeeId);
      expect(res.body.name).toBe('Test Employee');
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app)
        .get('/api/employees/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const newEmployee = {
        name: 'New Employee',
        address: 'New Address, 456',
        neighborhood: 'New Neighborhood',
        zipCode: '87654321',
        phone: '9876543210',
        salary: 6000,
        contractDate: new Date().toISOString(),
        role: 'Developer'
      };

      const res = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEmployee);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe(newEmployee.name);
      expect(res.body.address).toBe(newEmployee.address);
      expect(res.body.salary).toBe(newEmployee.salary.toString());
      expect(res.body.ownerId).toBe(testUserId);

      expect(res.body.phone).toBe('9876543210');
      expect(res.body.zipCode).toBe('87654321');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update an existing employee', async () => {
      const updatedData = {
        name: 'Updated Employee',
        salary: 7000
      };

      const res = await request(app)
        .put(`/api/employees/${testEmployeeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(updatedData.name);
      expect(res.body.salary).toBe(updatedData.salary.toString());
      expect(res.body.address).toBe('Test Address, 123');
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app)
        .put('/api/employees/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete an employee', async () => {
      const newEmployee = {
        name: 'Employee to Delete',
        address: 'Delete Address, 789',
        salary: 4000,
        contractDate: new Date().toISOString(),
        role: 'Manager'
      };

      const createRes = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEmployee);

      const employeeId = createRes.body.id;

      const deleteRes = await request(app)
        .delete(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteRes.status).toBe(204);

      const getRes = await request(app)
        .get(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app)
        .delete('/api/employees/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });
});
