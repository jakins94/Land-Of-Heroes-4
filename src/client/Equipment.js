import 'phaser';
import { isChatting, toggleChat } from './ChatHandler';
import { getItemList } from './ItemHandler';
import { sceneLoaded } from '../index';


let coreStats = [
    ['Strength', 10, 0],
    ['Dexterity', 10, 0],
    ['Intelligence', 10, 0],
    ['Vitality', 10, 0],
];

let itemList = getItemList();

let needUpdate = false;

let equips = [ '', '', '', '', '', '', '', '', '', ''];
let equipItems = [];

export function newEquips(data) {
    console.log(data)

    coreStats[0][1] = data.stats.strength;
    coreStats[1][1] = data.stats.dexterity;
    coreStats[2][1] = data.stats.intelligence;
    coreStats[3][1] = data.stats.vitality;

    equips = data.equips;

    equipItems = data.equipItems;

    needUpdate = true;
}


export class EquipScene extends Phaser.Scene {

    constructor() {
        super('Equip');
        this.equipmentOpen = false;
        this.equipAlpha = 0.35;
        this.equipWidthPercent = 0.35;
        this.equipWidth = 0;
        this.equipHeight = 0;
        this.selectedSlot = -1;

        this.slotSize = 0.1;

        this.eqSlotCoords = [
            [ 0.375, 0.1375], // ammunition
            [ 0.5, 0.125], // helm
            [ 0.625, 0.1375], // necklace
            [ 0.35, 0.2 ], // weapon
            [ 0.5, 0.1850 ], // torso
            [ 0.65, 0.2 ], // offhand
            [ 0.375, 0.2625 ], // gloves
            [ 0.5, 0.2450 ], // legs
            [ 0.5, 0.3075 ], // boots
            [ 0.625, 0.2625 ] // ring 2
        ];

        this.eqSlots = [];
        this.eqSlots2 = [];
        this.eqSlotIcons = [];

        this.coreStatCoords = [
            [ 0.2, 0.375 ],
            [ 0.2, 0.42 ],
            [ 0.2, 0.465 ],
            [ 0.2, 0.51 ],
        ];

        this.coreStatCoords2 = [
            [ 0.45, 0.375 ],
            [ 0.45, 0.42 ],
            [ 0.45, 0.465 ],
            [ 0.45, 0.51 ],
        ];

        /*coreStats = [
            ['Strength', 10, 0],
            ['Dexterity', 10, 0],
            ['Intelligence', 10, 0],
            ['Vitality', 10, 0],
        ];*/

        this.coreStatNameBox = []; // holds stat boxes
        this.coreStatNameBox2 = []; // holds stat boxes
        this.coreStatAmountBox = []; // holds stat amt boxes
        this.coreStatAmountBox2 = []; // holds stat amt boxes

        this.coreStatNameBoxStartX = 0;
        this.coreStatNameBoxStartY = [];
        this.coreStatNameBoxWidth = 0;
        this.coreStatNameBoxHeight = [];

        this.coreStatAmountBoxStartX = 0;
        this.coreStatAmountBoxStartY = [];
        this.coreStatAmountBoxWidth = 0;
        this.coreStatAmountBoxHeight = [];

        this.statBoxAlpha = 0.4;

        this.coreStatText = []; // holds all stat text objects
        this.coreStatText2 = [];
        this.coreStatText3 = [];
    }

    preload() {
        this.load.image('eqSlot', 'assets/sprites/icons/inventoryBack.png');
        this.load.image('eqSlot2', 'assets/sprites/icons/inventorySlot.png');

        this.load.bitmapFont('eqtext', 'assets/fonts/test/font.png', 'assets/fonts/test/font.fnt');

    }

