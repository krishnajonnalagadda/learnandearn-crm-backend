import express from 'express';
import { body, validationResult } from 'express-validator';
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

// Login Route with Validation
router.post('/', [
  body('username').isString().notEmpty().withMessage('Username is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, loginUser);

export default router;
