const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const { UPLOADS_DIR } = require('../config');

const router = express.Router();

const MIME_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Extension is derived from the verified mimetype, never the client-supplied filename.
    cb(null, unique + MIME_EXT[file.mimetype]);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (MIME_EXT[file.mimetype]) cb(null, true);
    else cb(new Error('Images only'));
  }
});

router.post('/', auth, upload.array('images', 10), (req, res) => {
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});

module.exports = router;
