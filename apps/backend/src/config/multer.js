// apps/backend/src/config/multer.js
// File upload configuration using multer.
// Private authenticated endpoint — never public URL.

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const env = require('./env');

// Ensure upload directory exists
if (!fs.existsSync(env.UPLOAD_DIR)) {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

/**
 * Allowed MIME types for business permission documents.
 * Extension allow-list — never trust client Content-Type alone.
 */
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.resolve(env.UPLOAD_DIR);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const stored = `${uuidv4()}${ext}`;
    cb(null, stored);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    cb(new Error(`Faayiliin ${ext} eeyyamamaa miti. Faayila PDF, JPG, PNG, ykn WEBP ergi.`));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});

module.exports = { upload, ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS };
