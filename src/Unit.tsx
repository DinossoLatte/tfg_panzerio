import { Pair } from './Utils';

export class Unit {
    name: string;
    type: string; // Imagen de la unidad
    movement: number; // Movimiento
    position: Pair;
    player: boolean; //Unidad jugadora
    used: boolean; //Si la unidad ha sido usada en este turno valdrá true
    hasAttacked: boolean;
    // - A partir de aqui ponemos los atributos de ataque y defensa
    attackWeak: number;
    attackStrong: number;
    defenseWeak: number;
    defenseStrong: number;
    health: number; // Cantidad de vida
    range: number; // Alcance del ataque
    action: number; //Variable que indica si está en movimiento (0), ataque (1) o usada (2)

    constructor(name: string, type: string, movement: number, position: Pair, player: boolean, used: boolean, attackWeak: number, attackStrong: number, defenseWeak: number, defenseStrong: number, health: number, range: number, action: number, hasAttacked?: boolean) {
        this.name = name;
        this.type = type;
        this.movement = movement;
        this.position = position;
        this.player = player;
        this.used = used;
        this.attackWeak = attackWeak;
        this.attackStrong = attackStrong;
        this.defenseWeak = defenseWeak;
        this.defenseStrong = defenseStrong;
        this.health = health;
        this.range = range;
        this.hasAttacked = hasAttacked?hasAttacked:false;
        this.action = action;
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
        return new Unit("Infantry", "infantry", 2, position, player, false,
        // Características de ataque débil y fuerte
         2, 2,
        // Características de defensa débil y fuerte
         1, 2,
        // Vida
        2,
        // Alcance
        1,
        0);
    }
}

export class Tank extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("Tank", "tank", 1, position, player, false,
        // Características de ataque débil y fuerte
         2, 3,
        // Características de defensa débil y fuerte
         2, 1,
        // Vida
        4,
        // Alcance
        1,
        0);
    }
}

export class General extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("General", "general", 1, position, player, false,
        // Características de ataque débil y fuerte
         1, 0,
        // Características de defensa débil y fuerte
         1, 2,
        // Vida
        2,
        // Alcance
        0,
        0);
    }
}

export class Paratrooper extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("Paratrooper", "paratrooper", 5, position, player, false,
        // Características de ataque débil y fuerte
         3, 4,
        // Características de defensa débil y fuerte
         1, 2,
        // Vida
        3,
        // Alcance
        1,
        0);
    }
}

export class Artillery extends Unit {
    static create(position: Pair, player: boolean) : Unit {
        return new Unit("Artillery", "artillery", 2, position, player, false,
        // Características de ataque débil y fuerte
         2, 3,
        // Características de defensa débil y fuerte
         2, 2,
        // Vida
        3,
        // Alcance
        3,
        0);
    }
}

export const UNITS = [
    "General", "Infantry", "Tank",
    "Artillery", "Paratrooper"
];

export const UNITS_ESP = [
    "General", "Infantería", "Tanque",
    "Artillería", "Paracaidista"
];