    create() {

        this.equipBack = this.add.sprite(0, 0, 'eqSlot');
        this.equipBack.alpha = this.equipAlpha;
        this.equipBack.tint = 0x000000;
        this.equipBack.setOrigin(0);

        this.equipBack2 = this.add.sprite(0, 0, 'eqSlot');
        this.equipBack2.alpha = this.equipAlpha;
        this.equipBack2.setOrigin(0);

        this.eqBox = this.add.sprite(0, 0, 'eqSlot2');
        this.eqBox.setOrigin(0);
        this.eqBox.alpha = 0.4;
        this.eqBox.tint = 0x000000;

        this.eqBox2 = this.add.sprite(0, 0, 'eqSlot2').setInteractive();
        this.eqBox2.alpha = 0.4;
        this.eqBox2.setOrigin(0);

        this.eqText = this.add.bitmapText(0, 0, 'eqtext', 'Equipment');

        this.statBox = this.add.sprite(0, 0, 'eqSlot2');
        this.statBox.setOrigin(0);
        this.statBox.alpha = 0.4;
        this.statBox.tint = 0x000000;

        this.statBox2 = this.add.sprite(0, 0, 'eqSlot2');
        this.statBox2.setOrigin(0);
        this.statBox2.alpha = 0.4;

        for(let i=0;i<this.eqSlotCoords.length;i++) {
            this.eqSlots[i] = this.add.sprite(0, 0, 'eqSlot2').setInteractive();
            this.eqSlots[i].alpha = 0.4;
            this.eqSlots[i].tint = 0x000000;
            this.eqSlots2[i] = this.add.sprite(0, 0, 'eqSlot2');
            this.eqSlots2[i].alpha = 0.4;

            this.eqSlotIcons[i] = this.add.sprite(0, 0, 'eqSlot2');
            this.eqSlotIcons[i].alpha = 0;

            this.eqSlots[i].on('pointerdown', (pointer) => {
                this.selectedSlot = i;
                this.newSelection(this.selectedSlot);
                console.log(this.selectedSlot)
            });

            this.eqSlots[i].on('pointerover', (pointer) => {
                this.selectedSlot = i;
                this.newSelection(this.selectedSlot);
                console.log(this.selectedSlot)
            });
            this.eqSlots[i].on('pointerout', (pointer) => {
                //this.selectedSlot = -1;
                this.newSelection(-1);
                console.log(this.selectedSlot)
            });
        }

        for(let i=0;i<coreStats.length;i++) {

            this.coreStatNameBox[i] = this.add.sprite(0, 0, 'eqSlot2');
            this.coreStatNameBox[i].alpha = this.statBoxAlpha;
            this.coreStatNameBox[i].tint = 0x000000;
            this.coreStatNameBox2[i] = this.add.sprite(0, 0, 'eqSlot2');
            this.coreStatNameBox2[i].alpha = this.statBoxAlpha;


            this.coreStatAmountBox[i] = this.add.sprite(0, 0, 'eqSlot2');
            this.coreStatAmountBox[i].alpha = this.statBoxAlpha;
            this.coreStatAmountBox[i].tint = 0x000000;
            this.coreStatAmountBox2[i] = this.add.sprite(0, 0, 'eqSlot2');
            this.coreStatAmountBox2[i].alpha = this.statBoxAlpha;

            this.coreStatText[i] = this.add.bitmapText(0, 0, 'eqtext', coreStats[i][0]);
            this.coreStatText2[i] = this.add.bitmapText(0, 0, 'eqtext', coreStats[i][1]);
        }

        this.selectedItemSprite = this.add.sprite(0, 0, 'bronzeSword');
        this.selectedItemSprite.alpha = 0;
        this.selectedItemSprite.setOrigin(0);

        this.itemText = this.add.bitmapText(0, 0, 'eqtext', 'Bronze Sword');
        this.itemText.setOrigin(0.5);

        let statsTextTest = 'Damage: 2-4\nAccuracy: 4\n+1 to Strength';
        this.statsText = this.add.bitmapText(0, 0, 'eqtext', statsTextTest);

        this.input.keyboard.on('keydown', (event) => {
            if (event.code == 'KeyE') {
                if(isChatting() == false) {
                    this.toggleEquipment();
                } else {
                    console.log(isChatting())
                }
            }
        });

        this.eqBox2.on('pointerover', () => {
            this.eqBox.alpha = 0.65;
        });
        this.eqBox2.on('pointerout', () => {
            this.eqBox.alpha = 0.4;
        });

        this.startEquipment();
        this.onResize();

        sceneLoaded();
    }

