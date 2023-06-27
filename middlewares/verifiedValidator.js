
const verifiedValidator=(req,res,next)=>{
  const verificado=req.admin;

  if(!verificado){
    return res.status(401).json({
      ok:false,
      msg:'Verifique su cuenta para acceder a esta acción'
    });
  }

  next();
}

export default verifiedValidator;