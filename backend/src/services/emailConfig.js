import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
import {google} from 'googleapis';

// Send email verification code
// Gmail API needed Credentials and oAuth
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI, 
);

oAuth2client.setCredentials({ refresh_token: REFRESH_TOKEN });


export async function sendVerificationEmail(user, verificationCode) {
  try {
    const accessToken = await oAuth2client.getAccessToken();
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "uberclonenocountry@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    
    const mailOptions = {
      from: "uberclonenocountry@gmail.com", // Replace with your Gmail address
        to: user.email,  
        subject: "noreply",
        html: `
        <a href="https://ibb.co/hgMML36"><img src="https://i.ibb.co/6yZZrjM/Imagen-Email.png" alt="Imagen-Email" border="0"></a>,
        <p>Wellcome to Uber,        
        </p><p>Por favor, usa el codigo ${verificationCode} para verificar tu correo electrónico:</p>
        `, 
    };

    console.log("Enviando correo de verificación...");
    
 
    const result = await transporter.sendMail(mailOptions);
    
  } catch (error) {
    return res.status(500).json({ error: 'Error send email' });
  }
};

