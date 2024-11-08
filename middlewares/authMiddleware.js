import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const verifyToken = promisify(jwt.verify);

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Malformed Authorization header or token not provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  try {
    const verified = await verifyToken(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = verified;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};
