import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import imagesRouter from './routes/images.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config({ path: '.env.local' });

const app = express();

app.use(cors({ origin: true, credentials: true }));
// Aumentamos o limite pois 4 imagens base64 podem ultrapassar 2MB
const jsonLimit = process.env.JSON_LIMIT || '25mb';
app.use(express.json({ limit: jsonLimit }));
app.use(cookieParser());

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/images', imagesRouter);

// Exemplo de rota protegida base para futuros serviços
app.get('/api/protegido', authMiddleware, (req, res) => {
  res.json({ message: 'Autenticado', user: req.user });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
