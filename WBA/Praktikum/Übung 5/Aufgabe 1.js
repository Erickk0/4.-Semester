/** Klasse, die einen Kegelstumpf repräsentiert */
class Kegelstumpf {
    /**
     * @constructs Kegelstumpf
     * @param {number} R -
     * @param {number} r - Radius Kegelstumpf
     * @param {number} h - Höhe Kegelstumpf
     * @throws Will throw an error if Argument is smaller than zero
     */
    constructor(R, r, h) {
        if(R < 0) throw new Error("R must be greater than or 0");
        if(r < 0 && !(this instanceof Kreiskegel)) throw new Error("r must be greater than or 0");
        if(h < 0) throw new Error("h must be greater than or 0");
        this.R = R;
        this.r = r;
        this.h = h;
    }

    /**
     * Funktion, für die Berechnung des Volumens des Kegelstumpfs
     * @returns {number} V - Volumen des Kegelstumpfs
     */
    volumen() {
        var V = (Math.PI * this.h) / 3 * (this.R**2 + this.R*this.r + this.r**2);
        return V;
    }

    /**
     * Funktion, zur Berechnung der Mantelfläche des Kegestumpfs
     * @returns {number} M - Mantelfläche des Kegelstumpfs
     */
    mantelflaeche() {
        var m = Math.sqrt(((this.R - 2)**2 + this.h**2));
        var M = Math.PI*m*(this.R + this.r );
        return M;
    }

    /**
     * Funktion zur Berechnung der Oberfläche des Kegelstumpfs
     * @returns {number} O - Oberfläche des Kegelstumpfs
     */
    oberflaeche() {
        var O = Math.PI*this.R**2 + Math.PI*this.r**2 + this.mantelflaeche();
        return O;
    }
}


/** Klasse die einen Zylinder repräsentiert */
class Zylinder extends Kegelstumpf {
    /**
     * @constructs Zylinder
     * @param {number} R -
     * @param {number} h - Höhe Zylinder
     */
    constructor(R, h) {
        super(R, R, h);
    }
}


/** Klasse, die einen Kreiskegel repräsentiert */
class Kreiskegel extends Kegelstumpf {
    /** @constructor Kreiskegel
     * @param {number} R -
     * @param {number} h - Höhe Kreiskegel
     */
    constructor(R, h) {
        super(R, 0, h);
    }
}