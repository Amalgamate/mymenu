import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../../uploads/menu-items'),
    path.join(__dirname, '../../uploads/logos'),
    path.join(__dirname, '../../uploads/qr-codes'),
    path.join(__dirname, '../../uploads/bulk')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureUploadDirs();

// Storage configuration for menu item images
const menuItemStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/menu-items'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for logos
const logoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/logos'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const imageFileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

// File size limits
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880');
const MAX_BULK_FILE_SIZE = parseInt(process.env.MAX_BULK_FILE_SIZE || '10485760'); // 10MB default

// Multer upload instances
export const uploadMenuItemImage = multer({
  storage: menuItemStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

export const uploadLogo = multer({
  storage: logoStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

// Storage for bulk CSV uploads
const bulkStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/bulk'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for CSV only
const csvFileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['text/csv', 'application/vnd.ms-excel'];

  if (allowedMimes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV files are allowed.'));
  }
};

export const uploadBulkCsv = multer({
  storage: bulkStorage,
  fileFilter: csvFileFilter,
  limits: { fileSize: MAX_BULK_FILE_SIZE }
});
