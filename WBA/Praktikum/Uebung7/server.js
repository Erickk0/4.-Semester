const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Body-Parser-Middleware, um POST-Daten zu verarbeiten
app.use(bodyParser.urlencoded({ extended: true }));

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// GET-Anfragen für die HTML- und JS-Dateien
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/Aufgabe1.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Aufgabe1.js'));
});

// POST-Anfrage für das Formular
app.post('/', (req, res) => {
    const formData = req.body;
    const flaschen = Object.keys(formData).filter(key => key.startsWith('wein')).map(key => parseInt(formData[key], 10)).filter(val => !isNaN(val));
    const anzahlFlaschen = flaschen.reduce((sum, num) => sum + num, 0);

    const versandkosten = formData.versand === 'DHL' ? 10.00 : formData.versand === 'Spedition' ? 15.00 : 0;
    const weinPreise = [3.60, 3.70, 6.90, 6.15];
    const gesamtPreis = flaschen.reduce((sum, num, index) => sum + (num * weinPreise[index]), 0) + versandkosten;

    const mwst = gesamtPreis * 0.19;
    const endSumme = gesamtPreis + mwst;

    res.send(`
        <html>
        <body>
            <h1>Bestellbestätigung</h1>
            <p>Anzahl der Flaschen: ${anzahlFlaschen}</p>
            <p>Endsumme: €${endSumme.toFixed(2)}</p>
        </body>
        </html>
    `);
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
