import jwt from 'jsonwebtoken';

export const genToken=(uid,nombre,admin,verificado)=>{
    return new Promise((resolve,reject)=>{
        const payload={uid,nombre,admin,verificado};
        jwt.sign(payload,process.env.JWT_SEED,{
            expiresIn:'2h'
        },(err,token)=>{
            if(err){
                console.log(err);
                reject('Error al generar el token');
            }

            resolve(token);
        });
    });
}

export const genTokenEmail=(uid,nombre)=>{
    return new Promise((resolve,reject)=>{
        const payload={uid,nombre};
        jwt.sign(payload,process.env.JWT_SEED,{
            expiresIn:'10m'
        },(err,token)=>{
            if(err){
                console.log(err);
                reject('Error al generar el token');
            }

            resolve(token);
        });
    });
}

export const genTokenPassword=(correo)=>{
    return new Promise((resolve,reject)=>{
        const payload={correo};
        jwt.sign(payload,process.env.JWT_SEED,{
            expiresIn:'10m'
        },(err,token)=>{
            if(err){
                console.log(err);
                reject('Error al generar el token');
            }

            resolve(token);
        });
    });
}