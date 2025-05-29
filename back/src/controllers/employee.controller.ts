import { Request, Response, NextFunction } from 'express';
import { employeeRepo } from '../repositories/employee.repository';

export class EmployeeController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, role } = req.query;
      let result;
      if (name && role) {
        result = await employeeRepo.findByNameAndRole(String(name), String(role));
      } else if (name) {
        result = await employeeRepo.findByName(String(name));
      } else {
        result = await employeeRepo.findAll();
      }
      res.json({ list: result });
    } catch (err) { next(err); }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await employeeRepo.findById(req.params.id);
      if (!employee) {
        res.status(404).json({ error: 'Not found' });
        return
      }
      
      res.json(employee);
    } catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newEmployee = await employeeRepo.create(req.body);
      res.status(201).json(newEmployee);
    } catch (err) { next(err); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await employeeRepo.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) { next(err); }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await employeeRepo.remove(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
}
