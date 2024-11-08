import express from 'express';
import { body, validationResult } from 'express-validator';
import { loginUser } from '../controllers/authController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate Limiter for Login Route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many login attempts. Please try again after 15 minutes.',
});

// Async Error Handler Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation Middleware
const validationMiddleware = [
  body('username').isString().notEmpty().withMessage('Username is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const groupedErrors = errors.array().reduce((acc, err) => {
        acc[err.param] = acc[err.param] || [];
        acc[err.param].push(err.msg);
        return acc;
      }, {});
      return res.status(400).json({ errors: groupedErrors });
    }
    next();
  },
];

// Login Route
router.post('/', loginLimiter, validationMiddleware, asyncHandler(loginUser));

export default router;
