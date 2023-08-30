import Router from 'express';
import { PayCard } from '../controller/paymentsController.js';
import { validateTokenMiddleware } from '../middlewares/validateTokenMiddleware.js';
const router = Router();

router.post('/', validateTokenMiddleware, PayCard);
// router.post('/:id', PayCardExit );

export default router;
