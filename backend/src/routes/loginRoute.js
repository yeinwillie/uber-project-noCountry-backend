import Router from 'express';
import { login } from '../controller/loginController.js';

const router = Router();

router.post('/api/login', login);

export default router;
