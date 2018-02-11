import { Pair } from './Utils';
import { Terrain } from './Terrains';

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
    calculateAttack(defendingUnit: Unit, defenseWeakBonus: number,
         defenseStrongBonus: number, attackWeakBonus: number,
         attackStrongBonus: number): number {
        let healthRemoved: number = 0;
        // Calculamos las defensas
        let calculatedWeakDefense = defendingUnit.defenseWeak + defenseWeakBonus;
        // Si la defensa débil es menor a 0
        if(calculatedWeakDefense < 0) {
            // Entonces restauramos a 0
            calculatedWeakDefense = 0;
        }
        // Realizamos lo mismo con la defensa fuerte
        let calculatedStrongDefense = defendingUnit.defenseStrong + defenseStrongBonus;
        if(calculatedStrongDefense < 0) {
            calculatedStrongDefense = 0;
        }
        // En ambos casos, en el caso de que el ataque sea negativo,
        // no se cumplirá la regla y no importará que sea negativo
        if (this.attackWeak + attackWeakBonus > calculatedWeakDefense) {
            healthRemoved += this.attackWeak - calculatedWeakDefense;
        }
        if (this.attackStrong + attackStrongBonus > calculatedStrongDefense) {
            healthRemoved += this.attackStrong - calculatedStrongDefense;
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
