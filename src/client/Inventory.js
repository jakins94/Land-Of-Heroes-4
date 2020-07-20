import 'phaser';
import { isChatting } from './ChatHandler';
import { dropItem, equipItem } from './Socket';
import { getItemList, adjustedStat } from './ItemHandler';
import { sceneLoaded } from '../index';

let items = [];

let itemList = getItemList();
let needUpdate = false;

export function setItems(data) {

    items = data;
    console.log(data)
    needUpdate = true;
    
}

export class InvScene extends Phaser.Scene {

    constructor() {
        super('Inv');

        this.inventoryOpen = false;
        this.invWidthScale = 0.35;
        this.items = [];
    }

    preload() {

        this.load.image('invSlot', 'assets/sprites/icons/inventorySlot.png');
        this.load.image('deleteIcon', 'assets/sprites/icons/deleteIcon.png');
        this.load.image('invBack', 'assets/sprites/icons/inventoryBack.png');

        /*this.load.image('bronzeSword', 'assets/sprites/items/bronzeSword.png');
        this.load.image('bronzeHelm', 'assets/sprites/items/bronzeHelm.png');
        this.load.image('bronzeLegs', 'assets/sprites/items/bronzeLegs.png');
        this.load.image('defaultShield', 'assets/sprites/items/defaultShield.png');
        this.load.image('defaultBoots', 'assets/sprites/items/defaultBoots.png');
        this.load.image('defaultBody', 'assets/sprites/items/defaultBody.png');
        this.load.image('rubyRing', 'assets/sprites/items/rubyRing.png');
        this.load.image('leatherGloves', 'assets/sprites/items/leatherGloves.png');
        this.load.image('toothNecklace', 'assets/sprites/items/toothNecklace.png');
        this.load.image('copperDagger', 'assets/sprites/items/copperDagger.png');
        this.load.image('cape', 'assets/sprites/items/cape.png');
        this.load.image('ring', 'assets/sprites/items/ring.png');
        this.load.image('necklace', 'assets/sprites/items/necklace.png');
        this.load.image('coins', 'assets/sprites/items/coins.png');*/


    }

    newSelection(id) {
        if(id == -1) {
            this.selectedItemSprite.alpha = 0;
            this.itemText.text = '';
            this.statsText.text = '';

            this.statBox.alpha = 0;
            this.statBox2.alpha = 0;
            this.deleteIcon.alpha = 0;
            this.useBox1.alpha = 0;
            this.useBox2.alpha = 0;
            this.useText1.alpha = 0;
            this.useText2.alpha = 0;
        } else {

            if(items[id] == '' || typeof items[id] === undefined || !items[id]) {
                this.selectedSlot = -1;
                this.newSelection(-1);
                return;
            }

            this.statBox.alpha = 0.6;
            this.statBox2.alpha = 0.6;

            this.selectedItemSprite.setTexture(itemList[items[id].type][1]);
            this.selectedItemSprite.displayWidth = this.statBoxWidth / 4;
            this.selectedItemSprite.displayHeight = this.statBoxWidth / 4;
            this.selectedItemSprite.alpha = 1;
            this.itemText.text = itemList[items[id].type][0];
            this.statsText.text = '';
            let numStats = items[id].stats.length;
            let numBonuses = items[id].bonuses.length
            if(numStats > 0) {
                for(let i=0;i<numStats;i++) {
                    let stat = adjustedStat(items[id].stats[i][0]);
                    this.statsText.text += items[id].stats[i][1] + ' ' + stat + '\n';
                }
            }
            if(numBonuses > 0) {
                this.statsText.text += '';
                for(let i=0;i<numBonuses;i++) {
                    let stat = adjustedStat(items[id].bonuses[i][0]);
                    this.statsText.text += items[id].bonuses[i][1] + ' ' + stat + '\n';
                }
            }

            this.selectedItemSprite.setOrigin(0);

        }
    }

