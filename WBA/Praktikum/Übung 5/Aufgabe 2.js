document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('input[type="text"]');

    inputs.forEach(input => {
        input.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '');
        });
    });
});

 function checkFlaschenAnzahl() {
    let flaschenAnzahl = 0;

    let inputs = document.querySelectorAll('.anz');
    inputs.forEach(function(input) {
        if (input.value && !isNaN(input.value) && parseFloat(input.value) > 0) {
        flaschenAnzahl += parseFloat(input.value);
        }
    });

    document.getElementById('DHL').disabled = flaschenAnzahl > 12;
}

    /*let inputs = document.querySelectorAll('.anz');
    inputs.forEach(function(input) {
    input.addEventListener('change', checkFlaschenAnzahl);
    });*/

function inputdisabled(){
    let preisInputs = document.querySelectorAll('.preis');
    preisInputs.forEach(function(input){
       input.setAttribute('readonly', 'true');
    });
}

function preis() {
    let msrInput = document.getElementById('MSR');
    let msrPrice = 3.60;
    let msrQuantity = parseFloat(msrInput.value);
    const preismsr = isNaN(msrQuantity) ? '' : parseFloat((msrPrice * msrQuantity).toFixed(2));
    let pmsrinp = document.getElementById('preismsr');
    pmsrinp.value = preismsr;

    let rcInput = document.getElementById('RC');
    let rcPrice = 3.70;
    let rcQuantity = parseFloat(rcInput.value);
    const preisrc = isNaN(rcQuantity) ? '' : parseFloat((rcPrice * rcQuantity).toFixed(2));
    let prcinp = document.getElementById('preisrc');
    prcinp.value = preisrc;

    let ssrInput = document.getElementById('SSR');
    let ssrPrice = 6.90;
    let ssrQuantity = parseFloat(ssrInput.value);
    const preisssr = isNaN(ssrQuantity) ? '' : parseFloat((ssrPrice * ssrQuantity).toFixed(2));
    let pssrinp = document.getElementById('preisssr');
    pssrinp.value = preisssr;

    let darsInput = document.getElementById('DARS');
    let darsPrice = 6.15;
    let darsQuantity = parseFloat(darsInput.value);
    const preisdars = isNaN(darsQuantity) ? '' : parseFloat((darsPrice * darsQuantity).toFixed(2));
    let pdarsinp = document.getElementById('preisdars');
    pdarsinp.value = preisdars;

    let dhlradio = document.getElementById('DHL');
    let dhlp = parseFloat(10.00.toFixed(2));
    let dhlp2 = document.getElementById('dhlpreis');
    if(dhlradio.checked){
        dhlp2.value = parseFloat(dhlp.toFixed(2));
    }else{
        dhlp2.value = '';
    }

    let speradio = document.getElementById('Spedition');
    let spep = parseFloat(15.00.toFixed(2));
    let spep2 = document.getElementById('spepreis');
    if(speradio.checked){
        spep2.value = parseFloat(spep.toFixed(2));
    }else{
        spep2.value = '';
    }


    let pmsr = parseFloat(pmsrinp.value);
    let prc = parseFloat(prcinp.value);
    let pssr = parseFloat(pssrinp.value);
    let pdars = parseFloat(pdarsinp.value);
    let pdhl = parseFloat(dhlp2.value);
    let psped = parseFloat(spep2.value);


    pmsr = isNaN(pmsr) ? 0 : pmsr;
    prc = isNaN(prc) ? 0 : prc;
    pssr = isNaN(pssr) ? 0 : pssr;
    pdars = isNaN(pdars) ? 0 : pdars;
    pdhl = isNaN(pdhl) ? 0 : pdhl;
    psped = isNaN(psped) ? 0 : psped;

    const zws = pmsr + prc + pssr + pdars + psped + pdhl;

    document.getElementById('zws').value = zws.toFixed(2);


    const mwst = zws * 0.19;
    document.getElementById('mwst').value = mwst.toFixed(2);

    const sum = zws + mwst;
    document.getElementById('sum').value = sum.toFixed(2);
}