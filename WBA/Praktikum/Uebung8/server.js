const express = require('express');
const mariadb = require('mariadb');
const app = express();

const pool = mariadb.createPool({
    host: 'localhost',
    database: 'news',
    user: 'ezeil001',
    password: '15181-Fa2',
    connectionLimit: 5
});

async function getConnection() {
    return await pool.getConnection();
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the News API!');
});

app.post('/news/', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        res.status(400).send('Bad Request: Missing "message" in request body.');
        return;
    }
    let conn;
    try {
        conn = await getConnection();
        const sql = 'INSERT INTO news (message) VALUES (?)';
        await conn.query(sql, [message]);
        res.status(201).send('News created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error: Unable to create news.');
    } finally {
        if (conn) conn.release();
    }
});

app.get('/news/:date', async (req, res) => {
    const date = req.params.date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).send('Date has wrong format! (YYYY-MM-DD)');
        return;
    }
    let conn;
    try {
        conn = await getConnection();
        const sql = 'SELECT * FROM news WHERE DATE(time) = ?';
        const rows = await conn.query(sql, [date]);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(rows));
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error: Unable to retrieve news.');
    } finally {
        if (conn) conn.release();
    }
});

app.patch('/news/:newsid', async (req, res) => {
    const newsid = req.params.newsid;
    const { message } = req.body;

    if (!/^\d+$/.test(newsid)) {
        res.status(400).send('Invalid format for newsid!');
        return;
    }
    if (!message) {
        res.status(400).send('Malformed body: Missing "message".');
        return;
    }

    let conn;
    try {
        conn = await getConnection();
        const sql = 'UPDATE news SET message = ? WHERE newsid = ?';
        const result = await conn.query(sql, [message, newsid]);
        if (result.affectedRows === 0) {
            res.status(404).send('News not found');
        } else {
            res.status(200).send('News updated successfully');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error: Unable to update news.');
    } finally {
        if (conn) conn.release();
    }
});

app.delete('/news/:newsid', async (req, res) => {
    const newsid = req.params.newsid;
    if (!/^\d+$/.test(newsid)) {
        res.status(400).send('Invalid format for newsid!');
        return;
    }
    let conn;
    try {
        conn = await getConnection();
        const sql = 'DELETE FROM news WHERE newsid = ?';
        const result = await conn.query(sql, [newsid]);
        if (result.affectedRows === 0) {
            res.status(404).send('News not found');
        } else {
            res.status(200).send('News deleted successfully');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error: Unable to delete news.');
    } finally {
        if (conn) conn.release();
    }
});

const port = 3000;
const hostname = 'localhost';
app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
});
