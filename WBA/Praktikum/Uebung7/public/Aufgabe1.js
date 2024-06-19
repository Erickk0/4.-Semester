document.addEventListener('DOMContentLoaded', function () {
    let weine = [
        ["Marienthaler Stiftsberg RotweincuvÃ©e", 3.60],
        ["Riesling Classic", 3.70],
        ["Silvaner Selection Rheinhessen", 6.90],
        ["Domaine Avelsbach Riesling Sekt", 6.15]
    ];

    weine.sort((a, b) => a[0].localeCompare(b[0]));

    const formContainer = document.getElementById('weinForm');

    weine.forEach((wein, index) => {
        const wineName = wein[0];
        const winePrice = wein[1];

        const row = document.createElement('tr');

        const bottlesCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const priceCell = document.createElement('td');
        const totalPriceCell = document.createElement('td');

        const input = document.createElement('input');
        input.type = 'text';
        input.name = `wein${index}`;
        input.classList.add('anz');
        input.setAttribute('data-price', winePrice);

        const priceInput = document.createElement('input');
        priceInput.type = 'hidden';
        priceInput.name = `price${index}`;
        priceInput.value = winePrice.toFixed(2);

        const displayedPrice = document.createElement('input');
        displayedPrice.type = 'text';
        displayedPrice.name = `displayedPrice${index}`;
        displayedPrice.classList.add('preis');
        displayedPrice.setAttribute('readonly', 'true');
        displayedPrice.value = "0.00";

        bottlesCell.appendChild(input);
        nameCell.innerText = wineName;
        priceCell.innerText = winePrice.toFixed(2);
        totalPriceCell.appendChild(displayedPrice);
        totalPriceCell.appendChild(priceInput);

        row.appendChild(bottlesCell);
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(totalPriceCell);

        formContainer.appendChild(row);
    });

    const inputs = document.querySelectorAll('input[type="text"].anz');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '');
            calculateWinePrice();
        });

        input.addEventListener('change', checkBottleAmount);
    });

    document.getElementById('DHL').addEventListener('change', calculateWinePrice);
    document.getElementById('Spedition').addEventListener('change', calculateWinePrice);

    function checkBottleAmount() {
        let bottleCount = 0;
        inputs.forEach(function (input) {
            if (input.value && !isNaN(input.value) && parseFloat(input.value) > 0) {
                bottleCount += parseFloat(input.value);
            }
        });

        if (bottleCount > 12) {
            document.getElementById('DHL').disabled = true;
            document.getElementById('Spedition').checked = true;
        } else {
            document.getElementById('DHL').disabled = false;
        }
    }

    function calculateWinePrice() {
        let zs = 0;

        inputs.forEach(input => {
            const quantity = parseFloat(input.value);
            const price = parseFloat(input.getAttribute('data-price'));
            const priceInput = document.querySelector(`input[name="displayedPrice${input.name.replace('wein', '')}"]`);

            if (!isNaN(quantity) && quantity > 0) {
                const totalItemPrice = (quantity * price).toFixed(2);
                priceInput.value = totalItemPrice;
                zs += parseFloat(totalItemPrice);
            } else {
                priceInput.value = '0.00';
            }
        });

        const dhlInput = document.getElementById('DHL');
        const dhlPrice = dhlInput.checked ? 10.0 : 0;
        const speditionInput = document.getElementById('Spedition');
        const speditionPrice = speditionInput.checked ? 15.0 : 0;

        zs += dhlPrice + speditionPrice;

        document.getElementById('preisDHL').value = dhlPrice ? dhlPrice.toFixed(2) : '0.00';
        document.getElementById('preisSpedition').value = speditionPrice ? speditionPrice.toFixed(2) : '0.00';
        document.getElementById('zs').value = zs.toFixed(2);

        const mwstAmount = (zs * 0.19).toFixed(2);
        document.getElementById('mwst').value = mwstAmount;

        const finalAmount = (zs + parseFloat(mwstAmount)).toFixed(2);
        document.getElementById('Summe').value = finalAmount;
    }

    function disableInputs() {
        const priceInputs = document.querySelectorAll('.preis');
        priceInputs.forEach(function (input) {
            input.setAttribute('disabled', 'true');
        });
        document.getElementById('weinForm').onkeyup = function(){checkBottleAmount(), calculateWinePrice()};
    }

    disableInputs();

    // Add event listener for form submission
    document.getElementById('weinForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);

        fetch('/submit', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                document.body.innerHTML = data;
            })
            .catch(error => console.error('Error:', error));
    });
});