    update() {

        this.equipWidth = this.cameras.main.displayWidth * this.equipWidthPercent;
        this.equipHeight = this.cameras.main.displayHeight;

        if(this.equipBack.displayWidth != this.equipWidth || this.equipBack.displayHeight != this.cameras.main.displayHeight) {
            this.onResize();
        }

        if(needUpdate) {
            this.onResize();
            needUpdate = false;
        }
        
    }

    newSelection(id) {
        if(id == -1) {
            this.selectedItemSprite.alpha = 0;
            this.itemText.text = '';
            this.statsText.text = '';
            this.statBox.alpha = 0;
            this.statBox2.alpha = 0;
        } else {

            if(equipItems[id] == '' || typeof equipItems[id] === undefined || !equipItems[id]) {
                this.selectedSlot = -1;
                this.newSelection(-1);
                return;
            }

            this.statBox.alpha = 0.6;
            this.statBox2.alpha = 0.6;

            console.log(equipItems)

            this.selectedItemSprite.setTexture(itemList[equipItems[id].type][1]);
            this.selectedItemSprite.displayWidth = this.statBoxWidth / 4;
            this.selectedItemSprite.displayHeight = this.statBoxWidth / 4;
            this.selectedItemSprite.alpha = 1;
            this.itemText.text = itemList[equipItems[id].type][0];
            this.statsText.text = '';
            let numStats = equipItems[id].stats.length;
            let numBonuses = equipItems[id].bonuses.length
            if(numStats > 0) {
                for(let i=0;i<numStats;i++) {
                    this.statsText.text += equipItems[id].stats[i][1] + ' ' + equipItems[id].stats[i][0] + '\n';
                }
            }
            if(numBonuses > 0) {
                this.statsText.text += 'Bonus: \n';
                for(let i=0;i<numBonuses;i++) {
                    this.statsText.text += equipItems[id].bonuses[i][1] + ' ' + equipItems[id].bonuses[i][0] + '\n';
                }
            }

            this.selectedItemSprite.setOrigin(0);
        }
    }

