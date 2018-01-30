import { Pair } from './Utils';

export class Terrain {
    name: string;
    image: string; // Imagen del terreno
    movement_penalty: number; // Penalización al movimiento, si es -1 será un obstáculo impasable
    position: Pair;
    defenseWeak: number;
    defenseStrong: number;

    constructor(name: string, image: string, movement_penalty: number, position: Pair, defenseWeak: number, defenseStrong: number) {
        this.name = name;
        this.image = image;
        this.movement_penalty = movement_penalty;
        this.position = position;
        this.defenseWeak = defenseWeak;
        this.defenseStrong = defenseStrong;
    }
}

export class Plains extends Terrain {
    static create(position: Pair) : Terrain {
        return new Terrain("Plains", "imgs/terrain_plains.png", 1, position, 0, 0);
    }
}

export class ImpassableMountain extends Terrain {
    static create(position: Pair) : Terrain {
        // Al no ser accesible, la defensa es innecesaria
        return new Terrain("Mountains", "imgs/terrain_mountain.png", -1, position, 0, 0);
    }
}

export class Hills extends Terrain {
    static create(position: Pair) : Terrain {
        return new Terrain("Hills", "imgs/terrain_hills.png", 2, position, 1, 1);
    }
}

export class Forest extends Terrain {
    static create(position: Pair) : Terrain {
        return new Terrain("Forest", "imgs/terrain_forest.png", 1, position, 2, 0);
    }
}
