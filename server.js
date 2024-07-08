const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL pool setup
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // This is for development purposes. For production, ensure you properly configure SSL certificates.
  },
});

// Test route
app.get('/', (req, res) => {
  res.send('Server running successfully!');
});

// Route to fetch data from PostgreSQL
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM UserDetails');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/addUsers', async (req, res) => {
    try {
      const { fullname, email, location } = req.body;
      const result = await pool.query(
        'INSERT INTO UserDetails (fullname, email, location) VALUES ($1, $2, $3) RETURNING *',
        [fullname, email, location]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
