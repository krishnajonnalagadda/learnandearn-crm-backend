import db from '../config/db.js';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage: storage }); // Export the multer upload for route usage

// Get Contacts
export const getContacts = (req, res) => {
  const userId = req.user.user_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query(
    'SELECT * FROM contacts_table WHERE assigned_user_id = ? LIMIT ? OFFSET ?',
    [userId, limit, offset],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(results);
    }
  );
};

// Update Contact
export const updateContact = (req, res) => {
  const { id } = req.params;
  const { status, remarks, follow_up_date } = req.body;

  if (!status || !remarks || !follow_up_date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query(
    'UPDATE contacts_table SET status = ?, remarks = ?, follow_up_date = ? WHERE contact_id = ? AND assigned_user_id = ?',
    [status, remarks, follow_up_date, id, req.user.user_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Contact not found or not authorized' });
      }
      res.json({ message: 'Contact updated successfully' });
    }
  );
};

// New handler for uploading call log and WhatsApp screenshots
export const uploadContactLog = (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // `type` should be either 'call_log' or 'whatsapp_log'
  const userId = req.user.user_id;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  if (type !== 'call_log' && type !== 'whatsapp_log') {
    return res.status(400).json({ message: 'Invalid log type. It should be either call_log or whatsapp_log.' });
  }

  const column = type === 'call_log' ? 'call_log_screenshot' : 'whatsapp_screenshot';

  db.query(
    `UPDATE contacts_table SET ${column} = ? WHERE contact_id = ? AND assigned_user_id = ?`,
    // [req.file.path, id, userId],
    [`/uploads/${req.file.filename}`, id, userId], 
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Contact not found or not authorized' });
      }
    //   res.json({ message: 'File uploaded successfully', filePath: req.file.path });
        res.json({ message: 'File uploaded successfully', filePath: `/uploads/${req.file.filename}` });
      
    }
  );
};