    create() {

        this.rightClickMenu = this.add.sprite(0, 0, 'invSlot');
        this.rightClickMenu.alpha = 0;
        this.rightClickMenu.tint = 0xffffff;
        this.rightClickMenu.depth = 10;
        this.rightClickMenu.setOrigin(0);

        this.rightClickOption1 = this.add.bitmapText(0, 0, 'prstart', 'Equip').setInteractive();
        this.rightClickOption1.alpha = 0;
        this.rightClickOption1.setOrigin(0);
        this.rightClickOption1.depth = 11;


        this.rightClickOption2 = this.add.bitmapText(0, 0, 'prstart', 'Drop').setInteractive();
        this.rightClickOption2.alpha = 0;
        this.rightClickOption2.setOrigin(0);
        this.rightClickOption2.depth = 11;

        this.rightClickOption3 = this.add.bitmapText(0, 0, 'prstart', 'Cancel').setInteractive();
        this.rightClickOption3.alpha = 0;
        this.rightClickOption3.setOrigin(0);
        this.rightClickOption3.depth = 11;


        this.invBack = this.add.sprite(0, 0, 'invBack');
        this.invBack.setOrigin(0);
        this.invBack.alpha = 0.35;
        this.invBack.tint = 0x000000;
        this.invBack2 = this.add.sprite(0, 0, 'invBack');
        this.invBack2.setOrigin(0);
        this.invBack2.alpha = 0.35;

        this.nameBox = this.add.sprite(0, 0, 'invSlot');
        this.nameBox.setOrigin(0);
        this.nameBox.alpha = 0.4;

        this.nameBox2 = this.add.sprite(0, 0, 'invSlot');
        this.nameBox2.alpha = 0.4;
        this.nameBox2.setOrigin(0);
        this.nameBox.tint = 0x000000;

        this.invNameStyle = { font: "24px prstartk", fill: "white" };
        this.nameText = this.add.bitmapText(0, 0, 'prstart', 'Inventory');

        this.statBox = this.add.sprite(0, 0, 'invSlot');
        this.statBox.setOrigin(0);
        this.statBox.alpha = 0.4;
        this.statBox.tint = 0x000000;

        this.statBox2 = this.add.sprite(0, 0, 'invSlot');
        this.statBox2.setOrigin(0);
        this.statBox2.alpha = 0.4;

        this.deleteIcon = this.add.sprite(0, 0, 'deleteIcon').setInteractive();
        this.deleteIcon.alpha = 0.6;
        this.deleteIcon.setOrigin(0);

        this.deleteIcon.on('pointerdown', () => {
            dropItem(this.selectedSlot);
            this.newSelection(-1);
        });

        this.itemText = this.add.bitmapText(0, 0, 'prstart', 'Bronze Sword');
        this.itemText.setOrigin(0.5);

        let statsTextTest = 'Damage: 2-4\nAccuracy: 4\n+1 to Strength';
        this.statsText = this.add.bitmapText(0, 0, 'prstart', statsTextTest);

        this.useBox1 = this.add.sprite(0, 0, 'invSlot');
        this.useBox1.alpha = 0.3;
        this.useBox1.tint = 0x000000;
        this.useBox1.setOrigin(0);
        this.useBox2 = this.add.sprite(0, 0, 'invSlot');
        this.useBox2.alpha = 0.3;
        this.useBox2.tint = 0x000000;
        this.useBox2.setOrigin(0);

        this.useText1 = this.add.bitmapText(0, 0, 'prstart', 'Use');
        this.useText1.setOrigin(0.5);
        this.useText2 = this.add.bitmapText(0, 0, 'prstart', 'Equip');
        this.useText2.setOrigin(0.5);


        this.itemSpacing = 4;
        this.totalItems = 30;

        this.itemSlot = [];
        this.itemSlot2 = [];

        this.myItems = ['bronzeHelm', 'bronzeLegs', 'bronzeSword'];
        this.myInv = [];

        this.invSlotSelected = {
            id: 0,
            itemName: 'Bronze Sword',
            itemSprite: 'bronzeSword',
            options: {
                1: 'Equip',
                2: 'Drop'
            }
        }

        this.selectedItemSprite = this.add.sprite(0, 0, 'bronzeSword');
        this.selectedItemSprite.alpha = 0;
        this.selectedItemSprite.setOrigin(0);

        for (let i = 0; i < this.totalItems; i++) {

            this.itemSlot[i] = this.add.sprite(0, 0, 'invSlot');
            this.itemSlot[i].setOrigin(0);
            this.itemSlot[i].alpha = 0.4;
            this.itemSlot[i].tint = 0x000000;
            this.itemSlot2[i] = this.add.sprite(0, 0, 'invSlot');
            this.itemSlot2[i].setOrigin(0);
            this.itemSlot2[i].alpha = 0.4;
            this.itemSlot2[i].id = i;

            //if (this.myItems[i]) {
                this.myInv[i] = this.add.sprite(0, 0, 'blank');
                this.myInv[i].setOrigin(0);
            //}

            this.itemSlot2[i].on('pointerover', () => {
                this.itemSlot[i].alpha = 0.65;
            });
            this.itemSlot2[i].on('pointerout', () => {
                this.itemSlot[i].alpha = 0.4;
            });

            this.rightClickOption1.on('pointerdown', () => {
                if(this.selectedSlot != -1)
                    equipItem(this.selectedSlot);
                this.selectedSlot = -1;
                this.newSelection(-1);
                this.removeOptionsMenu();
            });

            this.rightClickOption2.on('pointerdown', () => {
                dropItem(this.selectedSlot);
                this.newSelection(-1);
                this.removeOptionsMenu();
            });

            this.rightClickOption3.on('pointerdown', () => {
                this.removeOptionsMenu();
            });

            this.itemSlot2[i].on('pointerover', (pointer) => {
                this.selectedSlot = this.itemSlot2[i].id;
                this.newSelection(this.selectedSlot);
            });

            this.itemSlot2[i].on('pointerout', (pointer) => {
                //this.selectedSlot = -1;
                this.newSelection(-1);
            });

            this.itemSlot2[i].on('pointerdown', (pointer) => {
                this.selectedSlot = this.itemSlot2[i].id;
                this.newSelection(this.selectedSlot);
                
                if(pointer.rightButtonDown()) {
                    this.rightClickMenu.x = pointer.x;
                    this.rightClickMenu.y = pointer.y;
                    this.rightClickMenu.alpha = 0.7;
                    this.rightClickMenu.displayWidth = Math.floor(this.itemSlot2[i].displayWidth * 2);
                    this.rightClickMenu.displayHeight = 60;
                    this.rightClickMenu.tint = 0x000000;
                    this.rightClickMenu.setOrigin(0.5, 0);


                    this.rightClickOption1.x = pointer.x + 3 - (this.rightClickMenu.displayWidth / 2);
                    this.rightClickOption1.y = pointer.y;
                    this.rightClickOption1.alpha = 0.8;
                    this.rightClickOption1.setFontSize(Math.round((this.cameras.main.width / 135) + (this.cameras.main.height / 110)));
                    //this.rightClickOption1.setOrigin(0.5, 0);



                    this.rightClickOption2.x = pointer.x + 3 - (this.rightClickMenu.displayWidth / 2);
                    this.rightClickOption2.y = pointer.y + 20;
                    this.rightClickOption2.alpha = 0.8;
                    this.rightClickOption2.setFontSize(Math.round((this.cameras.main.width / 135) + (this.cameras.main.height / 110)));
                    //this.rightClickOption2.setOrigin(0.5, 0);


                    this.rightClickOption3.x = pointer.x + 3 - (this.rightClickMenu.displayWidth / 2);
                    this.rightClickOption3.y = pointer.y + 40;
                    this.rightClickOption3.alpha = 0.8;
                    this.rightClickOption3.setFontSize(Math.round((this.cameras.main.width / 135) + (this.cameras.main.height / 110)));
                    //this.rightClickOption3.setOrigin(0.5, 0);



                }
            });
        }


        this.input.setDefaultCursor('url(assets/sprites/icons/cursor.png), pointer');

        this.nameBox2.on('pointerover', () => {
            this.nameBox.alpha = 0.65;
        });
        this.nameBox2.on('pointerout', () => {
            this.nameBox.alpha = 0.4;
        });
        /*this.statBox2.on('pointerover', () => {
            this.statBox.alpha = 0.65;
        });
        this.statBox2.on('pointerout', () => {
            this.statBox.alpha = 0.4;
        });*/

        this.rightClickOption1.on('pointerover', () => {
            this.rightClickOption1.alpha = 1;
        });
        this.rightClickOption1.on('pointerout', () => {
            this.rightClickOption1.alpha = 0.8;
        });
        this.rightClickOption2.on('pointerover', () => {
            this.rightClickOption2.alpha = 1;
        });
        this.rightClickOption2.on('pointerout', () => {
            this.rightClickOption2.alpha = 0.8;
        });
        this.rightClickOption3.on('pointerover', () => {
            this.rightClickOption3.alpha = 1;
        });
        this.rightClickOption3.on('pointerout', () => {
            this.rightClickOption3.alpha = 0.8;
        });

            this.input.keyboard.on('keydown', (event) => {
                if (event.code == 'KeyI') {
                    if(isChatting() == false) {
                        this.toggleInventory();
                    } else {
                        console.log(isChatting())
                    }
                }
            });

        this.startInventory();

        sceneLoaded();
    }

