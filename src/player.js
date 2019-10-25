import 'phaser';

export default class Player {
    constructor() {
        this.x = 400;
        this.y = 150;
        this.movingX = this.x;
        this.movingY = this.y;
        this.moving = false;
        this.sprite;
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}