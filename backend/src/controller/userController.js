import {response, request} from 'express'
import User from '../models/userModels.js'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import generateRandomPassword from '../utils/randomPassword.js';
import {google} from 'googleapis';
import nodemailer from 'nodemailer';

dotenv.config();
const userModel = User;
const secretKey = process.env.TOKEN_SECRET;

const usersGet = async(req = request, res = response) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
    }
}

const usersGetById = async(req, res) =>{
    
  const  token  = req.body.token;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;
    console.log(userId);
    const user = await User.findById(userId);
    const payload = {
      firstName : user.firstName,
      lastName : user.lastName,
      email : user.email,
      dateOfBirth: user.dateOfBirth,
      nationality: user.nationality,
      cellnumber: user.cellNumber,
    }
    const payloadWithNulls = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, value !== undefined ? value : null])
    );
    res.send(payloadWithNulls);
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

/*
const usersPost = async(req, res) =>{
    const {firstName, lastname,email,password,dni,cellnumber} = req.body;
    const user = new userModel ({firstName,lastname,email,password,dni,cellnumber})
    const salt = bcrypt.genSaltSync(10)
    user.password = bcrypt.hashSync(password, salt)
    await user.save()
    res.json(user);
}

const usersPut = async(req, res) =>{
    try {
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
      } catch (error) {
        res.status(400).json({ error: 'Usuario no encontrado' });
      }
}
*/
const usersPut = async (req, res) => {
  const  token  = req.body.token;
    if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
    }
  const decoded = jwt.verify(token, secretKey);
  console.log(decoded)
  const userId = decoded.id;
  const user = await User.findById(userId);
  console.log(user)
  // Si el usuario no esta registrado
  if (!user) {
    return res.status(404).send({ mensaje: "Usuario no encontrado" });
  }

  // verificar edad 

  const dateOfBirth = new Date(req.body.dateOfBirth);
  const currentDate = new Date();
  const userAge = currentDate.getFullYear() - dateOfBirth.getFullYear();

  // Si el usuario es menos de 18 años no se puede registrar
  if (userAge < 18) {
    return res.status(400).send({ mensaje: "Debes ser mayor de 18 años para registrarte." });
  }

  const userEdited = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    nationality: req.body.nationality,
    cellnumber: req.body.cellNumber,
  };
  
  try {
    
    
    const userPatch = await User.findOneAndUpdate({ _id:  userId}, userEdited);
    console.log(userPatch);
    res.status(200).send({ mensaje: "Usuario modificado con éxito", userEdited });
    
  } catch (error) {

    res.status(500).send({ mensaje: "Error al actualizar el usuario" });
  }
};

const usersDelete = async(req, res) =>{

    try {
        const deletedUser = await userModel.findByIdAndRemove(req.params.id);
        res.json(deletedUser);
      } catch (error) {
        res.status(400).json({ error: 'No se pudo eliminar' });
      }
}

const recoverypassword = async (req,res) => {
  try {

    // Verificando si el usuario existe

    const email = req.body.email;
    const existingUser = await User.findOne({email});
    if (!existingUser) {
      res.status(400).send({message:"Verifica tu correo electronico",});
    }

    
    // Creando nueva clave para el usuario (6 numero, 1 mayuscula y 1minuscula)

    const recovPassword = generateRandomPassword();
    

    
    // Hasheando la clave creada

    const salt = bcrypt.genSaltSync(10); //cantidad de saltos que da para encriptar, entre mas vuelta da es mas segura.
    const recovPasswordHash = bcrypt.hashSync(recovPassword, salt);

    console.log(recovPasswordHash);
    // Guardando la nueva clave en la base de datos
    existingUser.password = recovPasswordHash;
    existingUser.save();
    
    // enviar la clave por correo
    await sendrecoveryPasswordEmail(existingUser, recovPassword);

    // Se envia la respuesta positiva

    res.status(200).send({ mensaje: "Nueva contraseña enviada al correo del usuario"});

  } catch (error) {
    res.status(400).send({message:"Intento de recuperacion de contraseña invalido"})
  }
};

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

async function sendrecoveryPasswordEmail(existingUser, recovPassword) {
  const accessToken = await oAuth2client.getAccessToken();
  console.log(accessToken);
   const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "uberclonenocountry@gmail.com", // Reemplaza con tu dirección de Gmail
      clientId: CLIENT_ID, 
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  
  const mailOptions = {
      from: "uberclonenocountry@gmail.com", // Reemplaza con tu dirección de Gmail
      to: existingUser.email,
      subject: "Recuperacion de contraseña Urbanmove",
      html: `<a href="https://ibb.co/hgMML36"><img src="https://i.ibb.co/6yZZrjM/Imagen-Email.png" alt="Imagen-Email" border="0"/></a>, <p>Hola ${existingUser.firstName},</p> <p>Tu nueva contraseña es:${recovPassword}</p>,<p>Utiliza esta contraseña para ingresar al sitio <a href="
      https://urbanmove.vercel.app">aquí</a>.</p>, <p>¡Muchas Gracias! </p>,`

    };
  console.log("Enviando correo de recuperacion de contraseña..."); // para debuguear
 // console.log(registerToken+"a");
const result = await transporter.sendMail(mailOptions);

};
export {
    usersGet,
    usersGetById,
    usersPut,
    usersDelete,
    recoverypassword,
}



