import {Router} from 'express';
import {check} from 'express-validator';
import multer from 'multer';
import path from 'path';
import { createOffer, deleteOffer, getOffers, updateOffer, uploadOfferPicture } from '../controllers/offerController.js';
import { fieldValidator } from '../middlewares/fieldValidator.js';
import adminValidator from '../middlewares/adminValidator.js';
import { tokenValidator } from '../middlewares/tokenValidator.js';

const offerRouter=Router();

const storage=multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'uploads/offers/');
  },
  filename: function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
  }
});

const upload=multer({storage:storage});

offerRouter.get('/',getOffers);

offerRouter.use(tokenValidator);
offerRouter.use(adminValidator);

offerRouter.post('/upload/offers',upload.single('file'),uploadOfferPicture);

offerRouter.post('/',[
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
],createOffer);

offerRouter.put('/:id',[
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
],updateOffer);

offerRouter.delete('/:id',deleteOffer);

export default offerRouter;