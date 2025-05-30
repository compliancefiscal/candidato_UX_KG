import express from 'express';
import cors from 'cors';
import employeeRouter from './routes/employee.routes';
import userRouter from './routes/user.routes';
import { errorHandler } from './middlewares/error.handler';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/employees', employeeRouter);

app.use(errorHandler);

export default app;
