import { Unit } from './Unit';
import { store } from './Store';
import { Terrain } from './Terrains';
import { Map } from './Map';
import { State } from './GameState';

export class Army {
    army : Array<string>;
    name : string;

    constructor(army: Array<string>, name: string) {
        this.army = army;
        this.name = name;
    }

    getArmy() {
        return this.army;
    }

    getName() {
        return this.name;
    }

    setArmy(army: Array<string>) {
        this.army = army;
    }

    setName(name: string) {
        this.name = name;
    }

}
