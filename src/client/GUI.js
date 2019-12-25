import 'phaser';
import { myPlayer } from './scenes/GameScene';

export class UIScene extends Phaser.Scene {

    constructor() {
        super('UI');
        this.barWidth = 0;
        this.barHeight = 16;

        this.barAlpha = 0.4;
        this.barDisplayWidth = 1; // percentage width of game screen
        this.innerBarDisplayWidth = 0.995;
        this.innerBarDisplayHeight = 0.6;

        this.barCurrentExp = 0;
        this.barExpToLevel = 0;

        this.barSep = new Array(9);
    }

    preload() {
        this.load.image('expBar', 'assets/sprites/icons/inventorySlot.png');
    }

    create() {
        this.xpBarBack = this.add.sprite(0, 0, 'expBar');
        this.xpBarBack.alpha = this.barAlpha;
        this.xpBarBack.tint = 0x000000;
        this.xpBarBack.setOrigin(0);

        this.xpBarFront1 = this.add.sprite(0, 0, 'expBar');
        this.xpBarFront1.alpha = this.barAlpha;
        this.xpBarFront1.setOrigin(0);

        this.xpBarFront2 = this.add.sprite(0, 0, 'expBar');
        this.xpBarFront2.alpha = this.barAlpha;
        this.xpBarFront2.tint = 0xffff00;
        this.xpBarFront2.setOrigin(0);

        for(let i=1;i<10;i++) {
            this.barSep[i] = this.add.sprite(0, 0, 'expBar');
            this.barSep[i].alpha = this.barAlpha;
            this.barSep[i].tint = 0x000000;
            this.barSep[i].setOrigin(0);
        }




        this.onResize();
    }

    onResize() {
        let p = myPlayer();

        this.barWidth = this.game.canvas.width * this.barDisplayWidth;
        this.barStartY = this.game.canvas.height - this.barHeight;
        this.xpPercent = this.barCurrentExp / this.barExpToLevel;

        this.xpBarBack.displayWidth = this.barWidth;
        this.xpBarBack.displayHeight = this.barHeight;

        this.xpBarFront1.displayWidth = this.barWidth * this.innerBarDisplayWidth;
        this.xpBarFront1.displayHeight = this.barHeight * this.innerBarDisplayHeight;
        this.xpBarFront2.displayWidth = this.barWidth * this.innerBarDisplayWidth * (this.xpPercent);
        this.xpBarFront2.displayHeight = this.barHeight * this.innerBarDisplayHeight;

        this.barWidthDifference = this.xpBarBack.displayWidth - this.xpBarFront1.displayWidth;
        this.barHeightDifference = this.xpBarBack.displayHeight - this.xpBarFront1.displayHeight;

        this.xpBarBack.y = this.barStartY;
        this.xpBarFront1.x = (this.barWidthDifference / 2);
        this.xpBarFront1.y = this.barStartY + (this.barHeightDifference / 2);
        this.xpBarFront2.x = (this.barWidthDifference / 2);
        this.xpBarFront2.y = this.barStartY + (this.barHeightDifference / 2);


        for(let i=1;i<10;i++) {
            this.barSep[i].displayWidth = 3;
            this.barSep[i].displayHeight = this.xpBarFront1.displayHeight;
            this.barSep[i].x = i * (this.xpBarBack.displayWidth / 10);
            this.barSep[i].y = this.xpBarFront1.y;
        }

        this.xpBarFront1.setOrigin(0);


    }

    update() {
        let p = myPlayer();

        if(this.barWidth != this.cameras.main.width || this.xpBarBack.y != this.game.canvas.height - this.barHeight) {
            this.onResize();
        }

        if(p) {
            if(p.currentExp != this.barCurrentExp || p.expToLevel != this.barExpToLevel) {
                this.barCurrentExp = p.currentExp;
                this.barExpToLevel = p.expToLevel;
                this.onResize();
            }
        }
    }

}