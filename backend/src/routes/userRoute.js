
import Router from 'express';
import {usersGet,usersGetById,usersPut,usersDelete} from '../controller/userController.js';

const router = Router();

router.get('/', usersGet);

router.post('/id', usersGetById);

router.put('/:id',usersPut);

router.delete('/:id',usersDelete);

export default router;