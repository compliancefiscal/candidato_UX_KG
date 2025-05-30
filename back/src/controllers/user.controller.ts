import { Request, Response, NextFunction } from 'express';
import { userRepo } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email, and password are required' });
        return;
      }
      
      const existingUser = await userRepo.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }
      
      const user = await userRepo.create({ name, email, password });
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        user,
        token
      });
    } catch (err) { next(err); }
  }
  
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      
      const user = await userRepo.findByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      
      const isPasswordValid = await userRepo.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '24h' }
      );
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (err) { next(err); }
  }
  
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      
      const user = await userRepo.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json(user);
    } catch (err) { next(err); }
  }
}