    resizeInventory() {
        this.invWidth = this.cameras.main.width * this.invWidthScale; // inventory width is 30% of game screen
        this.invStartX = this.cameras.main.width - this.invWidth; // where inventory starts

        this.nameBoxStartX = this.invStartX + 10;
        this.nameBoxStartY = this.cameras.main.height * 0.025;
        this.nameBoxWidth = this.invWidth - 20;
        this.nameBoxHeight = this.cameras.main.height * 0.05;

        
        this.statBoxWidth = this.cameras.main.width * 0.225;
        this.statBoxHeight = this.cameras.main.height * 0.45;

        this.statBoxStartX = this.invStartX - this.statBoxWidth - 10;
        this.statBoxStartY = this.nameBoxStartY;

        /*this.useBox1StartX = this.invStartX + 10;
        this.useBox1StartY = this.statBoxStartY + this.statBoxHeight - (this.statBoxHeight * 0.22) - 4;
        this.useBox1Width = (this.statBoxWidth / 2) - 2;
        this.useBox1Height = this.statBoxHeight * 0.22;

        this.useBox2StartX = this.invStartX + 10 + (this.statBoxWidth / 2) - 1;
        this.useBox2StartY = this.statBoxStartY + this.statBoxHeight - (this.statBoxHeight * 0.22) - 4;
        this.useBox2Width = (this.statBoxWidth / 2) - 2;
        this.useBox2Height = this.statBoxHeight * 0.22;*/

        this.itemStartX = this.nameBoxStartX;
        this.itemStartY = this.nameBoxStartY + this.nameBoxHeight + (this.cameras.main.height * 0.02);
        this.itemWidth = ((this.nameBoxWidth - (this.itemSpacing * 4)) / 5);
        this.itemHeight = this.itemWidth;

        /*this.deleteStartX = this.statBoxStartX + this.statBoxWidth - (this.statBoxHeight * 0.3);
        this.deleteStartY = this.statBoxStartY + 4;
        this.deleteWidth = this.statBoxHeight * 0.25;
        this.deleteHeight = this.statBoxHeight * 0.25;*/

        this.invBack.x = this.invStartX;
        this.invBack.displayWidth = this.cameras.main.width * this.invWidthScale;
        this.invBack.displayHeight = this.cameras.main.height;
        this.invBack2.x = this.invStartX + 1;
        this.invBack2.displayWidth = this.cameras.main.width * this.invWidthScale;
        this.invBack2.displayHeight = this.cameras.main.height;

        this.nameBox.x = this.nameBoxStartX;
        this.nameBox.y = this.nameBoxStartY;
        this.nameBox.displayWidth = this.nameBoxWidth;
        this.nameBox.displayHeight = this.nameBoxHeight;
        this.nameBox2.x = this.nameBoxStartX - 2;
        this.nameBox2.y = this.nameBoxStartY - 2;
        this.nameBox2.displayWidth = this.nameBoxWidth;
        this.nameBox2.displayHeight = this.nameBoxHeight;

        this.statBox.x = this.statBoxStartX;
        this.statBox.y = this.statBoxStartY;
        this.statBox.displayWidth = this.statBoxWidth;
        this.statBox.displayHeight = this.statBoxHeight;
        this.statBox2.x = this.statBoxStartX - 2;
        this.statBox2.y = this.statBoxStartY - 2;
        this.statBox2.displayWidth = this.statBoxWidth;
        this.statBox2.displayHeight = this.statBoxHeight;

        /*this.useBox1.x = this.useBox1StartX;
        this.useBox1.y = this.useBox1StartY;
        this.useBox1.displayWidth = this.useBox1Width;
        this.useBox1.displayHeight = this.useBox1Height;

        this.useBox2.x = this.useBox2StartX;
        this.useBox2.y = this.useBox2StartY;
        this.useBox2.displayWidth = this.useBox2Width;
        this.useBox2.displayHeight = this.useBox2Height;

        this.deleteIcon.x = this.deleteStartX;
        this.deleteIcon.y = this.deleteStartY;
        this.deleteIcon.displayWidth = this.deleteWidth;
        this.deleteIcon.displayHeight = this.deleteHeight;*/

        this.nameText.setFontSize(Math.round((this.cameras.main.width / 70) + (this.cameras.main.height / 55)));
        this.nameText.setOrigin(0.5);
        this.nameText.x = Math.round(this.nameBoxStartX + (this.nameBoxWidth / 2));
        this.nameText.y = Math.round(this.nameBoxStartY + (this.nameBoxHeight / 2)) - 5;

        this.itemText.setFontSize(Math.round((this.cameras.main.width / 90) + (this.cameras.main.height / 70)));
        this.itemText.x = this.statBoxStartX + (this.statBoxWidth * 0.5);
        this.itemText.y = this.statBoxStartY + (this.statBoxHeight * 0.02);
        this.itemText.setOrigin(0.5);


        this.statsText.setFontSize(Math.round((this.cameras.main.width / 100) + (this.cameras.main.height / 80)));
        this.statsText.x = Math.round(this.statBoxStartX + (this.statBoxWidth / 2));
        this.statsText.y = Math.round(this.statBoxStartY + (this.itemText.y));
        this.statsText.setOrigin(0.5, 0);

        //this.useText1.setFontSize(Math.round((this.cameras.main.width / 80) + (this.cameras.main.height / 60)));
        this.useText1.setFontSize(Math.round((this.cameras.main.width / 100) + (this.cameras.main.height / 80)));
        this.useText1.setOrigin(0.5);
        this.useText1.x = this.statBoxStartX + (this.statBoxWidth * 0.25);
        this.useText1.y = this.statBoxStartY + this.statBoxHeight - (this.statBoxHeight * .135);

        this.useText2.setFontSize(Math.round((this.cameras.main.width / 100) + (this.cameras.main.height / 80)));
        this.useText2.setOrigin(0.5);
        this.useText2.x = this.statBoxStartX + (this.statBoxWidth * 0.75);
        this.useText2.y = this.statBoxStartY + this.statBoxHeight - (this.statBoxHeight * .135);

        this.selectedItemSprite.x = this.statBoxStartX + (this.statBoxWidth * 0.01);
        this.selectedItemSprite.y = this.statBoxStartY + (this.statBoxHeight * 0.15);
        this.selectedItemSprite.displayWidth = this.statBoxWidth / 4;
        this.selectedItemSprite.displayHeight = this.statBoxWidth / 4;


        let currSlotX = this.itemStartX,
            currSlotY = this.itemStartY;

        for (let i = 0; i < this.totalItems; i++) {
            if (currSlotX >= this.nameBoxStartX + this.nameBoxWidth - 4) {
                currSlotX = this.itemStartX;
                currSlotY += this.itemSpacing + this.itemHeight;
            }

            this.itemSlot[i].x = currSlotX;
            this.itemSlot[i].y = currSlotY;
            this.itemSlot[i].displayWidth = this.itemWidth;
            this.itemSlot[i].displayHeight = this.itemHeight;
            this.itemSlot2[i].x = currSlotX - 2;
            this.itemSlot2[i].y = currSlotY - 2;
            this.itemSlot2[i].displayWidth = this.itemWidth;
            this.itemSlot2[i].displayHeight = this.itemHeight;

            if (this.myInv[i]) {
                this.myInv[i].x = currSlotX - 2;
                this.myInv[i].y = currSlotY - 2;
                this.myInv[i].displayWidth = this.itemWidth;
                this.myInv[i].displayHeight = this.itemHeight;
            }

            currSlotX += this.itemSpacing + this.itemWidth;
        }
    }

