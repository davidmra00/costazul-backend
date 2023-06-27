import {Router} from 'express';
import {check} from 'express-validator';
import multer from 'multer';
import path from 'path';
import { createUser, deleteUser, getUsers, updateUser, uploadProfilePicture } from '../controllers/userController.js';
import { fieldValidator } from '../middlewares/fieldValidator.js';
import adminValidator from '../middlewares/adminValidator.js';
import { tokenValidator } from '../middlewares/tokenValidator.js';

const userRouter=Router();

const storage=multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'uploads/profiles/');
  },
  filename: function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
  }
});

const upload=multer({storage:storage});

userRouter.use(tokenValidator);

userRouter.put('/:id',[
  check('nombre','El campo nombre es obligatorio').notEmpty(),
  fieldValidator
],updateUser);

userRouter.post('/upload/profiles',upload.single('file'),uploadProfilePicture);

userRouter.delete('/:id',deleteUser);

userRouter.use(adminValidator);

userRouter.get('/',getUsers);

userRouter.post('/',[
  check('nombre','El campo nombre es obligatorio').notEmpty(),
  check('correo','El campo correo es obligatorio').isEmail(),
  fieldValidator
],createUser);

export default userRouter;