import express from 'express';
import { getContacts, updateContact, uploadContactLog } from '../controllers/contactController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Setup multer for file upload handling
const uploadDir = 'uploads/';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    cb(null, sanitizedFileName);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept image files only
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only images are allowed.'), false);
//   }
      // Allow all file types
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for the file size
});

const router = express.Router();

// Contacts Routes
router.get('/', authenticateJWT, getContacts);
router.put('/:id', authenticateJWT, updateContact);
router.post('/:id/upload_log', authenticateJWT, upload.single('file'), uploadContactLog);// New route for file uploads

export default router;
