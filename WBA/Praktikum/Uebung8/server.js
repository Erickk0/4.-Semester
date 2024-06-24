const express = require('express');
const mariadb = require('mariadb');
const app = express();

const pool = mariadb.createPool({
    host: 'mariadb1.local.cs.hs-rm.de',
    ssl: {
        rejectUnauthorized: false
    },
    user: 'xxx',
    password: 'xxx',
    database: 'xxx',
    connectionLimit: 10,
    acquireTimeout: 20000
});

/**
 * Tests the initial connection to the database.
 * @async
 * @function testConnection
 * @returns {Promise<void>}
 */
async function testConnection() {
    let conn;
    try {
        console.log('Attempting to get a connection from the pool...');
        conn = await pool.getConnection();
        console.log('Connection acquired:', conn);
    } catch (err) {
        console.error('Error occurred during initial connection test:', err);
    } finally {
        if (conn) conn.release(); // release to pool
    }
}

/**
 * Initializes the database by creating the 'news' table and inserting a sample message.
 * @async
 * @function initializeDatabase
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('Attempting to create table...');
        const createTable = await conn.query(`
            CREATE TABLE IF NOT EXISTS news
            (
                newsid  int(11) NOT NULL AUTO_INCREMENT,
                time    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                message text NOT NULL,
                PRIMARY KEY (newsid)
            ) charset='utf8'
        `);
        console.log('Table creation result:', createTable);

        console.log('Attempting to insert a message into the table...');
        const insert = await conn.query(`
            INSERT INTO news (message)
            VALUES ('This is a sample news message.')
        `);
        console.log('Insert result:', insert);

        console.log('Attempting to select all records from the table...');
        const select = await conn.query('SELECT * FROM news');
        console.log('Select result:', select);

    } catch (err) {
        console.error('Error occurred during database initialization:', err);
    } finally {
        if (conn) conn.release(); // release to pool
    }
}

app.use(express.json());

/**
 * Root endpoint.
 * @name GET/
 * @function
 * @memberof module:app
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/', (req, res) => {
    res.send('Welcome to the News API!');
});

/**
 * Endpoint to create a news message.
 * @name POST/news/
 * @function
 * @memberof module:app
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post('/news/', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        res.status(400).send('Bad Request: Missing "message" in request body.');
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        const sql = 'INSERT INTO news (message) VALUES (?)';
        await conn.query(sql, [message]);
        res.status(201).send('News created successfully');
    } catch (err) {
        console.error('Error occurred while creating news:', err);
        res.status(500).send('Server error: Unable to create news.');
    } finally {
        if (conn) conn.release();
    }
});

/**
 * Endpoint to get news messages by date.
 * @name GET/news/:date
 * @function
 * @memberof module:app
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/news/:date', async (req, res) => {
    const date = req.params.date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).send('Date has wrong format! (YYYY-MM-DD)');
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        const sql = 'SELECT * FROM news WHERE DATE(time) = ?';
        const rows = await conn.query(sql, [date]);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(rows));
    } catch (err) {
        console.error('Error occurred while retrieving news:', err);
        res.status(500).send('Server error: Unable to retrieve news.');
    } finally {
        if (conn) conn.release();
    }
});

/**
 * Endpoint to update a news message by ID.
 * @name PUT/news/:newsid
 * @function
 * @memberof module:app
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.put('/news/:newsid', async (req, res) => {
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
        conn = await pool.getConnection();
        const sql = 'UPDATE news SET message = ? WHERE newsid = ?';
        const result = await conn.query(sql, [message, newsid]);
        if (result.affectedRows === 0) {
            res.status(404).send('News not found');
        } else {
            res.status(200).send('News updated successfully');
        }
    } catch (err) {
        console.error('Error occurred while updating news:', err);
        res.status(500).send('Server error: Unable to update news.');
    } finally {
        if (conn) conn.release();
    }
});

/**
 * Endpoint to delete a news message by ID.
 * @name DELETE/news/:newsid
 * @function
 * @memberof module:app
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.delete('/news/:newsid', async (req, res) => {
    const newsid = req.params.newsid;
    if (!/^\d+$/.test(newsid)) {
        res.status(400).send('Invalid format for newsid!');
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        const sql = 'DELETE FROM news WHERE newsid = ?';
        const result = await conn.query(sql, [newsid]);
        if (result.affectedRows === 0) {
            res.status(404).send('News not found');
        } else {
            res.status(200).send('News deleted successfully');
        }
    } catch (err) {
        console.error('Error occurred while deleting news:', err);
        res.status(500).send('Server error: Unable to delete news.');
    } finally {
        if (conn) conn.release();
    }
});

/**
 * Tests the connection and initializes the database.
 */
testConnection().then(() => {
    console.log('Initial connection test completed.');
    return initializeDatabase();
}).then(() => {
    console.log('Database initialization completed.');
}).catch(err => {
    console.error('Initialization failed:', err);
});

const port = 3000;
const hostname = 'localhost';
app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
});
