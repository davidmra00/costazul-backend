import jwt from 'jsonwebtoken';

export const tokenValidator=(req,res,next)=>{
    const token=req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok:false,
            msg:'No exite token'
        });
    }

    try {
        const payload=jwt.verify(
            token,
            process.env.JWT_SEED
        );

        req.uid=payload.uid;
        req.nombre=payload.nombre;
        req.admin=payload.admin
		req.verificado=payload.verificado
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok:false,
            msg:'token no valido'
        });
    }

    next();
}