/**
 * Event listener for DOMContentLoaded to initialize input restrictions and event listeners.
 */
document.addEventListener('DOMContentLoaded', function () {
    let wein = [
        ["Marienthaler Stiftsberg Rotweincuvée", 3.60],
        ["Riesling Classic", 3.70],
        ["Silvaner Selection Rheinhessen", 6.90],
        ["Domaine Avelsbach Riesling Sekt", 6.15]
    ];

    // Sort the wine array alphabetically by name
    wein.sort((a, b) => a[0].localeCompare(b[0]));

    // Get the form container
    const formContainer = document.getElementById('weinForm');

    // Generate form inputs dynamically based on the sorted array
    wein.forEach((wine, index) => {
        const wineName = wine[0];
        const winePrice = wine[1];

        // Create a new row for the wine input group
        const row = document.createElement('tr');

        // Create the cells for the row
        const flaschenCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const preisCell = document.createElement('td');
        const gesamtpreisCell = document.createElement('td');

        // Create the input for the wine quantity
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `wein${index}`;
        input.classList.add('anz');
        input.setAttribute('data-price', winePrice);

        // Create the input for the wine price
        const priceInput = document.createElement('input');
        priceInput.type = 'text';
        priceInput.id = `preis${index}`;
        priceInput.classList.add('preis');
        priceInput.setAttribute('readonly', 'true');

        // Populate the cells with the respective elements
        flaschenCell.appendChild(input);
        nameCell.innerText = wineName;
        preisCell.innerText = winePrice.toFixed(2);
        gesamtpreisCell.appendChild(priceInput);

        // Append the cells to the row
        row.appendChild(flaschenCell);
        row.appendChild(nameCell);
        row.appendChild(preisCell);
        row.appendChild(gesamtpreisCell);

        // Append the row to the form container
        formContainer.appendChild(row);
    });

    // Add event listeners to the dynamically created input fields
    const inputs = document.querySelectorAll('input[type="text"].anz');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, ''); // Only allow numeric input
        });

        input.addEventListener('change', checkFlaschenAnzahl);
        input.addEventListener('change', preiswein);
    });

    // Add event listeners to the radio buttons
    document.getElementById('DHL').addEventListener('change', preiswein);
    document.getElementById('Spedition').addEventListener('change', preiswein);

    /**
     * Checks the total number of bottles and disables the DHL option if the total exceeds 12.
     */
    function checkFlaschenAnzahl() {
        let flaschenAnzahl = 0;
        inputs.forEach(function (input) {
            if (input.value && !isNaN(input.value) && parseFloat(input.value) > 0) {
                flaschenAnzahl += parseFloat(input.value);
            }
        });

        const DHLInput = document.getElementById('DHL');
        if (flaschenAnzahl > 12) {
            DHLInput.disabled = true;
            DHLInput.checked = true;
        } else {
            DHLInput.disabled = false;
        }
    }

    /**
     * Calculates the prices of wine based on their quantity and updates the total prices including taxes.
     */
    function preiswein() {
        let zs = 0;

        inputs.forEach(input => {
            const quantity = parseFloat(input.value);
            const price = parseFloat(input.getAttribute('data-price'));
            const priceInput = document.getElementById(`preis${input.id.replace('wein', '')}`);

            if (!isNaN(quantity) && quantity > 0) {
                const totalPrice = (quantity * price).toFixed(2);
                priceInput.value = totalPrice;
                zs += parseFloat(totalPrice);
            } else {
                priceInput.value = '';
            }
        });

        const dhlInput = document.getElementById('DHL');
        const dhlPrice = dhlInput.checked ? 10.0 : 0;
        const speditionInput = document.getElementById('Spedition');
        const speditionPrice = speditionInput.checked ? 15.0 : 0;

        zs += dhlPrice + speditionPrice;

        document.getElementById('preisDHL').value = dhlPrice ? dhlPrice.toFixed(2) : '';
        document.getElementById('preisSpedition').value = speditionPrice ? speditionPrice.toFixed(2) : '';
        document.getElementById('zs').value = zs.toFixed(2);

        const mwstBetrag = (zs * 0.19).toFixed(2);
        document.getElementById('mwst').value = mwstBetrag;

        const summe = (zs + parseFloat(mwstBetrag)).toFixed(2);
        document.getElementById('Summe').value = summe;
    }

    /**
     * Disables all inputs with the class 'preis' by setting them to read-only.
     */
    function inputdisabled() {
        const preisInputs = document.querySelectorAll('.preis');
        preisInputs.forEach(function (input) {
            document.getElementById('weinForm').onkeyup = function() {
                checkFlaschenAnzahl();
                preiswein();
            };
            input.setAttribute('disabled', 'true'); // Set input to readonly
        });
    }

    inputdisabled();
});
