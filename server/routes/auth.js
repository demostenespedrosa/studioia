import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../storage/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const TOKEN_EXP = '2h';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash]);

    return res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro interno' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    const [rows] = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: TOKEN_EXP });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ user: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
