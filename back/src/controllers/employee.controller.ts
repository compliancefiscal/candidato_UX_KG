import { Request, Response, NextFunction } from 'express';
import { employeeRepo } from '../repositories/employee.repository';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

export class EmployeeController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = (req as AuthenticatedRequest).user;
      const { name, role } = req.query;
      let result;

      if (name && role) {
        result = await employeeRepo.findByNameAndRole(String(name), String(role), userId);
      } else if (name) {
        result = await employeeRepo.findByName(String(name), userId);
      } else {
        result = await employeeRepo.findAll(userId);
      }

      res.json(result);
    } catch (err) { next(err); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = (req as AuthenticatedRequest).user;
      const employee = await employeeRepo.findById(req.params.id, userId);

      if (!employee) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }
      
      res.json(employee);
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = (req as AuthenticatedRequest).user;

      const employeeData = {
        ...req.body,
        ownerId: userId
      };

      const newEmployee = await employeeRepo.create(employeeData);
      res.status(201).json(newEmployee);
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = (req as AuthenticatedRequest).user;
      const updated = await employeeRepo.update(req.params.id, req.body, userId);

      if (!updated) {
        res.status(404).json({ error: 'Employee not found or you do not have permission to update it' });
        return;
      }

      res.json(updated);
    } catch (err) { next(err); }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = (req as AuthenticatedRequest).user;
      const result = await employeeRepo.remove(req.params.id, userId);

      if (result.count === 0) {
        res.status(404).json({ error: 'Employee not found or you do not have permission to delete it' });
        return;
      }

      res.status(204).send();
    } catch (err) { next(err); }
  }
}
