import { PrismaClient, Employee } from '../generated/prisma';
const prisma = new PrismaClient();

export const employeeRepo = {
  findAll: () => prisma.employee.findMany(),
  findById: (id: string) => prisma.employee.findUnique({ where: { id } }),
  findByName: (name: string) => prisma.employee.findMany({ where: { name: { contains: name } } }),
  findByNameAndRole: (name: string, role: string) =>
    prisma.employee.findMany({ where: { name: { contains: name }, role } }),
  create: (data: Omit<Employee, 'id'>) => prisma.employee.create({ data }),
  update: (id: string, data: Partial<Employee>) =>
    prisma.employee.update({ where: { id }, data }),
  remove: (id: string) => prisma.employee.delete({ where: { id } })
};
