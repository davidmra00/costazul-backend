import mongoose from 'mongoose';

const db=()=>{
  try {
    mongoose.connect(process.env.DB_HOST,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
    });

    console.log('db online');
  } catch (error) {
    console.log(error);
    throw new Error('Error al conectar con la db');
  }
}

export default db;