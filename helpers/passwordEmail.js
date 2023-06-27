import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { genTokenPassword } from './jwt.js';

const passwordEmail=async (correo)=>{
  const token=await genTokenPassword(correo);

  const transporter=nodemailer.createTransport({
    service:'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
      user:process.env.NODEMAILER_USER_AUTH,
      pass:process.env.NODEMAILER_PASSWORD_AUTH
    }
  });
  
  const mailOptions={
    from:process.env.NODEMAILER_USER_AUTH,
    to:correo,
    subject:'Recuperar contraseña',
    html:`
    <html>
      <head>
        <style>
          .container {
            border-radius: 10px;
            box-shadow: 0 0 6px 0;
          }
          .container-color {
            display: flex;
            height: 100px;
            background-color: blueviolet;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            padding-left:10px;
          }
          .h2 {
            color: white;
            font-weight: bold;
          }
          .container-text {
            padding: 20px;
          }
          .button {
            border: 2px solid blueviolet;
            border-radius: 10px;
            padding: 5px;
            width: fit-content;
            background-color: blueviolet;
            color: white !important;
            text-decoration:none;
          }
          .button:hover {
            background-color: blue;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="container-color">
            <h2 class="h2">COSTAZUL TRAVEL</h2>
          </div>
          <div class="container-text">
            <h1 class="h1">Recuperar contraseña</h1>
            <p>Estás recibiendo este correo porque hiciste una solicitud de recuperación de la contraseña para tu cuenta.</p>
            <p>Si no realizaste esta solicitud, no se requiere ninguna acción. Este correo tiene una validez de 10 minutos, si se vence puede solicitar otro.</p>
            <a href='${process.env.CLIENT_URL}/reset/${token}' class="button">Recuperar contraseña</a>
          </div>
        </div>
      </body>
    </html>
    `
  }
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
}

export default passwordEmail;