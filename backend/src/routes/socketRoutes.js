import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get('/viajeConductor', (req, res) => {
  res.sendFile(__dirname + '/index.html');  // Ruta relativa al directorio actual del módulo
});

export default router;