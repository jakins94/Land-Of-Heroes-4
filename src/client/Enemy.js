export default class Enemy {
    constructor(data) {
		this.name = data.name;
		this.spriteName = data.spriteName;
		this.id = data.id;
		this.target = -1;
		this.maxHP = data.maxhp;
		this.HP = data.maxhp;
		this.strength = 1;
		this.startX = data.x;
		this.startY = data.y;
		this.x = data.x;
		this.y = data.y;
		this.destX = this.x;
		this.destY = this.y;
		this.movingX = this.x;
		this.movingY = this.y;
		this.lastAttack = 0;
		this.attackRange = 45;
		this.followDistance = 500;
		this.speed = 2;
		this.alive = true;
		this.attackSpeed = 750;
		this.healthBar = null;
		this.destroyTimer = -1;
		this.moving = false;
		this.scaleX = 1;
		this.scaleY = 1;

        this.sprite = null;
        this.healthBarBack = null;
        this.healthBarFront = null;

		this.hitArray = [];
	}
	
	remove() {
		/*this.stop();
		nameText.destroy();
		this.healthBar.kill();
		for(var i=0;i<this.hitArray.length;i++) {
			this.hitArray[i][0].destroy();
		}*/
		this.sprite.destroy();
		this.healthBarBack.destroy();
		this.healthBarFront.destroy();
		this.nameText.destroy();
	}
	distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}