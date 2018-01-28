import { Pair } from './Utils';

export class Terrain {
    name: string;
    image: string; // Imagen del terreno
    movement_penalty: number; // Penalización al movimiento, si es -1 será un obstáculo impasable
    position: Pair;

    constructor(name: string, image: string, movement_penalty: number, position: Pair) {
        this.name = name;
        this.image = image;
        this.movement_penalty = movement_penalty;
        this.position = position;
    }
}

export class Plains extends Terrain {
    static create(position: Pair) : Terrain {
        return new Terrain("Plains", "imgs/terrain_plains.png", 1, position);
    }
}

export class ImpassableMountain extends Terrain {
    static create(position: Pair) : Terrain {
        return new Terrain("Mountains", "imgs/terrain_mountain.png", -1, position);
    }
}

export class Hills extends Terrain {
    static create(position: Pair) : Terrain {
        return new Terrain("Hills", "imgs/terrain_hills.png", 2, position);
    }
}

export class Forest extends Terrain {
    static create(position: Pair) : Terrain {
        return new Terrain("Forest", "imgs/terrain_forest.png", 1, position);
    }
}
