import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import { genToken } from '../helpers/jwt.js';
import verificationEmail from '../helpers/verificationEmail.js';

const getUsers=async (req,res)=>{
  try {
    const users=await User.find();
    delete users.contrasenna;

    res.json({
      ok:true,
      users
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      ok:false,
      msg:'Error al obtener los usuarios'
    });
  }
}

const createUser=async (req,res,next,register=false)=>{
  try {
    const {correo,contrasenna}=req.body;
    const emailVerified=await User.findOne({correo});
    if(emailVerified){
      return res.status(400).json({
        ok:false,
        msg:'Ya existe un usuario con ese correo'
      });
  }
  
  if(contrasenna.length<8){
	  return res.status(400).json({
		ok:false,
		msg:'La contrase�a debe tener al menos 8 caracteres'
	  });
	}

  const user=new User(req.body);
  const salt=bcrypt.genSaltSync();
  user.contrasenna=bcrypt.hashSync(contrasenna,salt);
  await user.save();
  
  const respuesta={
    ok:true,
    uid:user.id,
    nombre:user.nombre,
    admin:user.admin,
    verificado:true,
	fotoUrl:user.fotoUrl,
  }

  if(register){
    const token=await genToken(user.id,user.nombre,user.admin,user.verificado);
    verificationEmail(correo,user.id,user.nombre);
    respuesta.token=token;
    respuesta.verificado=false;
  }

  res.status(201).json(respuesta);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Error al crear el usuario'
    });
  }
}

const updateUser=async (req,res)=>{
  try{
    const {id}=req.params;
	
    const user=await User.findById(id);
    if(!user){
      return res.status(404).json({
        ok:false,
        msg:"No existe un usuario con ese id"
      });
    }

    if(req.body.contrasenna){
      const {contrasenna}=req.body;
	  if(contrasenna.length<8){
	    return res.status(400).json({
		  ok:false,
		  msg:'La contrase�a debe tener al menos 8 caracteres'
		});
	  }
      const salt=bcrypt.genSaltSync();
      req.body.contrasenna=bcrypt.hashSync(contrasenna,salt);
    }

    const {nombre,contrasenna,admin,verificado,fotoUrl,telefono}=req.body;

    let userUpdated;

    if(!req.admin){
      if(id!==req.uid){
        return res.status(401).json({
          ok:false,
          msg:'No esta autorizado'
        });
      }
      userUpdated=await User.findByIdAndUpdate(id,{
        nombre,
        contrasenna,
        fotoUrl,
        telefono
      },{new:true});
    }else{
      userUpdated=await User.findByIdAndUpdate(id,{
        nombre,
        admin,
		verificado,
        contrasenna,
        fotoUrl,
        telefono
      },{new:true});
    }
	
	const token=await genToken(userUpdated.id,userUpdated.nombre,userUpdated.admin,userUpdated.verificado);

    res.json({
      ok:true,
      uid:id,
      nombre:userUpdated.nombre,
      admin:userUpdated.admin,
      verificado:userUpdated.verificado,
	  fotoUrl:userUpdated.fotoUrl,
	  token
    });
  }catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Error al actualizar el usuario'
    });
  }
}

const deleteUser=async (req,res)=>{
  try{
    const {id}=req.params;
    const user=await User.findById(id);
    if(!user){
      return res.status(404).json({
        ok:false,
        msg:"No existe un usuario con ese id"
      });
    }
	
	let userUpdated;

    if(!req.admin){
      if(id!==req.uid){
        return res.status(401).json({
          ok:false,
          msg:'No esta autorizado'
        });
      }
      const userDeleted=await User.findByIdAndDelete(id);
    }else{
      const userDeleted=await User.findByIdAndDelete(id);
    }
  
    res.json({
      ok:true,
    });
  }catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Error al eliminar el usuario'
    });
  }
}

const uploadProfilePicture=(req,res)=>{
  try {
    const url=req.protocol+'://'+req.get('host')+'/uploads/profiles/'+req.file.filename;
    
    res.json({
      ok:true,
      url
    }); 
  } catch (error) {
    console.log(error);
    res.status(401).json({
      ok:false,
      msg:'Error al subir la imagen'
    });
  }
}

export {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadProfilePicture
}