import Router from 'express';
import { login } from '../controller/loginController.js';
import { registerUser, emailVerification, registerLogin } from "../controller/registerController.js"

const router = Router();

router.post('/login', login);
router.post('/register', registerUser);
router.patch('/emailVerification', emailVerification);
router.post('/registerLogin', registerLogin);


export default router;
