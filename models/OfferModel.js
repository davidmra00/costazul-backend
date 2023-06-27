import {Schema,model} from 'mongoose';

const OfferSchema=new Schema({
  lugar:{
    type:String,
    required:true,
  },
  descripcion:{
    type:String,
    required:true,
  },
  fotoUrl:{
    type:Array,
    required:true,
  },
  precio:{
    type:Number,
    required:true
  },
  disponibilidad:{
    type:Boolean,
    required:true
  },
  fechaInicio:{
    type:Date,
    required:true
  },
  fechaFin:{
    type:Date,
    required:true
  },
  incluye:{
    type:Array,
    required:true
  },
  noIncluye:{
    type:Array,
    required:true
  }
});

export default model('Offer',OfferSchema);