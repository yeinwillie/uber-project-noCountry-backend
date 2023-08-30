import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const secretKey = process.env.TOKEN_SECRET;

function decodeToken(token) {
  if (!token) {
    return { error: 'Token no proporcionado' };
  } 

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;
    return { userId };
  } catch (error) {
    return { error: 'Token inválido' };
  }
}

export default decodeToken;
  

