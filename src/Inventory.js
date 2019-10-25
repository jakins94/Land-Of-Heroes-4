import 'phaser';
//import Game from './index';

export class InvScene extends Phaser.Scene {

    constructor() {
        super('Inv');

        this.inventoryOpen = false;
    }

    preload() {
        this.load.image('invSlot', 'assets/sprites/icons/inventorySlot.png');
        this.load.image('invBack', 'assets/sprites/icons/inventoryBack.png');
    }

    create() {
        const invWidthScale = 0.3;

        this.invBack = this.add.sprite(this.scale.width - (this.scale.width * invWidthScale), 0, 'invBack');
        this.invBack.displayWidth = this.scale.width * invWidthScale;
        this.invBack.setOrigin(0);
        this.invBack.displayHeight = this.game.config.height;
        this.invBack.alpha = 0.35;
        this.invBack.tint = 0x000000;
        this.invBack2 = this.add.sprite(this.scale.width - (this.scale.width * invWidthScale)+1, 0, 'invBack');
        this.invBack2.displayWidth = this.scale.width * invWidthScale;
        this.invBack2.setOrigin(0);
        this.invBack2.displayHeight = this.game.config.height;
        this.invBack2.alpha = 0.35;
        //this.invBack2.tint = 0x000000;


        this.nameBack = this.add.sprite(this.scale.width - (this.scale.width * (invWidthScale / 2)), 40, 'invSlot');
        this.nameBack.displayWidth = this.scale.width * (invWidthScale / 1.2);
        this.nameBack.displayHeight = this.scale.width * 0.04;
        this.nameBack.alpha = 0.4;
        
        this.nameBack2 = this.add.sprite(this.scale.width - (this.scale.width * (invWidthScale / 2))-2, 38, 'invSlot').setInteractive();
        this.nameBack2.displayWidth = this.scale.width * (invWidthScale / 1.2);
        this.nameBack2.displayHeight = this.scale.width * 0.04;
        this.nameBack2.alpha = 0.4;
        this.nameBack.tint = 0x000000;

	    let invNameStyle = { font: "24px prstartk", fill: "white", align: "center" };        
        this.nameText = this.add.text(this.scale.width - (this.scale.width * (invWidthScale / 2)), 40, 'JAMES', invNameStyle)
        this.nameText.setOrigin(0.5);

        this.statsBack = this.add.sprite(this.scale.width - (this.scale.width * (invWidthScale / 2)), 300, 'invSlot');
        this.statsBack.displayWidth = this.scale.width * (invWidthScale / 1.2);
        this.statsBack.displayHeight = this.scale.width * 0.15;
        this.statsBack.alpha = 0.4;
        
        this.statsBack2 = this.add.sprite(this.scale.width - (this.scale.width * (invWidthScale / 2))-2, 298, 'invSlot').setInteractive();
        this.statsBack2.displayWidth = this.scale.width * (invWidthScale / 1.2);
        this.statsBack2.displayHeight = this.scale.width * 0.15;
        this.statsBack2.alpha = 0.4;
        this.statsBack.tint = 0x000000;


        this.input.setDefaultCursor('url(assets/sprites/icons/cursor.png), pointer');

        this.nameBack2.on('pointerover', () => {
            this.nameBack.alpha = 0.65;
        });
        this.nameBack2.on('pointerout', () => {
            this.nameBack.alpha = 0.4;
        });
        this.statsBack2.on('pointerover', () => {
            this.statsBack.alpha = 0.65;
        });
        this.statsBack2.on('pointerout', () => {
            this.statsBack.alpha = 0.4;
        });

        this.input.keyboard.on('keydown', (event) => {
            if(event.code == 'KeyI') {
                this.toggleInventory();
            }
        });

        this.startInventory();
    }

    update() {

    }

    startInventory() {
        this.scene.get('Inv');
        this.scene.setVisible(false, 'Inv');
        this.statsBack2.removeInteractive();
        this.nameBack2.removeInteractive();
    }

    toggleInventory() {

        if(this.inventoryOpen) {
            this.inventoryOpen = false;
            this.statsBack2.removeInteractive();
            this.nameBack2.removeInteractive();
            this.scene.get('Inv');
            this.scene.setVisible(false, 'Inv');
        } else {
            this.inventoryOpen = true;
            this.scene.get('Inv');
            this.scene.setVisible(true, 'Inv');
            this.statsBack2.setInteractive();
            this.nameBack2.setInteractive();
        }
    }

}

export default class Inventory {
    constructor(scene){


        this.GameScene = scene;



        /*let bmd = this.add.bitmapData(50, 50);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, 50, 50);
            bmd.ctx.fillStyle = '#FFFFFF';
            bmd.ctx.fill();*/
        //let bmd = this.textures.addCanvas('test');


        this.inventoryOpen = false;


        //this.invWidth = (this.game.camera.view.width / 3);
        //this.invHeight = this.game.camera.view.height;
        //this.invStartX = (this.game.camera.view.width - invWidth) + 2;

        /*this.invWidth = 300;
        this.invHeight = 800;
        this.invStartX = 750;

        this.invAlpha = 0.5;

        // stat box and stat text variables
        this.statBoxWidth = invWidth - 20;
        this.statBoxHeight = 125;
        this.statStartX = invStartX + 10;
        this.statStartY = 200;
        this.statSpacingY = 15;
        this.statShadowDistX = 1;
        this.statShadowDistY = 1;
        this.statShadowBlur = 1;
        this.statAnchorX = 0;
        this.statAnchorY = 0;
        this.statAlpha = 0.5;

        // name box variables
        this.nameBoxWidth = invWidth - 20;
        this.nameBoxHeight = 30;
        this.nameBoxStartX = invStartX + 10;
        this.nameBoxStartY = 10;

        // item box variables
        this.itemStartX = statStartX - 2;
        this.itemStartY = statStartY + statBoxHeight + 10;
        this.itemWidth = 32;
        this.itemHeight = 32;
        this.itemSpacing = 4;
        this.itemSlots = 36;

        // equipment box variables
        this.equipWidth = 32;
        this.equipHeight = 32;
        this.equipSpacing = 8;
        this.equipStartX = invStartX - equipSpacing - equipWidth + (invWidth / 2) - 15;
        this.equipStartY = 60;
        this.equipSlots;


        // placeholder stats
        this.maxHP           = Math.round(Math.random() * 600);
        this.HP              = maxHP;
        this.maxMP           = Math.round(Math.random() * 600);
        this.MP              = maxMP;
        this.strength        = Math.round(Math.random() * 120);
        this.dexterity       = Math.round(Math.random() * 120);
        this.intelligence    = Math.round(Math.random() * 120);


        this.itemSlotShadow = [];
        this.itemSlot = [];
        this.equipSlotShadow = [];
        this.equipSlot = [];*/

    }

    toggleInventory() {
        if(this.inventoryOpen) {
            this.inventoryOpen = false;
            InvScene.scene.stop('Inv');
        } else {
            this.inventoryOpen = true;
            InvScene.scene.start('Inv');
        }
    }

    startInventory() {
        //this.test = this.GameScene.add.sprite(0, 0, 'invSlot');
        //this.test.setScrollFactor(0);
    }

}