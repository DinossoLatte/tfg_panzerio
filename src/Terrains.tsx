import { Pair } from './Utils';

//Para crear un nuevo terreno se crea una nueva clase para que sea llamada para la creación del terreno y se añade en las constantes que se encuentra al final de este código

export class Terrain {
    name: string;
    image: string; // Imagen del terreno
    movement_penalty: number; // Penalización al movimiento, si es -1 será un obstáculo impasable
    position: Pair;
    defenseWeak: number;
    defenseStrong: number;
    attackWeak: number;
    attackStrong: number;

    constructor(name: string, image: string, movement_penalty: number, position: Pair,
        defenseWeak: number, defenseStrong: number, attackWeak: number, attackStrong: number) {
        this.name = name;
        this.image = image;
        this.movement_penalty = movement_penalty;
        this.position = position;
        this.defenseWeak = defenseWeak;
        this.defenseStrong = defenseStrong;
        this.attackWeak = attackWeak;
        this.attackStrong = attackStrong;
    }
}

export class Plains extends Terrain {
    static create(position: Pair) : Terrain {
        return new Terrain("Plains", "imgs/terrain_plains.png", 1, position, 0, 0, 0, 0);
    }
}

export class ImpassableMountain extends Terrain {
    static create(position: Pair) : Terrain {
        // Al no ser accesible, la defensa es innecesaria
        return new Terrain("Mountains", "imgs/terrain_mountain.png", -1, position, 0, 0, 0, 0);
    }
}

export class Hills extends Terrain {
    static create(position: Pair) : Terrain {
        return new Terrain("Hills", "imgs/terrain_hills.png", 2, position, 1, 1, 0, 1);
    }
}

export class Forest extends Terrain {
    static create(position: Pair) : Terrain {
        return new Terrain("Forest", "imgs/terrain_forest.png", 1, position, 2, 0, 0, 0);
    }
}

export class River extends Terrain {
    static create(position: Pair): Terrain {
        return new Terrain("River", "imgs/terrain_river.png", 1, position, -1, -1, 0, 0);
    }
}

//Una vez creada una nueva clase para un terreno es necesario añadirlo en estas constante e interfaz para que se refleje en toda la aplicación
export const TERRAINS = [
    "Plains", "Mountains", "Hills",
    "Forest", "River"
];

export const TERRAINS_ESP = [
    "Llanura", "Montaña", "Colina",
    "Bosque", "Río"
];

export interface TERR_CREATE {
    [sel: string]: any;
    Plains: typeof Plains;
    Mountains: typeof ImpassableMountain;
    Hills: typeof Hills;
    Forest: typeof Forest;
    River: typeof River;
}

export const TERRAINS_CREATE : TERR_CREATE = {
    Plains : Plains,
    Mountains: ImpassableMountain,
    Hills: Hills,
    Forest: Forest,
    River: River,
}
