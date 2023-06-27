import {Schema,model} from 'mongoose';

const UserSchema=new Schema({
  nombre:{
    type:String,
    required:true
  },
  correo:{
    type:String,
    required:true,
    unique:true
  },
  verificado:{
    type:Boolean,
    default:false
  },
  contrasenna:{
    type:String
  },
  admin:{
    type:Boolean,
    default:false
  },
  fotoUrl:{
    type:String,
  },
  telefono:{
    type:Number,
  }
});

export default model('User',UserSchema);