class Kegelstumpf {
    constructor(R, r, h) {
        if(R < 0) throw new Error("R must be greater than or 0");
        if(r < 0 && !(this instanceof Kreiskegel)) throw new Error("r must be greater than or 0");
        if(h < 0) throw new Error("h must be greater than or 0");
        this.R = R;
        this.r = r;
        this.h = h;
    }
    volumen() {
        var V = (Math.PI * this.h) / 3 * (this.R**2 + this.R*this.r + this.r**2);
        return V;
    }
    mantelflaeche() {
        var m = Math.sqrt(((this.R - 2)**2 + this.h**2));
        var M = Math.PI*m*(this.R + this.r );
        return M
    }
    oberflaeche() {
        var O = Math.PI*this.R**2 + Math.PI*this.r**2 + this.mantelflaeche();
        return O;
    }
}


class Zylinder extends Kegelstumpf {
    constructor(R, h) {
        super(R, R, h);
    }
}

class Kreiskegel extends Kegelstumpf {
    constructor(R, h) {
        super(R, 0, h);
    }
}