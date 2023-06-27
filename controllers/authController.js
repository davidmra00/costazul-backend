import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { genToken } from '../helpers/jwt.js';
import { createUser } from './userController.js';
import verificationEmail from '../helpers/verificationEmail.js';
import passwordEmail from '../helpers/passwordEmail.js';

const register=async  (req,res,next)=>{
  createUser(req,res,next,true);
}

const login=async  (req,res)=>{
  const {correo,contrasenna}=req.body;

    try {
        const user=await User.findOne({correo});
        if(!user){
            return res.status(400).json({
                ok:false,
                msg:'No existe ese email'
            });
        }

        const passwordVerified=bcrypt.compareSync(contrasenna,user.contrasenna);
        if(!passwordVerified){
            return res.status(400).json({
                ok:false,
                msg:'Contrasena incorrecta'
            });
        }
        const token=await genToken(user.id,user.nombre,user.admin,user.verificado);

        res.json({
            ok:true,
            uid:user.id,
            nombre:user.nombre,
            admin:user.admin,
            verificado:user.verificado,
			fotoUrl:user.fotoUrl,
            token
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error al entrar'
        });
    }
}

const renewalToken=async  (req,res)=>{
  const uid=req.uid;
  const nombre=req.nombre;
  const admin=req.admin;
  const verificado=req.verificado;
  
  const user=await User.findById(uid);
  
  const token=await genToken(uid,nombre,admin,user.verificado);

  res.json({
      ok:true,
      uid,
      nombre,
      admin,
      verificado:user.verificado,
	  fotoUrl:user.fotoUrl,
      token
  });
}

const loginOrRegisterWithGoogle=async (req,res)=>{
    try {
        const {nombre,correo}=req.body;
		
        const user=await User.findOne({correo});
        if(user){
            const token=await genToken(user.id,user.nombre,user.admin,user.verificado);

            res.json({
                ok:true,
                uid:user.id,
                nombre:user.nombre,
                admin:user.admin,
                verificado:user.verificado,
				fotoUrl:user.fotoUrl,
                token
            });  
        }else{
            const newUser=new User({correo,nombre});
            await newUser.save();

            const token=await genToken(newUser.id,newUser.nombre,newUser.admin);

            res.status(201).json({
                ok:true,
                uid:newUser.id,
                nombre:newUser.nombre,
                admin:newUser.admin,
                verificado:newUser.verificado,
				fotoUrl:newUser.fotoUrl,
                token
            });

            verificationEmail(correo,newUser.id,newUser.nombre);
		}
    } catch (error) {
        console.log(error)
    }
}

const verifiedAccount=async (req,res)=>{
    try{
        const {token}=req.params;

        const payload=jwt.verify(
            token,
            process.env.JWT_SEED
        );

        const id=payload.uid;

        const user=await User.findByIdAndUpdate(id,{verificado:true},{new:true});
		
		const newToken=await genToken(user.id,user.nombre,user.admin,user.verificado);

        res.json({
            ok:true,
			uid:id,
			nombre:user.nombre,
			admin:user.admin,
			verificado:user.verificado,
			fotoUrl:user.fotoUrl,
			token:newToken
        });
    }catch (error) {
        console.log(error);
        res.status(401).json({
            ok:false,
            msg:'Error al verificar la cuenta, por favor pida otro correo de verificacion'
        });
    }
}

const emailVerifiedSend=async (req,res)=>{
	try{
		const uid=req.uid;
		const nombre=req.nombre;
		const user=await User.findById(uid);
		
		verificationEmail(user.correo,uid,nombre);
		
		res.json({
            ok:true
        });
	}catch (error) {
		console.log(error);
		res.status(401).json({
            ok:false,
            msg:'Error al verificar la cuenta, inténtelo mas tarde'
		});
	}	
}

const passwordForget=async (req,res)=>{
    const {correo}=req.body;
    const user=await User.findOne({correo});

    if(!user){
        return res.status(404).json({
            ok:false,
            msg:'No existe una cuenta con este correo'
        });
    }

    passwordEmail(correo);

    res.json({
        ok:true,
        msg:'Revise su correo para cambiar la contrasenna'
    });
}

const passwordReset=async (req,res)=>{
    try{
        const {token}=req.params;

        let {contrasenna}=req.body;
        const salt=bcrypt.genSaltSync();
        contrasenna=bcrypt.hashSync(contrasenna,salt);
        
        const payload=jwt.verify(
            token,
            process.env.JWT_SEED
        );

        const {correo}=payload;

        const user=await User.findOne({correo})

        await User.findByIdAndUpdate(user.id,{contrasenna});

        res.json({
            ok:true
        });
    }catch (error) {
        console.log(error);
        res.status(401).json({
            ok:false,
            msg:'Error al cambiar la contrasenna'
        });
    }
}

export {
  register,
  login,
  renewalToken,
  loginOrRegisterWithGoogle,
  verifiedAccount,
  passwordForget,
  passwordReset,
  emailVerifiedSend
}