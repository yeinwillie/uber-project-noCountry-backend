import User from '../models/userModels.js';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/jwt.js';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({
        email: 'El correo no está registrado.',
      });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        password: 'La contraseña es incorrecta.',
      });
    }

    const token = await createToken({
      id: userFound._id,
    });

    res.cookie('token', token, {
      httpOnly: process.env.NODE_ENV !== 'development',
      secure: true,
      sameSite: 'none',
    });

    res.status(200).send({ message: 'logged sucessfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
