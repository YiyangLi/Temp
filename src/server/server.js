const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./YY_And_His_Friends.db');
const querySQL = fs.readFileSync('./query.sql', 'utf-8');

app.get('/api/sales-data', (req, res) => {
  const { startDate = '2022-12-01', endDate = '2022-12-31' } = req.query;
  
  db.all(querySQL, [startDate, endDate], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

const PORT = process.env.BACKEND_PORT || 5051;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});