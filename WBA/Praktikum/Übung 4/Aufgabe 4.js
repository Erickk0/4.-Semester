/** Klasse, die den Kegelstumpf repräsentiert */
class Kegelstumpf{
    /**
     * @constructs Kegelstumpf
     * @param {number} R -
     * @param {number} r - Radius Kegelstumpf
     * @param {number} h - Höhe Kegelstumpf
     */
    constructor(R, r, h) {
        this.R = R;
        this.h = h;
        this.r = r;
    }

    /**
     * Funktion, für die Berechnung des Volumens des Kegelstumpfs
     * @param {number} R -
     * @param {number} r - Radius Kegelstumpf
     * @param {number} h - Höhe Kegelstumpf
     * @returns {number} V - Volumen des Kegelstumpfs
     */
    volumen(R, r, h){
        var V = (Math.PI*h/3)*(R**2 + R + r**2);
        return V;
    }

    /**
     * Funktion zur Berechnung für die Mantelfläche
     * @returns {number} M - Mantelfläche des Kegelstumpfs
     */
    mantelflaeche(){
        var m = Math.sqrt(((this.R - 2) ** 2 + this.h ** 2));
        var M = Math.PI * m (this.R + this.r);
        return M;
    }

    /**
     * Funktion zur Berechnung der Oberfläche des Kegelstumpfs
     * @returns {number} O - Oberfläche des Kegelstumpfs
     */
    oberflaeche() {
        var O = Math.PI * this.R ** 2 + Math.PI * this.r ** 2 + M;
        return O;
    }
}

/** @constant
 * @type {Kegelstumpf}
 */
const kegelstumpf = new Kegelstumpf();
console.log("Volumen:", kegelstumpf.volumen());
console.log("Mantelfläche:", kegelstumpf.mantelflaeche());
console.log("Oberfläche:", kegelstumpf.oberflaeche());