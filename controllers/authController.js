import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const loginUser = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users_table WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Internal server error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  });
};
