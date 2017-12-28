import { Pair } from './Utils';

export class Unit {
    name: string;
    type: string; // Imagen de la unidad
    movement: number; // Movimiento
    position: Pair;
    player: boolean; //Unidad jugadora
    // - A partir de aqui ponemos los atributos de ataque y defensa
    attackWeak: number;
    attackStrong: number;
    defenseWeak: number;
    defenseStrong: number;
    health: number; // Cantidad de vida

    constructor(name: string, type: string, movement: number, position: Pair, player: boolean, attackWeak: number, attackStrong: number, defenseWeak: number, defenseStrong: number, health: number) {
        this.name = name;
        this.type = type;
        this.movement = movement;
        this.position = position;
        this.player = player;
        this.attackWeak = attackWeak;
        this.attackStrong = attackStrong;
        this.defenseWeak = defenseWeak;
        this.defenseStrong = defenseStrong;
        this.health = health;
    }

    // Esta función calculará la cantidad de vida eliminada de la unidad defendiendo.
    calculateAttack(defendingUnit: Unit): number {
        let healthRemoved: number = 0;
        if (this.attackWeak > defendingUnit.defenseWeak) {
            healthRemoved += this.attackWeak - defendingUnit.defenseWeak;
        }
        if (this.attackStrong > defendingUnit.defenseStrong) {
            healthRemoved += this.attackStrong - defendingUnit.defenseStrong;
        }
        return healthRemoved;
    }
}

export class Infantry extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("Infantry", "unit", 2, position, player,
        // Características de ataque débil y fuerte
         2, 2,
        // Características de defensa débil y fuerte
         1, 2,
        // Vida
        2);
    }
}

export class Tank extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("Tank", "tank", 1, position, player,
        // Características de ataque débil y fuerte
         2, 3,
        // Características de defensa débil y fuerte
         2, 1,
        // Vida
        3);
    }
}

export class General extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("General", "general", 0, position, player,
        // Características de ataque débil y fuerte
         1, 0,
        // Características de defensa débil y fuerte
         1, 2,
        // Vida
        2);
    }
}
