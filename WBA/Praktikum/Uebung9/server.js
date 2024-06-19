const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');

// MySQL Datenbankverbindung
const db = mysql.createConnection({
  host: 'localhost',
  user: 'ezeil001',
  password: '15181-Fa2',
  database: 'vier_gewinnt',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// API Endpunkt für Highscore-Speicherung
app.post('/save-score', (req, res) => {
  const { playerName, score } = req.body;
  const query = 'INSERT INTO highscores (playerName, score) VALUES (?, ?)';
  db.query(query, [playerName, score], (err, result) => {
    if (err) {
      console.error('Error saving score:', err);
      res.status(500).send('Error saving score');
    } else {
      res.send('Score saved');
    }
  });
});

app.get('/highscores', (req, res) => {
  const query = 'SELECT * FROM highscores ORDER BY score DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching highscores:', err);
      res.status(500).send('Error fetching highscores');
    } else {
      res.json(results);
    }
  });
});

const port = 3306;
const hostname = 'localhost';
app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
});