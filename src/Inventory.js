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
        this.load.image('bronzeSword', 'assets/sprites/items/bronzeSword.png');
        this.load.image('bronzeHelm', 'assets/sprites/items/bronzeHelm.png');
        this.load.image('bronzeLegs', 'assets/sprites/items/bronzeLegs.png');
        this.load.image('cape', 'assets/sprites/items/cape.png');
        this.load.image('ring', 'assets/sprites/items/ring.png');
        this.load.image('necklace', 'assets/sprites/items/necklace.png');
        this.load.image('coins', 'assets/sprites/items/coins.png');


    }

    create() {
        this.invWidthScale = 0.35;

        this.invWidth = this.scale.width * this.invWidthScale; // inventory width is 30% of game screen
        this.invStartX = this.scale.width - this.invWidth; // where inventory starts

        this.invBack = this.add.sprite(this.invStartX, 0, 'invBack');
        this.invBack.displayWidth = this.scale.width * this.invWidthScale;
        this.invBack.setOrigin(0);
        this.invBack.displayHeight = this.game.config.height;
        this.invBack.alpha = 0.35;
        this.invBack.tint = 0x000000;
        this.invBack2 = this.add.sprite(this.invStartX + 1, 1, 'invBack');
        this.invBack2.displayWidth = this.scale.width * this.invWidthScale;
        this.invBack2.setOrigin(0);
        this.invBack2.displayHeight = this.game.config.height;
        this.invBack2.alpha = 0.35;
        //this.invBack2.tint = 0x000000;

        this.nameBoxStartX = this.invStartX + 20;
        this.nameBoxStartY = this.cameras.main.height * 0.025;
        this.nameBoxWidth = this.invWidth - 40;
        this.nameBoxHeight = this.cameras.main.height * 0.05;

        this.nameBox = this.add.sprite(this.nameBoxStartX, this.nameBoxStartY, 'invSlot');
        this.nameBox.displayWidth = this.nameBoxWidth;
        this.nameBox.displayHeight = this.nameBoxHeight;
        this.nameBox.setOrigin(0);
        this.nameBox.alpha = 0.4;
        
        this.nameBox2 = this.add.sprite(this.nameBoxStartX+2, this.nameBoxStartY+2, 'invSlot');
        this.nameBox2.displayWidth = this.nameBoxWidth;
        this.nameBox2.displayHeight = this.nameBoxHeight;
        this.nameBox2.alpha = 0.4;
        this.nameBox2.setOrigin(0);
        this.nameBox.tint = 0x000000;

	    this.invNameStyle = { font: "24px prstartk", fill: "white"};
        this.nameText = this.add.text(this.scale.width - (this.scale.width * (this.invWidthScale / 2)), 40, 'Inventory', this.invNameStyle)
        this.nameText.setOrigin(0.5);


        this.statBoxStartX = this.invStartX + 20;
        this.statBoxStartY = this.cameras.main.height * 0.5;
        this.statBoxWidth = this.invWidth - 40;
        this.statBoxHeight = this.cameras.main.height * 0.25;

        this.statBox = this.add.sprite(this.statBoxStartX, this.statBoxStartY, 'invSlot');
        this.statBox.displayWidth = this.statBoxWidth;
        this.statBox.displayHeight = this.statBoxHeight;
        this.statBox.setOrigin(0);
        this.statBox.alpha = 0.4;
        
        this.statBox2 = this.add.sprite(this.statBoxStartX, this.statBoxStartY, 'invSlot');
        this.statBox2.displayWidth = this.statBoxWidth - 2;
        this.statBox2.displayHeight = this.statBoxHeight - 2;
        this.statBox2.setOrigin(0);
        this.statBox2.alpha = 0.4;
        this.statBox.tint = 0x000000;

        this.itemStartX = this.statBoxStartX - 2;
        this.itemStartY = this.statBoxStartY + this.statBoxHeight + 10;
        this.itemWidth = (this.invWidth - 40) / 6;
        this.itemHeight = this.itemWidth;
        this.itemSpacing = 4;
        this.totalItems = 30;

        let currSlotX = this.itemStartX,
            currSlotY = this.itemStartY;
        
        this.itemSlot = [];
        this.itemSlot2 = [];

        this.myItems = ['bronzeHelm', 'bronzeLegs', 'bronzeSword', 'cape', 'ring', 'necklace', 'coins'];
        this.myInv = [];

		for(let i=0;i<this.totalItems;i++) {
			if(currSlotX >= this.cameras.main.width - this.itemWidth - this.itemSpacing - 20) {
				currSlotX = this.itemStartX;
				currSlotY += this.itemSpacing + this.itemHeight;
			}
			/*itemSlotShadow[i] = game.add.sprite(currSlotX + 2, currSlotY + 2, bmd);
			itemSlotShadow[i].tint = 0x000000;
	    	itemSlotShadow[i].alpha = 0;
	    	itemSlotShadow[i].fixedToCamera = true;*/
            this.itemSlot[i] = this.add.sprite(currSlotX, currSlotY, 'invSlot');
            this.itemSlot[i].setOrigin(0);
            this.itemSlot[i].alpha = 0.4;
            this.itemSlot[i].tint = 0x000000;
            this.itemSlot2[i] = this.add.sprite(currSlotX - 2, currSlotY - 2, 'invSlot');
            this.itemSlot2[i].setOrigin(0);
            this.itemSlot2[i].alpha = 0.4;

            if(this.myItems[i]) {
                console.log(this.myItems[i])
                this.myInv[i] = this.add.sprite(currSlotX, currSlotY, this.myItems[i]);
                this.myInv[i].setOrigin(0);
            }

            this.itemSlot2[i].on('pointerover', () => {
                this.itemSlot[i].alpha = 0.65;
            });
            this.itemSlot2[i].on('pointerout', () => {
                this.itemSlot[i].alpha = 0.4;
            });

			//itemSlot[i].alpha = 0;
			//itemSlot[i].fixedToCamera = true;

			currSlotX += this.itemSpacing + this.itemWidth;
		}


        this.input.setDefaultCursor('url(assets/sprites/icons/cursor.png), pointer');

        this.nameBox2.on('pointerover', () => {
            this.nameBox.alpha = 0.65;
        });
        this.nameBox2.on('pointerout', () => {
            this.nameBox.alpha = 0.4;
        });
        this.statBox2.on('pointerover', () => {
            this.statBox.alpha = 0.65;
        });
        this.statBox2.on('pointerout', () => {
            this.statBox.alpha = 0.4;
        });

        this.input.keyboard.on('keydown', (event) => {
            if(event.code == 'KeyI') {
                this.toggleInventory();
            }
        });

        this.startInventory();
    }

    resizeInventory() {
        this.invWidth = this.cameras.main.width * this.invWidthScale; // inventory width is 30% of game screen
        this.invStartX = this.cameras.main.width - this.invWidth; // where inventory starts

        this.invBack.x = this.invStartX;
        this.invBack.displayWidth = this.cameras.main.width * this.invWidthScale;
        this.invBack.displayHeight = this.cameras.main.height;
        this.invBack2.x = this.invStartX + 1;
        this.invBack2.displayWidth = this.cameras.main.width * this.invWidthScale;
        this.invBack2.displayHeight = this.cameras.main.height;

        this.nameBoxStartX = this.invStartX + 10;
        this.nameBoxStartY = this.cameras.main.height * 0.025;
        this.nameBoxWidth = this.invWidth - 20;
        this.nameBoxHeight = this.cameras.main.height * 0.05;

        this.nameBox.displayWidth = this.nameBoxWidth;
        this.nameBox.displayHeight = this.nameBoxHeight;
        this.nameBox.x = this.nameBoxStartX;
        this.nameBox.y = this.nameBoxStartY;
        this.nameBox2.displayWidth = this.nameBoxWidth;
        this.nameBox2.displayHeight = this.nameBoxHeight;
        this.nameBox2.x = this.nameBoxStartX - 2;
        this.nameBox2.y = this.nameBoxStartY - 2;

        this.statBoxStartX = this.invStartX + 10;
        this.statBoxStartY = this.nameBoxStartY + this.nameBoxHeight + (this.cameras.main.height * 0.02);
        this.statBoxWidth = this.invWidth - 20;
        this.statBoxHeight = this.cameras.main.height * 0.25;

        this.statBox.displayWidth = this.statBoxWidth;
        this.statBox.displayHeight = this.statBoxHeight;
        this.statBox.x = this.statBoxStartX;
        this.statBox.y = this.statBoxStartY;
        
        this.statBox2.displayWidth = this.statBoxWidth;
        this.statBox2.displayHeight = this.statBoxHeight;
        this.statBox2.x = this.statBoxStartX - 2;
        this.statBox2.y = this.statBoxStartY - 2;

        this.nameText.x = this.nameBoxStartX + (this.nameBoxWidth / 2);
        this.nameText.y = this.nameBoxStartY + (this.nameBoxHeight / 2);

        this.nameText.setFontSize(Math.round((this.cameras.main.width / 70) + (this.cameras.main.height / 55)));

        this.itemStartX = this.statBoxStartX;
        this.itemStartY = this.statBoxStartY + this.statBoxHeight + (this.cameras.main.height * 0.02);
        this.itemWidth = ((this.statBoxWidth - (this.itemSpacing * 5)) / 6);
        this.itemHeight = this.itemWidth;

        let currSlotX = this.itemStartX,
            currSlotY = this.itemStartY;

		for(let i=0;i<this.totalItems;i++) {
			if(currSlotX >= this.statBoxStartX + this.statBoxWidth - 4) {
				currSlotX = this.itemStartX;
				currSlotY += this.itemSpacing + this.itemHeight;
			}
			/*itemSlotShadow[i] = game.add.sprite(currSlotX + 2, currSlotY + 2, bmd);
			itemSlotShadow[i].tint = 0x000000;
	    	itemSlotShadow[i].alpha = 0;
	    	itemSlotShadow[i].fixedToCamera = true;*/
            this.itemSlot[i].x = currSlotX;
            this.itemSlot[i].y = currSlotY;
            this.itemSlot[i].displayWidth = this.itemWidth;
            this.itemSlot[i].displayHeight = this.itemHeight;
            this.itemSlot2[i].x = currSlotX - 2;
            this.itemSlot2[i].y = currSlotY - 2;
            this.itemSlot2[i].displayWidth = this.itemWidth;
            this.itemSlot2[i].displayHeight = this.itemHeight;

            if(this.myInv[i]) {
                this.myInv[i].x = currSlotX;
                this.myInv[i].y = currSlotY;
                this.myInv[i].displayWidth = this.itemWidth;
                this.myInv[i].displayHeight = this.itemHeight;
            }
 
			//itemSlot[i].alpha = 0;
			//itemSlot[i].fixedToCamera = true;

			currSlotX += this.itemSpacing + this.itemWidth;
		}
    }

    update() {

        // update size of the inventory if size of the game screen has changed
        if((this.cameras.main.width * this.invWidthScale) != this.invWidth || this.cameras.main.height != this.invBack.displayHeight) {
               this.resizeInventory();
        }
    }

    startInventory() {
        this.scene.get('Inv');
        this.scene.setVisible(false, 'Inv');
        this.statBox2.removeInteractive();
        this.nameBox2.removeInteractive();
        for(let i=0;i<this.totalItems;i++) {
            this.itemSlot2[i].removeInteractive();
        }
    }

    toggleInventory() {

        if(this.inventoryOpen) {
            this.inventoryOpen = false;
            this.statBox2.removeInteractive();
            this.nameBox2.removeInteractive();
            for(let i=0;i<this.totalItems;i++) {
                this.itemSlot2[i].removeInteractive();
            }
            this.scene.get('Inv');
            this.scene.setVisible(false, 'Inv');
        } else {
            this.resizeInventory();
            this.inventoryOpen = true;
            this.scene.get('Inv');
            this.scene.setVisible(true, 'Inv');
            this.statBox2.setInteractive();
            this.nameBox2.setInteractive();
            for(let i=0;i<this.totalItems;i++) {
                this.itemSlot2[i].setInteractive();
            }
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