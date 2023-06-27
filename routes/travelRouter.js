import {Router} from 'express';
import {check} from 'express-validator';
import multer from 'multer';
import path from 'path';
import { createTravel, deleteTravel, getTravels, updateTravel, uploadTravelPicture, travelReservationEmail } from '../controllers/travelController.js';
import { fieldValidator } from '../middlewares/fieldValidator.js';
import adminValidator from '../middlewares/adminValidator.js';
import verifiedValidator from '../middlewares/verifiedValidator.js';
import { tokenValidator } from '../middlewares/tokenValidator.js';

const travelRouter=Router();

const storage=multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'uploads/travels/');
  },
  filename: function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
  }
});

const upload=multer({storage:storage});

travelRouter.get('/',getTravels);

travelRouter.use(tokenValidator);

travelRouter.post('/email',[
  check('personas','El campo personas es obligatorio').not().isEmpty(),
  check('destino','El campo destino es obligatorio').not().isEmpty(),
  check('precio','El campo precio es obligatorio').not().isEmpty(),
  check('nombre','El campo nombre es obligatorio').not().isEmpty(),
  check('correo','El campo correo es obligatorio').isEmail(),
  fieldValidator,
  verifiedValidator
],travelReservationEmail);

travelRouter.use(adminValidator);

travelRouter.post('/upload/travels',upload.single('file'),uploadTravelPicture);

travelRouter.post('/',[
  check('lugar','El campo lugar es obligatorio').not().isEmpty(),
  check('descripcion','El campo descripcion es obligatorio').not().isEmpty(),
  check('precio','El campo precio es obligatorio').not().isEmpty().isNumeric(),
  check('disponibilidad','El campo disponibilidad es obligatorio').isBoolean(),
  check('fechaInicio','El campo fecha inicio es obligatorio').isDate(),
  check('fechaFin','El campo fecha fin es obligatorio').isDate(),
  check('fotoUrl','El campo foto es obligatorio').notEmpty(),
  check('incluye','El campo incluye es obligatorio').notEmpty(),
  check('noIncluye','El campo no incluye es obligatorio').notEmpty(),
  fieldValidator
],createTravel);

travelRouter.put('/:id',[
  check('lugar','El campo lugar es obligatorio').not().isEmpty(),
  check('descripcion','El campo descripcion es obligatorio').not().isEmpty(),
  check('precio','El campo precio es obligatorio').not().isEmpty().isNumeric(),
  check('disponibilidad','El campo disponibilidad es obligatorio').isBoolean(),
  check('fechaInicio','El campo fecha inicio es obligatorio').isDate(),
  check('fechaFin','El campo fecha fin es obligatorio').isDate(),
  check('fotoUrl','El campo foto es obligatorio').notEmpty(),
  check('incluye','El campo incluye es obligatorio').notEmpty(),
  check('noIncluye','El campo no incluye es obligatorio').notEmpty(),
  fieldValidator
],updateTravel);

travelRouter.delete('/:id',deleteTravel);

export default travelRouter;