import express from 'express';
import { getContacts, updateContact } from '../controllers/contactController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Contacts Routes
router.get('/', authenticateJWT, getContacts);
router.put('/:id', authenticateJWT, updateContact);

export default router;
