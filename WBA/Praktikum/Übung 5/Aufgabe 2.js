/**
 * Event listener for DOMContentLoaded to initialize input restrictions and event listeners.
 */
document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('input[type="text"]');

    inputs.forEach(input => {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, ''); // Only allow numeric input
        });
    });
});

/**
 * Checks the total number of bottles and disables the DHL option if the total exceeds 12.
 */
function checkFlaschenAnzahl() {
    let flaschenAnzahl = 0;

    let inputs = document.querySelectorAll('.anz');
    inputs.forEach(function(input) {
        if (input.value && !isNaN(input.value) && parseFloat(input.value) > 0) {
            flaschenAnzahl += parseFloat(input.value);
        }
    });

    document.getElementById('DHL').disabled = flaschenAnzahl > 12; // Disable DHL if total bottles exceed 12
}

/**
 * Disables all inputs with the class 'preis' by setting them to read-only.
 */
function inputdisabled(){
    let preisInputs = document.querySelectorAll('.preis');
    preisInputs.forEach(function(input){
       input.setAttribute('readonly', 'true'); // Set input to readonly
    });
}

/**
 * Calculates the prices of items based on their quantity and updates the total prices including taxes.
 */
function preis() {
    // MSR calculations
    /**
     * Calculates and sets the price for MSR items.
     * @param {HTMLElement} msrInput - The input element for MSR quantity.
     * @param {number} msrPrice - The price per unit of MSR.
     */
    let msrInput = document.getElementById('MSR');
    let msrPrice = 3.60;
    let msrQuantity = parseFloat(msrInput.value);
    const preismsr = isNaN(msrQuantity) ? '' : parseFloat((msrPrice * msrQuantity)).toFixed(2);
    let pmsrinp = document.getElementById('preismsr');
    pmsrinp.value = preismsr;

    // RC calculations
    /**
     * Calculates and sets the price for RC items.
     * @param {HTMLElement} rcInput - The input element for RC quantity.
     * @param {number} rcPrice - The price per unit of RC.
     */
    let rcInput = document.getElementById('RC');
    let rcPrice = 3.70;
    let rcQuantity = parseFloat(rcInput.value);
    const preisrc = isNaN(rcQuantity) ? '' : parseFloat((rcPrice * rcQuantity)).toFixed(2);
    let prcinp = document.getElementById('preisrc');
    prcinp.value = preisrc;

    // SSR calculations
    /**
     * Calculates and sets the price for SSR items.
     * @param {HTMLElement} ssrInput - The input element for SSR quantity.
     * @param {number} ssrPrice - The price per unit of SSR.
     */
    let ssrInput = document.getElementById('SSR');
    let ssrPrice = 6.90;
    let ssrQuantity = parseFloat(ssrInput.value);
    const preisssr = isNaN(ssrQuantity) ? '' : parseFloat((ssrPrice * ssrQuantity)).toFixed(2);
    let pssrinp = document.getElementById('preisssr');
    pssrinp.value = preisssr;

    // DARS calculations
    /**
     * Calculates and sets the price for DARS items.
     * @param {HTMLElement} darsInput - The input element for DARS quantity.
     * @param {number} darsPrice - The price per unit of DARS.
     */
    let darsInput = document.getElementById('DARS');
    let darsPrice = 6.15;
    let darsQuantity = parseFloat(darsInput.value);
    const preisdars = isNaN(darsQuantity) ? '' : parseFloat((darsPrice * darsQuantity)).toFixed(2);
    let pdarsinp = document.getElementById('preisdars');
    pdarsinp.value = preisdars;

    // DHL shipping calculations
    /**
     * Calculates and sets the price for DHL shipping.
     * @param {HTMLElement} dhlradio - The radio button element for DHL.
     * @param {number} dhlp - The price for DHL shipping.
     */
    let dhlradio = document.getElementById('DHL');
    let dhlp = parseFloat(10.00);
    let dhlp2 = document.getElementById('dhlpreis');
    if(dhlradio.checked){
        dhlp2.value = parseFloat(dhlp).toFixed(2);
    }else{
        dhlp2.value = '';
    }

    // Spedition shipping calculations
    /**
     * Calculates and sets the price for Spedition shipping.
     * @param {HTMLElement} speradio - The radio button element for Spedition.
     * @param {number} spep - The price for Spedition shipping.
     */
    let speradio = document.getElementById('Spedition');
    let spep = parseFloat(15.00);
    let spep2 = document.getElementById('spepreis');
    if(speradio.checked){
        spep2.value = parseFloat(spep).toFixed(2);
    }else{
        spep2.value = '';
    }

    // Parse prices from inputs
    let pmsr = parseFloat(pmsrinp.value);
    let prc = parseFloat(prcinp.value);
    let pssr = parseFloat(pssrinp.value);
    let pdars = parseFloat(pdarsinp.value);
    let pdhl = parseFloat(dhlp2.value);
    let psped = parseFloat(spep2.value);

    // Replace NaN values with 0
    pmsr = isNaN(pmsr) ? 0 : pmsr;
    prc = isNaN(prc) ? 0 : prc;
    pssr = isNaN(pssr) ? 0 : pssr;
    pdars = isNaN(pdars) ? 0 : pdars;
    pdhl = isNaN(pdhl) ? 0 : pdhl;
    psped = isNaN(psped) ? 0 : psped;

    // Calculates and sets the subtotal
    const zws = pmsr + prc + pssr + pdars + psped + pdhl;
    document.getElementById('zws').value = zws.toFixed(2);

    // Calculates and sets the VAT
    const mwst = zws * 0.19;
    document.getElementById('mwst').value = mwst.toFixed(2);

    // Calculates and sets the total sum including VAT
    const sum = zws + mwst;
    document.getElementById('sum').value = sum.toFixed(2);
}
