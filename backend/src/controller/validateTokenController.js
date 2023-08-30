import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModels.js';

dotenv.config();
const secretKey = process.env.TOKEN_SECRET;

export const validateTokenController = (req, res) => {
  const { token } = req.body

  if (!token) return res.send(false);

  jwt.verify(token, secretKey, async (error, user) => {

    if (error) return res.status(400).json({ message: "no se pudo autenticar" })

    const userFound = await User.findById(user.id);

    if (!userFound) return res.sendStatus(401);

    res.status(200).json({ message: "autenticado con exito" })
  });
};
