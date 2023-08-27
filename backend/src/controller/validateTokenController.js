import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.TOKEN_SECRET;

export const validateTokenController = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Llamada a next() después de la verificación exitosa del token
    next();

    // Mover esta línea después de next()
  });
};
