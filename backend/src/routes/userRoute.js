
import Router from 'express';
import { usersGet, usersGetById, usersPut, usersDelete, recoverypassword,  changePassword} from '../controller/userController.js';
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js"
const router = Router();

router.get('/', usersGet);

router.post('/id', validateTokenMiddleware, usersGetById);


router.patch('/editarUsuario',validateTokenMiddleware,usersPut);

router.post('/recuperarPassword',recoverypassword);

router.post('/cambiarPassword',changePassword);

router.delete('/:id', validateTokenMiddleware, usersDelete);

export default router;