    removeOptionsMenu() {
        this.rightClickMenu.x = -1000;
        this.rightClickOption1.x = -1000;
        this.rightClickOption2.x = -1000;
        this.rightClickOption3.x = -1000;

        this.rightClickMenu.alpha = 0;
        this.rightClickOption1.alpha = 0;
        this.rightClickOption2.alpha = 0;
        this.rightClickOption3.alpha = 0;
    }

    update() {
        // resize the inventory if size of the game screen has changed
        if ((this.cameras.main.width * this.invWidthScale) != this.invWidth || this.cameras.main.height != this.invBack.displayHeight) {
            this.resizeInventory();
        }

            if(needUpdate && this.items != items) {
                needUpdate = false;
            for(let i=0;i<30;i++) {
                this.myInv[i].alpha = 0;
            }
            console.log(items)
            for(let i=0;i<items.length;i++) {
                this.items[i] = items[i];
                if(typeof items[i] !== undefined && typeof items[i].type !== undefined && items[i].type) {
                    this.myInv[i].setTexture(itemList[items[i].type][1]);
                    this.myInv[i].alpha = 1;
                }
            }
            this.resizeInventory();
        }

    }

    startInventory() {
        this.scene.get('Inv');
        this.scene.setVisible(false, 'Inv');
        this.statBox2.removeInteractive();
        this.nameBox2.removeInteractive();
        for (let i = 0; i < this.totalItems; i++) {
            this.itemSlot2[i].removeInteractive();
        }
        this.newSelection(-1);
    }

    toggleInventory() {

        if (this.inventoryOpen) {
            this.inventoryOpen = false;
            this.statBox2.removeInteractive();
            this.nameBox2.removeInteractive();
            for (let i = 0; i < this.totalItems; i++) {
                this.itemSlot2[i].removeInteractive();
            }
            this.scene.get('Inv');
            this.scene.setVisible(false, 'Inv');
        } else {
            this.newSelection(-1);
            this.resizeInventory();
            this.inventoryOpen = true;
            this.scene.get('Inv');
            this.scene.setVisible(true, 'Inv');
            this.statBox2.setInteractive();
            this.nameBox2.setInteractive();
            for (let i = 0; i < this.totalItems; i++) {
                this.itemSlot2[i].setInteractive();
            }
        }

    }

}