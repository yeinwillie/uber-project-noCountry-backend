
import Router from 'express';
import { usersGet, usersGetById, usersPut, usersDelete } from '../controller/userController.js';
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js"
const router = Router();

router.get('/', usersGet);

router.post('/id', validateTokenMiddleware, usersGetById);

router.put('/:id', validateTokenMiddleware, usersPut);

router.delete('/:id', validateTokenMiddleware, usersDelete);

export default router;