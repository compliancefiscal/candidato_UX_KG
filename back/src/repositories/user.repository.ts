import { PrismaClient, User } from '../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const userRepo = {
  findAll: () => prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    }
  }),
  
  findById: (id: string) => prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    }
  }),
  
  findByEmail: (email: string) => prisma.user.findUnique({
    where: { email }
  }),
  
  create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  },
  
  update: async (id: string, data: Partial<User>) => {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  },
  
  remove: (id: string) => prisma.user.delete({ where: { id } }),
  
  verifyPassword: async (plainPassword: string, hashedPassword: string) => {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};