    onResize() {
        this.equipWidth = this.cameras.main.displayWidth * this.equipWidthPercent;
        this.equipHeight = this.cameras.main.displayHeight;

        this.statBoxWidth = this.cameras.main.displayWidth * 0.225;
        this.statBoxHeight = this.cameras.main.displayHeight * 0.45;
        this.statBoxStartX = this.equipWidth + 20;
        this.statBoxStartY = this.eqText.x;

        this.statBox.x = this.statBoxStartX;
        this.statBox.y = this.statBoxStartY;
        this.statBox.displayWidth = this.statBoxWidth;
        this.statBox.displayHeight = this.statBoxHeight;
        this.statBox2.x = this.statBoxStartX - 2;
        this.statBox2.y = this.statBoxStartY - 2;
        this.statBox2.displayWidth = this.statBoxWidth;
        this.statBox2.displayHeight = this.statBoxHeight;

        this.itemText.setFontSize(Math.round((this.cameras.main.width / 90) + (this.cameras.main.height / 70)));
        this.itemText.setOrigin(0);
        this.itemText.x = this.statBoxStartX + (this.statBoxWidth * 0.02);
        this.itemText.y = this.statBoxStartY + (this.statBoxHeight * 0.02);

        this.statsText.setFontSize(Math.round((this.cameras.main.width / 100) + (this.cameras.main.height / 80)));
        this.statsText.setOrigin(0);
        this.statsText.x = Math.round(this.statBoxStartX + (this.statBoxWidth / 4));
        this.statsText.y = Math.round(this.statBoxStartY + (this.statBoxHeight * .175));

        this.selectedItemSprite.x = this.statBoxStartX + (this.statBoxWidth * 0.01);
        this.selectedItemSprite.y = this.statBoxStartY + (this.statBoxHeight * 0.15);
        this.selectedItemSprite.displayWidth = this.statBoxWidth / 4;
        this.selectedItemSprite.displayHeight = this.statBoxWidth / 4;

        for(let i=0;i<this.eqSlotCoords.length;i++) {
            this.eqSlots[i].x = this.eqSlotCoords[i][0] * this.equipWidth;
            this.eqSlots[i].y = this.eqSlotCoords[i][1] * this.equipHeight;
            this.eqSlots2[i].x = this.eqSlotCoords[i][0] * this.equipWidth - 2;
            this.eqSlots2[i].y = this.eqSlotCoords[i][1] * this.equipHeight - 2;
            
            this.eqSlots[i].displayWidth = this.slotSize * this.equipWidth;
            this.eqSlots[i].displayHeight = this.slotSize * this.equipWidth;
            this.eqSlots2[i].displayWidth = this.slotSize * this.equipWidth;
            this.eqSlots2[i].displayHeight = this.slotSize * this.equipWidth;

            if(equips[i] != '') {
                let itemSpriteName = itemList[equips[i]][1];
                console.log(itemSpriteName)
                this.eqSlotIcons[i].setTexture(itemSpriteName);
                this.eqSlotIcons[i].alpha = 1;
            } else {
                this.eqSlotIcons[i].alpha = 0;
            }

            this.eqSlotIcons[i].x = this.eqSlots[i].x;
            this.eqSlotIcons[i].y = this.eqSlots[i].y;
            //this.eqSlotIcons[i].displayWidth = this.eqSlots[i].displayWidth;
            //this.eqSlotIcons[i].displayHeight = this.eqSlots[i].displayHeight;

            this.eqSlotIcons[i].displayWidth = 32;
            this.eqSlotIcons[i].displayHeight = 32;

        }

        this.equipBack.displayWidth =  this.equipWidth;
        this.equipBack.displayHeight = this.equipHeight;

        this.equipBack2.displayWidth =  this.equipWidth;
        this.equipBack2.displayHeight = this.equipHeight;
        this.equipBack2.x = -1;

        this.eqBoxStartX = 10;
        this.eqBoxStartY = this.cameras.main.height * 0.025;
        this.eqBoxWidth = this.equipWidth - 20;
        this.eqBoxHeight = this.cameras.main.height * 0.05;

        this.eqBox.x = this.eqBoxStartX;
        this.eqBox.y = this.eqBoxStartY;
        this.eqBox.displayWidth = this.eqBoxWidth;
        this.eqBox.displayHeight = this.eqBoxHeight;
        this.eqBox2.x = this.eqBoxStartX - 2;
        this.eqBox2.y = this.eqBoxStartY - 2;
        this.eqBox2.displayWidth = this.eqBoxWidth;
        this.eqBox2.displayHeight = this.eqBoxHeight;

        this.eqText.setFontSize(Math.round((this.cameras.main.width / 70) + (this.cameras.main.height / 55)));
        this.eqText.x = Math.round(this.eqBoxStartX + (this.eqBoxWidth / 2));
        this.eqText.y = Math.round(this.eqBoxStartY + (this.eqBoxHeight / 2)) - 5;
        this.eqText.setOrigin(0.5);

        // TODO: Stat boxes adjusted based on size of the longest stat name (intelligence) so it is bugging when you resize your screen and don't re-open equipment screen

        for(let i=0;i<coreStats.length;i++) { 
            this.coreStatText[i].x = this.coreStatCoords[i][0] * this.equipWidth;
            this.coreStatText[i].y = this.coreStatCoords[i][1] * this.equipHeight;
            this.coreStatText[i].text = coreStats[i][0];
            this.coreStatText[i].setFontSize(Math.round((this.cameras.main.width / 90) + (this.cameras.main.height / 70)));
            this.coreStatText[i].setOrigin(0.5);

            this.coreStatText2[i].x = this.coreStatCoords2[i][0] * this.equipWidth;
            this.coreStatText2[i].y = this.coreStatCoords2[i][1] * this.equipHeight;
            this.coreStatText2[i].text = coreStats[i][1];
            this.coreStatText2[i].setFontSize(Math.round((this.cameras.main.width / 90) + (this.cameras.main.height / 70)));
            this.coreStatText2[i].setOrigin(0.5);

            this.coreStatNameBoxStartX = this.coreStatText[2].x - (this.coreStatText[2].width / 1.9);
            this.coreStatNameBoxStartY[i] = (this.coreStatCoords[i][1] * this.equipHeight) - (this.coreStatText[i].height / 2);
            this.coreStatNameBoxWidth = this.coreStatText[2].width + (this.coreStatText[2].width * 0.1);
            this.coreStatNameBoxHeight[i] = this.coreStatText[i].height + (this.coreStatText[i].height * 0.2);

            let amountBoxWidth = 0.125;

            this.coreStatAmountBoxStartX = (this.coreStatCoords2[0][0] * this.equipWidth) - ((this.equipWidth * amountBoxWidth) / 2);
            this.coreStatAmountBoxStartY[i] = (this.coreStatCoords[i][1] * this.equipHeight) - (this.coreStatText[i].height / 2);
            this.coreStatAmountBoxWidth = amountBoxWidth * this.equipWidth;
            this.coreStatAmountBoxHeight[i] = this.coreStatText[i].height + (this.coreStatText[i].height * 0.2);

            this.coreStatNameBox[i].x = this.coreStatNameBoxStartX;
            this.coreStatNameBox[i].y = this.coreStatNameBoxStartY[i];
            this.coreStatNameBox[i].displayWidth = this.coreStatNameBoxWidth;
            this.coreStatNameBox[i].displayHeight = this.coreStatNameBoxHeight[i];
            this.coreStatNameBox[i].setOrigin(0);
            this.coreStatNameBox2[i].x = this.coreStatNameBox[i].x - 2;
            this.coreStatNameBox2[i].y = this.coreStatNameBox[i].y - 2;
            this.coreStatNameBox2[i].displayWidth = this.coreStatNameBox[i].displayWidth;
            this.coreStatNameBox2[i].displayHeight = this.coreStatNameBox[i].displayHeight;
            this.coreStatNameBox2[i].setOrigin(0);

            this.coreStatAmountBox[i].x = this.coreStatAmountBoxStartX;
            this.coreStatAmountBox[i].y = this.coreStatAmountBoxStartY[i];
            this.coreStatAmountBox[i].displayWidth = this.coreStatAmountBoxWidth;
            this.coreStatAmountBox[i].displayHeight = this.coreStatAmountBoxHeight[i];
            this.coreStatAmountBox[i].setOrigin(0);this.coreStatAmountBox[i].x = this.coreStatAmountBoxStartX;
            this.coreStatAmountBox2[i].x = this.coreStatAmountBox[i].x - 2;
            this.coreStatAmountBox2[i].y = this.coreStatAmountBox[i].y - 2;
            this.coreStatAmountBox2[i].displayWidth = this.coreStatAmountBox[i].displayWidth;
            this.coreStatAmountBox2[i].displayHeight = this.coreStatAmountBox[i].displayHeight;
            this.coreStatAmountBox2[i].setOrigin(0);


            //this.coreStatText2[i] = this.add.bitmapText(0, 0, 'eqtext', coreStats[i][1]);
            //this.coreStatText3[i] = this.add.bitmapText(0, 0, 'eqtext', '+ ' + coreStats[i][2]);
        }

    }

    startEquipment() {
        this.scene.get('Equip');
        this.scene.setVisible(false, 'Equip');
        this.newSelection(-1);
        //this.nameBox2.removeInteractive();
    }

    toggleEquipment() {
        toggleChat();
        if (this.equipmentOpen) {
            this.equipmentOpen = false;
            /*this.statBox2.removeInteractive();
            this.nameBox2.removeInteractive();
            for (let i = 0; i < this.totalItems; i++) {
                this.itemSlot2[i].removeInteractive();
            }*/
            this.scene.get('Chat');
            this.scene.setVisible(true, 'Chat');
            this.scene.get('Equip');
            this.scene.setVisible(false, 'Equip');


        } else {
            //this.resizeInventory();
            this.equipmentOpen = true;
            this.newSelection(-1);

            this.scene.get('Equip');
            this.scene.setVisible(true, 'Equip');

            this.scene.get('Chat');
            this.scene.setVisible(false, 'Chat');
            /*this.statBox2.setInteractive();
            this.nameBox2.setInteractive();
            for (let i = 0; i < this.totalItems; i++) {
                this.itemSlot2[i].setInteractive();
            }*/
        }
        this.onResize();
    }

}