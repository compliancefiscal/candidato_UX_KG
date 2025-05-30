import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', EmployeeController.getAll);
router.get('/:id', EmployeeController.getById);
router.post('/', EmployeeController.create);
router.put('/:id', EmployeeController.update);
router.delete('/:id', EmployeeController.remove);

export default router;
