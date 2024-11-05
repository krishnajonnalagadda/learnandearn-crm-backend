import db from '../config/db.js';

export const getContacts = (req, res) => {
  const userId = req.user.user_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query('SELECT * FROM contacts_table WHERE assigned_user_id = ? LIMIT ? OFFSET ?', [userId, limit, offset], (err, results) => {
    if (err) return res.status(500).json({ message: 'Internal server error' });
    res.json(results);
  });
};

export const updateContact = (req, res) => {
  const { id } = req.params;
  const { status, remarks, follow_up_date } = req.body;

  db.query(
    'UPDATE contacts_table SET status = ?, remarks = ?, follow_up_date = ? WHERE contact_id = ? AND assigned_user_id = ?',
    [status, remarks, follow_up_date, id, req.user.user_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Internal server error' });
      res.json({ message: 'Contact updated successfully' });
    }
  );
};
