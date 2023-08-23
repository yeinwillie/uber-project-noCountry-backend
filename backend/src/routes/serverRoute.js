import Router from 'express';
import server from '../controller/serverController.js';

const router = Router();

router.get('/', server );

 
export default router;