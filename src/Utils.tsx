export class Pair {
    row : any;
    column : any;

    constructor(x: any, y: any) {
        this.row = x;
        this.column = y;
    }

    getColumn() {
        return this.column;
    }

    getRow() {
        return this.row;
    }

    setColumn(x: any) {
        this.column = x;
    }

    setRow(y: any) {
        this.row = y;
    }

    add(pair : Pair) : Pair {
        var new_pair = new Pair(0,0);
        new_pair.row = this.row + pair.row;
        new_pair.column = this.column + pair.column;
        return new_pair;
    }

    public equals(pair: Pair): boolean {
        return this.row == pair.row && this.column == pair.column;
    }

    public toString = () : string => {
        return "("+this.row+", "+this.column+")";
    }
}

/* Representación cúbica del hexágono */
export class Cubic {
    x : number;
    y : number;
    z : number;

    // TODO: Este constructor debe sólo admitir x,y y z. Se debe poner un método estático de conversión!!!
    constructor(pair : Pair) {
        this.x = pair.column;
        this.z = pair.row - (pair.column - (pair.column&1))/2
        this.y = -this.x-this.z;
    }

    /* Calcula la distancia Manhattan */
    distanceTo(cubic : Cubic) {
        return Math.max(Math.abs(this.x - cubic.x), Math.abs(this.y - cubic.y), Math.abs(this.z - cubic.z));
    }

    getPair(){
        return new Pair(this.z+(this.x-(this.x&1))/2,this.x);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getZ(){
        return this.z;
    }

    add(cubic : Cubic) : Cubic {
        var new_cubic = Object.create(this);
        new_cubic.sum(cubic);
        return new_cubic;
    }

    sum(cubic: Cubic){
        this.x = this.x+cubic.getX();
        this.y = this.y+cubic.getY();
        this.z = this.z+cubic.getZ();
    }

    public toString = () : string => {
        return "("+this.x+", "+this.y+", "+this.z+")";
    }
}

export var cubic_directions = [
   new Cubic(new Pair(0,1)), new Cubic(new Pair(-1,1)), new Cubic(new Pair(-1,0)),
   new Cubic(new Pair(-1,-1)), new Cubic(new Pair(0,-1)), new Cubic(new Pair(1,0))
]

//Debido a que indexOf de los array iguala con ===, no es posible saber si un objeto está dentro de un array sino es identicamente el mismo objeto
//por eso se ha creado este método auxiliar para ayudar al cálculo
export function myIndexOf(arr: Array<Pair>, o: Pair) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].column == o.column && arr[i].row == o.row) {
            return i;
        }
    }
    return -1;
}

//Igual que el de arriba pero para cúbica
export function myIndexOfCubic(arr: Array<Cubic>, o: Cubic) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].getX() == o.getX() && arr[i].getY() == o.getY() && arr[i].getZ() == o.getZ()) {
            return i;
        }
    }
    return -1;
}
