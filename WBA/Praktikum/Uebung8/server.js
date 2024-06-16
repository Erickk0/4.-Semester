const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());

const db = mysql.createConnection({
    host: 'mariadb1.local.cs.hs-rm.de',
    user: 'ezeil001',
    password: '15181-Fa2',
    database: 'your_database'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Neue Nachrichten in die Datenbank einfügen
app.post('/news', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    const query = 'INSERT INTO news (message) VALUES (?)';
    db.query(query, [message], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ newsid: results.insertId });
    });
});

// Nachrichten von einem bestimmten Tag abrufen
app.get('/news/date/:date', (req, res) => {
    const { date } = req.params;
    const query = 'SELECT * FROM news WHERE DATE(time) = ?';
    db.query(query, [date], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Nachricht mit einer bestimmten newsid ändern
app.put('/news/:newsid', (req, res) => {
    const { newsid } = req.params;
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    const query = 'UPDATE news SET message = ? WHERE newsid = ?';
    db.query(query, [message, newsid], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'News not found' });
        }
        res.json({ message: 'News updated successfully' });
    });
});

// Löschen einer Nachricht mit newsid
app.delete('/news/:newsid', (req, res) => {
    const { newsid } = req.params;
    const query = 'DELETE FROM news WHERE newsid = ?';
    db.query(query, [newsid], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'News not found' });
        }
        res.json({ message: 'News deleted successfully' });
    });
});

// Fehlerbehandlung bei ungültigen Anfragen
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
