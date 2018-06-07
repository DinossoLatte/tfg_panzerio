import { Unit } from './Unit'

export class Army {
    // La lista de unidades será el tipo y el número de unidades de ese tipo
    unitList : Array<{ type: string, number: number }>; // TODO Mejorar, convertir a Unit
    name : string;

    constructor(army: Array<{ type: string, number: number }>, name: string) {
        this.unitList = army;
        this.name = name;
    }
}
