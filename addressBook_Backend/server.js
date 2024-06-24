import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // use your MySQL username
  password: 'root', // use your MySQL password
  database: 'address_book' // use your database name
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Route to read all contacts
app.get('/readContacts', (req, res) => {
  const query = 'SELECT * FROM contacts';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Server error' });
    } else {
      res.json(results);
    }
  });
});

// Route to read a specific contact by ID
app.get('/readContacts/:id', (req, res) => {
  const studentid = req.params.id;
  const query = 'SELECT * FROM contacts WHERE id = ?';
  db.query(query, [studentid], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Server error' });
    } else {
      res.json({ status: true, data: results });
    }
  });
});

// Route to save a contact
app.post('/saveContacts', (req, res) => {
  const { name, email, phone } = req.body;
  const query = 'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)';
  db.query(query, [name, email, phone], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Server error' });
    } else {
      res.status(201).json({ message: 'Contact added' });
    }
  });
});

// Route to update a contact
app.put('/updateContacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const query = 'UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?';
  db.query(query, [name, email, phone, id], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'Server error' });
    } else {
      res.json({ message: 'Contact updated' });
    }
  });
});

// Route to delete a contact
app.delete('/deleteContacts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM contacts WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      res.status(500).json({ error: 'Server error' });
    } else {
      res.json({ message: 'Contact deleted' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
