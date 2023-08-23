import Router from 'express';
import {registerUser, emailVerification} from '../controller/registerController.js';

const router = Router();

router.post('/api/register', registerUser );
router.patch('/api/emailVerification', emailVerification );

export default router; 