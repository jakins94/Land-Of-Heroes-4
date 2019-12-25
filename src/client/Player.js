export default class Player {
    constructor(name, pid, x, y, mapId) {
        this.pid = pid;
        this.name = name;
        this.x = x;
        this.y = y;
        this.mapId = mapId;
        this.movingX = this.x;
        this.movingY = this.y;
        this.moving = false;
        this.sprite;
        this.lastChatTime = 0;
        this.lastChatText = '';
        this.chatText;
        this.chatSprite;
        this.target = -1;
        this.scale = 0.7;
        this.attackRange = 45;
        this.currentExp = 0;
        this.expToLevel = 240;
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}