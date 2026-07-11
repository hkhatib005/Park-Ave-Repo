const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// DB_PATH lets the database live on a mounted persistent disk in production
// (e.g. Render's ephemeral filesystem wipes local files on every redeploy).
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'park_ave.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    compare_price REAL,
    category TEXT NOT NULL,
    material TEXT,
    images TEXT DEFAULT '[]',
    featured INTEGER DEFAULT 0,
    in_stock INTEGER DEFAULT 1,
    stock_qty INTEGER DEFAULT 10,
    sku TEXT UNIQUE,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT,
    google_id TEXT UNIQUE,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    items TEXT NOT NULL,
    subtotal REAL NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'unpaid',
    payment_method TEXT,
    stripe_session_id TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Migrate columns for databases created before this revision
const orderCols = db.prepare("PRAGMA table_info(orders)").all().map(c => c.name);
if (!orderCols.includes('customer_id')) db.exec('ALTER TABLE orders ADD COLUMN customer_id INTEGER REFERENCES customers(id)');
if (!orderCols.includes('payment_status')) db.exec("ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'unpaid'");
if (!orderCols.includes('payment_method')) db.exec('ALTER TABLE orders ADD COLUMN payment_method TEXT');
if (!orderCols.includes('stripe_session_id')) db.exec('ALTER TABLE orders ADD COLUMN stripe_session_id TEXT');
const contactCols = db.prepare("PRAGMA table_info(contacts)").all().map(c => c.name);
if (!contactCols.includes('read')) db.exec('ALTER TABLE contacts ADD COLUMN read INTEGER DEFAULT 0');

// Seed admin — credentials come from env, never hardcoded/displayed in the app.
// If ADMIN_PASSWORD isn't set, generate one and print it once to the server console.
const adminEmail = (process.env.ADMIN_EMAIL || 'admin@parkavejewelers.com').trim().toLowerCase();
const existingAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get(adminEmail);
if (!existingAdmin) {
  const password = process.env.ADMIN_PASSWORD?.trim() || crypto.randomBytes(9).toString('base64url');
  const hash = bcrypt.hashSync(password, 12);
  db.prepare('INSERT INTO admins (email, password) VALUES (?, ?)').run(adminEmail, hash);
  console.log('='.repeat(60));
  console.log('Admin account created — save these credentials now:');
  console.log(`  email:    ${adminEmail}`);
  if (!process.env.ADMIN_PASSWORD) console.log(`  password: ${password}  (set ADMIN_PASSWORD in .env to control this)`);
  console.log('='.repeat(60));
}

// Seed sample products
const productCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
if (productCount === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, description, price, compare_price, category, material, images, featured, sku)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    ['Diamond Solitaire Ring', 'A timeless 1.2ct round brilliant diamond set in 18k white gold. GIA certified, VS1 clarity, F color.', 4850, 5500, 'Rings', '18k White Gold', '[]', 1, 'PAJ-R001'],
    ['Sapphire Halo Ring', 'Stunning 2ct Ceylon sapphire surrounded by 0.5ct of pavé diamonds in platinum.', 6200, null, 'Rings', 'Platinum', '[]', 1, 'PAJ-R002'],
    ['Emerald Cut Diamond Ring', 'Art Deco inspired emerald cut 1.8ct diamond in yellow gold with milgrain detail.', 7400, null, 'Rings', '18k Yellow Gold', '[]', 0, 'PAJ-R003'],
    ['Diamond Tennis Necklace', '3.5ct total weight brilliant diamonds set in 18k white gold. 16 inch length.', 8900, 9800, 'Necklaces', '18k White Gold', '[]', 1, 'PAJ-N001'],
    ['Gold Chain Necklace', 'Solid 18k yellow gold figaro chain, 20 inch. 5mm width. Lobster clasp.', 2200, null, 'Necklaces', '18k Yellow Gold', '[]', 0, 'PAJ-N002'],
    ['Pearl Strand Necklace', 'AAA Akoya cultured pearls, 7-7.5mm, 18 inch strand with 18k gold clasp.', 1800, 2100, 'Necklaces', '18k Yellow Gold', '[]', 1, 'PAJ-N003'],
    ['Diamond Stud Earrings', '1ct total weight round brilliant diamond studs in 18k white gold with screw backs.', 3200, 3800, 'Earrings', '18k White Gold', '[]', 1, 'PAJ-E001'],
    ['Gold Hoop Earrings', 'Classic 18k yellow gold hoops, 25mm diameter. Lightweight and elegant.', 980, null, 'Earrings', '18k Yellow Gold', '[]', 0, 'PAJ-E002'],
    ['Emerald Drop Earrings', 'Pear-shaped Colombian emeralds with diamond halos, in 18k white gold.', 5400, null, 'Earrings', '18k White Gold', '[]', 1, 'PAJ-E003'],
    ['Diamond Bangle', 'Full eternity diamond bangle, 2ct total weight. 18k white gold. Hinged closure.', 6800, 7500, 'Bracelets', '18k White Gold', '[]', 1, 'PAJ-B001'],
    ['Gold Rope Bracelet', 'Hand-woven 18k yellow gold rope bracelet, 7 inch. 4mm width.', 1650, null, 'Bracelets', '18k Yellow Gold', '[]', 0, 'PAJ-B002'],
    ['Rolex Datejust 41', 'Pre-owned Rolex Datejust 41mm, oyster bracelet, white dial, box and papers.', 12500, 14000, 'Watches', 'Steel & 18k Gold', '[]', 1, 'PAJ-W001'],
    ['Cartier Santos', 'Pre-owned Cartier Santos Medium, stainless steel, silver dial, interchangeable bracelet.', 7800, null, 'Watches', 'Stainless Steel', '[]', 1, 'PAJ-W002'],
    ['Audemars Piguet Royal Oak', 'Pre-owned AP Royal Oak 37mm, stainless steel, blue tapisserie dial.', 28000, 32000, 'Watches', 'Stainless Steel', '[]', 1, 'PAJ-W003'],
    ['Diamond Pendant', '0.75ct princess cut diamond pendant in 18k white gold with 18in chain.', 2400, null, 'Pendants', '18k White Gold', '[]', 0, 'PAJ-P001'],
    ['Evil Eye Pendant', '18k gold evil eye pendant with blue sapphires and white diamonds.', 1200, 1400, 'Pendants', '18k Yellow Gold', '[]', 1, 'PAJ-P002'],
  ];

  for (const p of products) insert.run(...p);
  console.log(`Seeded ${products.length} products`);
}

module.exports = db;
