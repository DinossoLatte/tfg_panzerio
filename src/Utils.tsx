export class Pair {
    x : any;
    y : any;

    constructor(x: any, y: any) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setX(x: any) {
        this.x = x;
    }

    setY(y: any) {
        this.y = y;
    }
}
