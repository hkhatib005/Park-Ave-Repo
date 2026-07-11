const express = require('express');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  const { category, min_price, max_price, material, featured, search, limit = 50, offset = 0 } = req.query;

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) { query += ' AND category = ?'; params.push(category); }
  if (min_price) { query += ' AND price >= ?'; params.push(Number(min_price)); }
  if (max_price) { query += ' AND price <= ?'; params.push(Number(max_price)); }
  if (material) { query += ' AND material = ?'; params.push(material); }
  if (featured === '1') { query += ' AND featured = 1'; }
  if (search) { query += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  const products = db.prepare(query).all(...params);
  const parsed = products.map(p => ({ ...p, images: JSON.parse(p.images || '[]') }));
  res.json(parsed);
});

router.get('/categories', (req, res) => {
  const rows = db.prepare('SELECT category, COUNT(*) as count FROM products GROUP BY category').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ ...product, images: JSON.parse(product.images || '[]') });
});

// Admin routes
router.post('/', auth, (req, res) => {
  const { name, description, price, compare_price, category, material, images, featured, in_stock, stock_qty, sku } = req.body;
  if (!name || !category) return res.status(400).json({ error: 'name, price, category required' });
  if (!(Number(price) > 0)) return res.status(400).json({ error: 'price must be a positive number' });

  const result = db.prepare(`
    INSERT INTO products (name, description, price, compare_price, category, material, images, featured, in_stock, stock_qty, sku)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, description, price, compare_price || null, category, material, JSON.stringify(images || []), featured ? 1 : 0, in_stock !== false ? 1 : 0, stock_qty || 10, sku || null);

  res.status(201).json({ id: result.lastInsertRowid, message: 'Product created' });
});

router.put('/:id', auth, (req, res) => {
  const { name, description, price, compare_price, category, material, images, featured, in_stock, stock_qty, sku } = req.body;
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  if (!(Number(price) > 0)) return res.status(400).json({ error: 'price must be a positive number' });

  db.prepare(`
    UPDATE products SET name=?, description=?, price=?, compare_price=?, category=?, material=?, images=?, featured=?, in_stock=?, stock_qty=?, sku=?
    WHERE id=?
  `).run(name, description, price, compare_price || null, category, material, JSON.stringify(images || []), featured ? 1 : 0, in_stock !== false ? 1 : 0, stock_qty || 10, sku || null, req.params.id);

  res.json({ message: 'Product updated' });
});

router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
