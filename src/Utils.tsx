export class Pair {
    x : any;
    y : any;

    constructor(x: any, y: any) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setX(x: any) {
        this.x = x;
    }

    setY(y: any) {
        this.y = y;
    }

    public equals(pair: Pair): boolean {
        return this.x == pair.x && this.y == pair.y;
    }

    public toString() : string {
        return "("+this.x+", "+this.y+")";
    }
}

/* Representación cúbica del hexágono */
export class Cubic {
    x : number;
    y : number;
    z : number;

    constructor(pair : Pair) {
        this.x = pair.y;
        this.z = pair.x - (pair.y - (pair.y&1))/2
        this.y = -this.x-this.z;
    }

    /* Calcula la distancia Manhattan */
    distanceTo(cubic : Cubic) {
        return Math.max(Math.abs(this.x - cubic.x), Math.abs(this.y - cubic.y), Math.abs(this.z - cubic.z));
    }

    public toString() : string {
        return "("+this.x+", "+this.y+", "+this.z+")";
    }
}

//Debido a que indexOf de los array iguala con ===, no es posible saber si un objeto está dentro de un array sino es identicamente el mismo objeto
//por eso se ha creado este método auxiliar para ayudar al cálculo
export function myIndexOf(arr: Array<Pair>, o: Pair) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].x == o.x && arr[i].y == o.y) {
            return i;
        }
    }
    return -1;
}
