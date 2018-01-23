"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Unit {
    constructor(name, type, movement, position, player, used, attackWeak, attackStrong, defenseWeak, defenseStrong, health, range, action, hasAttacked) {
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
        this.hasAttacked = hasAttacked ? hasAttacked : false;
        this.action = action;
    }
    // Esta función calculará la cantidad de vida eliminada de la unidad defendiendo.
    calculateAttack(defendingUnit) {
        let healthRemoved = 0;
        if (this.attackWeak > defendingUnit.defenseWeak) {
            healthRemoved += this.attackWeak - defendingUnit.defenseWeak;
        }
        if (this.attackStrong > defendingUnit.defenseStrong) {
            healthRemoved += this.attackStrong - defendingUnit.defenseStrong;
        }
        return healthRemoved;
    }
}
exports.Unit = Unit;
class Infantry extends Unit {
    static create(position, player) {
        return new Unit("Infantry", "unit", 2, position, player, false, 
        // Características de ataque débil y fuerte
        2, 2, 
        // Características de defensa débil y fuerte
        1, 2, 
        // Vida
        2, 
        // Alcance
        1, 0);
    }
}
exports.Infantry = Infantry;
class Tank extends Unit {
    static create(position, player) {
        return new Unit("Tank", "tank", 1, position, player, false, 
        // Características de ataque débil y fuerte
        2, 3, 
        // Características de defensa débil y fuerte
        2, 1, 
        // Vida
        3, 
        // Alcance
        1, 0);
    }
}
exports.Tank = Tank;
class General extends Unit {
    static create(position, player) {
        return new Unit("General", "general", 1, position, player, false, 
        // Características de ataque débil y fuerte
        1, 0, 
        // Características de defensa débil y fuerte
        1, 2, 
        // Vida
        2, 
        // Alcance
        0, 0);
    }
}
exports.General = General;
