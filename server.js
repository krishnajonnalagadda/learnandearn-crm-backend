import express from 'express';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
app.use(express.json());

// Apply security headers
app.use(helmet());

// Rate limiter for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});
app.use('/api/login', loginLimiter);

// Define Routes
app.use('/api/login', authRoutes);
app.use('/api/contacts', contactRoutes);

// Start the Server
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
