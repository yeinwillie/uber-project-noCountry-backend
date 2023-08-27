import Router from 'express';
import {
  registerUser,
  emailVerification,
  registerLogin,
} from '../controller/registerController.js';

const router = Router();

router.post('/api/register', registerUser);
router.patch('/api/emailVerification', emailVerification);
router.post('/api/registerLogin', registerLogin);

export default router;
