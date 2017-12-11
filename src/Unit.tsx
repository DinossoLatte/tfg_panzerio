import { Pair } from './Utils';

export class Unit {
    name: string;
    type: string; // Imagen de la unidad
    movement: number; // Movimiento
    position: Pair;

    constructor(name: string, type: string, movement: number, position: Pair) {
        this.name = name;
        this.type = type;
        this.movement = movement;
        this.position = position;
    }
}

export class Infantry extends Unit {
    static create(position: Pair) : Unit {
        return new Unit("Infantry", "unit", 2, position);
    }
}

export class Tank extends Unit {
    static create(position: Pair) : Unit {
        return new Unit("Tank", "tank", 1, position);
    }
}
