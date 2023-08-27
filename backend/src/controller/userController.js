import {response, request} from 'express'
import User from '../models/userModels.js'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
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
    }
    res.send(payload);
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
*/
const usersPut = async(req, res) =>{
    try {
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
      } catch (error) {
        res.status(400).json({ error: 'Usuario no encontrado' });
      }
}

const usersDelete = async(req, res) =>{

    try {
        const deletedUser = await userModel.findByIdAndRemove(req.params.id);
        res.json(deletedUser);
      } catch (error) {
        res.status(400).json({ error: 'No se pudo eliminar' });
      }
}

export {
    usersGet,
    usersGetById,
    usersPut,
    usersDelete,
}



