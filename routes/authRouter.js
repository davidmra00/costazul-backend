import {Router} from 'express';
import {check} from 'express-validator';
import passport from 'passport';
import { login, register, renewalToken,loginOrRegisterWithGoogle,verifiedAccount, passwordForget, passwordReset, emailVerifiedSend } from '../controllers/authController.js';
import { tokenValidator } from '../middlewares/tokenValidator.js';
import { fieldValidator } from '../middlewares/fieldValidator.js';

const authRouter=Router();

authRouter.post('/register',[
  check('nombre','El campo nombre es obligatorio').notEmpty(),
  check('correo','El campo correo es obligatorio').isEmail(),
  check('contrasenna','el campo contrasenna debe tener al menos 8 caracteres').isLength({min:8}),
  fieldValidator
],register);

authRouter.post('/login',[
  check('correo','El campo correo es obligatorio').isEmail(),
  check('contrasenna','el campo contrasenna debe tener al menos 8 caracteres').isLength({min:8}),
  fieldValidator
],login);

authRouter.get('/',tokenValidator,renewalToken);

authRouter.post('/google',[
	check('nombre','El campo nombre es obligatorio').notEmpty(),
	check('correo','El campo correo es obligatorio').isEmail(),
	fieldValidator
],loginOrRegisterWithGoogle);

authRouter.get('/email/:token',verifiedAccount);

authRouter.get('/email/',tokenValidator,emailVerifiedSend);

authRouter.post('/password',[
  check('correo','El campo correo es obligatorio').isEmail(),
  fieldValidator
],passwordForget);

authRouter.post('/reset/:token',[
  check('contrasenna','el campo contrasenna debe tener al menos 8 caracteres').isLength({min:8}),
  fieldValidator
],passwordReset);

export default authRouter;