class Kegelstumpf{
    constructor(R, r, h) {
        this.R = R;
        this.h = h;
        this.r = r;
    }
    volumen(R, r, h){
        var V = (Math.PI*h/3)*(R**2 + R + r**2);
        return V;
    }
    mantelflaeche(){
        var m = Math.sqrt(((this.R - 2) ** 2 + this.h ** 2));
        var M = Math.PI * m (this.R + this.r);
        return M;
    }
    oberflaeche() {
        var O = Math.PI * this.R ** 2 + Math.PI * this.r ** 2 + M;
        return O;
    }
}

const kegelstumpf = new Kegelstumpf();
console.log("Volumen:", kegelstumpf.volumen());
console.log("Mantelfläche:", kegelstumpf.mantelflaeche());
console.log("Oberfläche:", kegelstumpf.oberflaeche());