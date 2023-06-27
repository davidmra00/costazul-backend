
const adminValidator=(req,res,next)=>{
  const admin=req.admin;

  if(!admin){
    return res.status(401).json({
      ok:false,
      msg:'No tiene permiso para acceder a esta accion'
    });
  }

  next();
}

export default adminValidator;