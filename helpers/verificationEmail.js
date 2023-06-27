import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { genTokenEmail } from './jwt.js';

dotenv.config();

const verificationEmail = async (correo, uid, nombre) => {
  const token = await genTokenEmail(uid, nombre);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER_AUTH,
      pass: process.env.NODEMAILER_PASSWORD_AUTH
    }
  });

  const mailOptions = {
    from: process.env.NODEMAILER_USER_AUTH,
    to: correo,
    subject: 'Correo de verificación',
    html: `
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
            <h2 class="h2">BIENVENIDO A COSTAZUL TRAVEL</h2>
          </div>
          <div class="container-text">
            <h1 class="h1">Verifica tu correo electrónico</h1>
            <p>Gracias por registarte en Costazul Travel. Por favor verifica tu correo para poder acceder a todas las funcionalidades de nuestra agencia de viajes.</p>
            <p>Haz click en el siguiente botón para verificar tu correo. Este correo tiene una validez de 10 minutos, si se vence puede solicitar otro.</p>
            <a href='${process.env.CLIENT_URL}/cuenta/email/${token}' class="button">Verificar correo</a>
          </div>
        </div>
      </body>
    </html>
  `
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
}

export default verificationEmail;