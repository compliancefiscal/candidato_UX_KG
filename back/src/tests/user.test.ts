import request from 'supertest';
import app from '../app';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
let testUserId: string;
let authToken: string;

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('User API', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/users/register')
        .send(newUser);
      
      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.name).toBe(newUser.name);
      expect(res.body.user.email).toBe(newUser.email);
      expect(res.body.user.password).toBeUndefined(); // Password should not be returned
      expect(res.body.token).toBeDefined();

      testUserId = res.body.user.id;
      authToken = res.body.token;
    });

    it('should not register a user with an existing email', async () => {
      const duplicateUser = {
        name: 'Another User',
        email: 'test@example.com',
        password: 'anotherpassword'
      };

      const res = await request(app)
        .post('/api/users/register')
        .send(duplicateUser);
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should not register a user with missing required fields', async () => {
      const invalidUser = {
        name: 'Invalid User'
      };

      const res = await request(app)
        .post('/api/users/register')
        .send(invalidUser);
      
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    it('should login an existing user', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/users/login')
        .send(credentials);
      
      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(credentials.email);
      expect(res.body.token).toBeDefined();
    });

    it('should not login with incorrect password', async () => {
      const invalidCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const res = await request(app)
        .post('/api/users/login')
        .send(invalidCredentials);
      
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('should not login with non-existent email', async () => {
      const nonExistentUser = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/users/login')
        .send(nonExistentUser);
      
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/users/profile', () => {
    it('should get the user profile when authenticated', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(testUserId);
      expect(res.body.name).toBe('Test User');
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.password).toBeUndefined();
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(res.status).toBe(401);
    });
  });

  describe('Edge cases', () => {
    it('should handle malformed JSON in request body', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .set('Content-Type', 'application/json')
        .send('{"name": "Malformed JSON"');
      
      expect(res.status).toBe(400);
    });

    it('should validate email format', async () => {
      const invalidEmail = {
        name: 'Invalid Email User',
        email: 'not-an-email',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/users/register')
        .send(invalidEmail);
      
      expect(res.status).toBe(400);
    });

    it('should require minimum password length', async () => {
      const shortPassword = {
        name: 'Short Password User',
        email: 'short@example.com',
        password: '123'
      };

      const res = await request(app)
        .post('/api/users/register')
        .send(shortPassword);
      
      expect(res.status).toBe(400);
    });
  });
});