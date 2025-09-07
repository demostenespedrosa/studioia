import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';
import { pool } from '../storage/db.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageDir = path.join(__dirname, '../../storage');
const imagesDir = path.join(storageDir, 'images');
fs.mkdirSync(imagesDir, { recursive: true });

// List images of current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, filename, created_at FROM user_images WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
    const result = rows.map(r => ({ ...r, url: `/api/images/file/${r.filename}` }));
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao listar' });
  }
});

// Serve file
router.get('/file/:name', authMiddleware, async (req, res) => {
  try {
    const filename = req.params.name;
    // Verifica se a imagem pertence ao usuário
    const [rows] = await pool.query('SELECT id FROM user_images WHERE filename = ? AND user_id = ? LIMIT 1', [filename, req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Imagem não encontrada' });
    const filePath = path.join(imagesDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Arquivo ausente' });
    res.sendFile(filePath);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao carregar imagem' });
  }
});

// Save images
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { images } = req.body;
    if (!Array.isArray(images) || !images.length) return res.status(400).json({ error: 'Lista vazia' });
    console.log('[IMAGES][RECEIVED]', { count: images.length, sizes: images.map(i => i.length) });
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const b64 of images) {
        if (typeof b64 !== 'string' || b64.length < 100) {
          console.warn('Imagem base64 suspeita ignorada (muito curta)');
          continue;
        }
        const buffer = Buffer.from(b64, 'base64');
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2,10)}.png`;
        fs.writeFileSync(path.join(imagesDir, filename), buffer);
        await conn.query('INSERT INTO user_images (user_id, filename) VALUES (?, ?)', [req.user.id, filename]);
      }
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error('[IMAGES][ERROR]', e);
    res.status(500).json({ error: 'Erro ao salvar' });
  }
});

// Delete image
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT filename FROM user_images WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Não encontrado' });
    const filename = rows[0].filename;
    await pool.query('DELETE FROM user_images WHERE id = ? AND user_id = ?', [id, req.user.id]);
    const filePath = path.join(imagesDir, filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao excluir' });
  }
});

export default router;