import { Pair } from './Utils';

export class Unit {
    name: string;
    type: string; // Imagen de la unidad
    movement: number; // Movimiento
    position: Pair;
    player: boolean; //Unidad jugadora
    used: boolean; //Si la unidad ha sido usada en este turno valdrá true

    constructor(name: string, type: string, movement: number, position: Pair, player: boolean, used: boolean) {
        this.name = name;
        this.type = type;
        this.movement = movement;
        this.position = position;
        this.player = player;
        this.used = used;
    }
}

export class Infantry extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("Infantry", "unit", 2, position, player, false);
    }
}

export class Tank extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("Tank", "tank", 1, position, player, false);
    }
}

export class General extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("General", "general", 0, position, player, false);
    }
}
