const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

let globalTotalBottles = 0;
let globalTotalPrice = 0;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML and JS)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', (req, res) => {
    const bottles = req.body;
    let totalBottles = 0;
    let totalPrice = 0;

    // Calculate the total number of bottles and price
    for (let key in bottles) {
        if (key.startsWith('wein')) {
            let quantity = parseInt(bottles[key], 10);
            let price = parseFloat(req.body[`summe${key.replace('wein', '')}`]);

            // If quantity or price is NaN, set them to 0
            if (isNaN(quantity)) {
                quantity = 0;
            }
            if (isNaN(price)) {
                price = 0;
            }

            if (quantity > 0) {
                totalBottles += quantity;
                totalPrice += quantity * price;
            }
        }
    }

    // Determine shipping cost
    let shippingCost = 0;
    if (totalBottles > 12) {
        shippingCost = 15.00; // Spedition
    } else {
        shippingCost = 10.00; // DHL
    }

    // Calculate final price with VAT
    totalPrice += shippingCost;
    const vat = totalPrice * 0.19;
    const finalPrice = totalPrice + vat;

    // Store the results in global variables
    globalTotalBottles = totalBottles;
    globalTotalPrice = parseFloat(finalPrice.toFixed(2));

    // Respond with the calculated details
    res.send(`
    <html>
      <body>
        <h1>Bestellungsübersicht</h1>
        <p>Anzahl der Flaschen: ${totalBottles}</p>
        <p>Gesamtpreis: ${globalTotalPrice} €</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
