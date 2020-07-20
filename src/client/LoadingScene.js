import 'phaser';


export class LoadingScene extends Phaser.Scene {
    constructor() {
        super('Loading');

    }

    create() {
        this.bg = this.add.sprite(0, 0, 'blank');
        this.bg.displayWidth = this.cameras.main.width;
        this.bg.displayHeight = this.cameras.main.height;
        this.bg.tint = 0x000000;
        this.bg.depth = 10000;
        this.bg.setOrigin(0);

        this.loadingText = this.add.bitmapText(0,0,'prstart','Loading your greatest adventure!');
        this.loadingText.x = this.cameras.main.width / 2;
        this.loadingText.y = this.cameras.main.height / 1.25;
        this.loadingText.depth = 10004;
        this.loadingText.setFontSize(40);
        this.loadingText.setOrigin(0.5);

        this.loadingSplash = this.add.sprite(0, 0, 'loadingSplash');
        this.loadingSplash.setScale(2, 2);
        this.loadingSplash.depth = 10003;
        this.loadingSplash.x = this.cameras.main.width / 2;
        this.loadingSplash.y = this.cameras.main.height / 2;
        this.loadingSplash.setOrigin(0.5);

        this.tweens.add({
            targets: this.loadingText,
            alpha: 0.3,
            duration: 1000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
    }

}
