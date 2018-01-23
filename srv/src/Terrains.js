"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Terrain {
    constructor(name, image, movement_penalty, position) {
        this.name = name;
        this.image = image;
        this.movement_penalty = movement_penalty;
        this.position = position;
    }
}
exports.Terrain = Terrain;
class Plains extends Terrain {
    static create(position) {
        return new Terrain("Plains", "imgs/terrain_plains.png", 0, position);
    }
}
exports.Plains = Plains;
class ImpassableMountain extends Terrain {
    static create(position) {
        return new Terrain("Mountains (impassable)", "imgs/terrain_mountain.png", -1, position);
    }
}
exports.ImpassableMountain = ImpassableMountain;
class Hills extends Terrain {
    static create(position) {
        return new Terrain("Hills", "imgs/terrain_hills.png", 2, position);
    }
}
exports.Hills = Hills;
class Forest extends Terrain {
    static create(position) {
        return new Terrain("Forest", "imgs/terrain_forest.png", 1, position);
    }
}
exports.Forest = Forest;
