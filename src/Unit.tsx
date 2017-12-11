import { Pair } from './Utils';

export class Unit {
    name: string;
    type: string; // Imagen de la unidad
    movement: number; // Movimiento
    position: Pair;
    player: boolean; //Unidad jugadora

    constructor(name: string, type: string, movement: number, position: Pair, player: boolean) {
        this.name = name;
        this.type = type;
        this.movement = movement;
        this.position = position;
        this.player = player;
    }
}

export class Infantry extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("Infantry", "unit", 2, position, player);
    }
}

export class Tank extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("Tank", "tank", 1, position, player);
    }
}
