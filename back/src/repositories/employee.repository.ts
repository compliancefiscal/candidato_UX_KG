import { PrismaClient, Employee } from '../generated/prisma';
const prisma = new PrismaClient();

export const employeeRepo = {
  findAll: (ownerId: string) => prisma.employee.findMany({
    where: { ownerId }
  }),

  findById: (id: string, ownerId: string) => prisma.employee.findFirst({
    where: {
      id,
      ownerId
    }
  }),

  findByName: (name: string, ownerId: string) => prisma.employee.findMany({
    where: {
      name: { contains: name },
      ownerId
    }
  }),

  findByNameAndRole: (name: string, role: string, ownerId: string) =>
    prisma.employee.findMany({
      where: {
        name: { contains: name },
        role,
        ownerId
      }
    }),

  create: (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => prisma.employee.create({ data }),

  update: (id: string, data: Partial<Employee>, ownerId: string) =>
    prisma.employee.updateMany({
      where: {
        id,
        ownerId
      },
      data 
    }).then(() => prisma.employee.findUnique({ where: { id } })),

  remove: (id: string, ownerId: string) =>
    prisma.employee.deleteMany({
      where: {
        id,
        ownerId
      }
    })
};
