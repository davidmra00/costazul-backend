import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';
import cron from 'node-cron';
import db from './database/config.js';
import travelRouter from './routes/travelRouter.js';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import './middlewares/google.js';
import offerRouter from './routes/offerRouter.js';
import { cleanPhotoFiles } from './helpers/cleanPhotos.js';

const app=express();
dotenv.config();
db();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/uploads',express.static('uploads'));

app.use('/travel',travelRouter);
app.use('/offer',offerRouter);
app.use('/user',userRouter);
app.use('/auth',authRouter);

const PORT=process.env.PORT;

cron.schedule('0 0 * * *', () => {
  cleanPhotoFiles();
  console.log('La tarea programada se ha ejecutado a las 12 de la noche');
});

app.listen(PORT,()=>{
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});