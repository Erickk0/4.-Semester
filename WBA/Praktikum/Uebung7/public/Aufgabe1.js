document.addEventListener('DOMContentLoaded', function () {
    let wein = [
        ["Marienthaler Stiftsberg Rotweincuvée", 3.60],
        ["Riesling Classic", 3.70],
        ["Silvaner Selection Rheinhessen", 6.90],
        ["Domaine Avelsbach Riesling Sekt", 6.15]
    ];

    wein.sort((a, b) => a[0].localeCompare(b[0]));

    const formContainer = document.getElementById('weinForm');

    wein.forEach((wine, index) => {
        const wineName = wine[0];
        const winePrice = wine[1];

        const row = document.createElement('tr');

        const flaschenCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const preisCell = document.createElement('td');
        const gesamtpreisCell = document.createElement('td');

        const input = document.createElement('input');
        input.type = 'text';
        input.name = `wein${index}`;
        input.id = `wein${index}`;
        input.classList.add('anz');
        input.setAttribute('data-price', winePrice);

        const priceInput = document.createElement('input');
        priceInput.type = 'text';
        priceInput.id = `preis${index}`;
        priceInput.classList.add('preis');
        priceInput.setAttribute('readonly', 'true');

        flaschenCell.appendChild(input);
        nameCell.innerText = wineName;
        preisCell.innerText = winePrice.toFixed(2);
        gesamtpreisCell.appendChild(priceInput);

        row.appendChild(flaschenCell);
        row.appendChild(nameCell);
        row.appendChild(preisCell);
        row.appendChild(gesamtpreisCell);

        formContainer.appendChild(row);
    });

    const inputs = document.querySelectorAll('input[type="text"].anz');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '');
        });

        input.addEventListener('change', checkFlaschenAnzahl);
        input.addEventListener('change', preiswein);
    });

    document.getElementById('DHL').addEventListener('change', preiswein);
    document.getElementById('Spedition').addEventListener('change', preiswein);

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

    function preiswein() {
        let zs = 0;

        inputs.forEach(input => {
            const quantity = parseFloat(input.value);
            const price = parseFloat(input.getAttribute('data-price'));
            const priceInput = document.getElementById(`preis${input.id.replace('wein', '')}`);

            if (!isNaN(quantity) && !isNaN(price)) {
                const total = quantity * price;
                priceInput.value = total.toFixed(2);
                zs += total;
            } else {
                priceInput.value = '';
            }
        });

        const versandInput = document.querySelector('input[name="versand"]:checked');
        const versandkosten = versandInput ? parseFloat(versandInput.nextElementSibling.nextElementSibling.textContent) : 0;

        const versandField = versandInput ? document.getElementById(`preis${versandInput.id}`) : null;
        if (versandField) {
            versandField.value = versandkosten.toFixed(2);
        }

        zs += versandkosten;

        const mwst = zs * 0.19;
        const summe = zs + mwst;

        document.getElementById('zs').value = zs.toFixed(2);
        document.getElementById('mwst').value = mwst.toFixed(2);
        document.getElementById('Summe').value = summe.toFixed(2);
    }
});
