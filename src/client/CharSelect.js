import 'phaser';
import { newUid, socketConnect, requestCharacters, characterSelected, checkName, sendCreateCharacter, deleteCharacter } from './Socket';
import { startGameScenes } from '../index';

let chars = ['' ,'', ''];
let updated = false;
let typing = false;
let available = '';
let selectedSlot = -1;

export function charactersLoaded(data) {
    console.log('charsLoaded ',data)

    chars = [];
    for(let char in data) {

        if(data[char] == data.uid){
            newUid(data.uid);
            break;
        } else {
            console.log(data[char], data[char].value)
        }
        if(data[char] != '') {
            chars.push(data[char]);
        } else {
            chars.push({name: 'Create new character'});
        }
    }
    updated = true;
}

export function nameAvailable(data) {
    if(data.avail) {
        available = 'Available';
    } else {
        available = 'Unavailable';
    }
}

export class CharSelectScene extends Phaser.Scene {

    constructor() {
        super('CharSelect');

        this.charSlotWidthPercent = 0.25;
        this.charSlotHeightPercent = 0.8;

        this.charSlotStartPercent = [ 0.05, 0.1 ];
        this.charSlotSepPercent = [ 0.05, 0.1 ];

        this.charSlot = []; //holds char slot sprite
        this.charDelete = []; //holds char slot sprite
        this.classSprite = [];
        this.charNames = [];
        this.charClass = [];
        this.charLevel = [];

        this.totalCharSlots = 3;

        this.creatingCharacter = false; // if user is creating a character
        this.charSelectAlpha = 1;
        this.charCreateAlpha = 1;

        this.charCreateInputAlpha = 0.8;

        this.inputName = 'Enter desired character name...';

        this.inputBox = document.getElementById('chat');
        //this.inputBox = this.add.dom(x, y, 'input', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser');
        //this.inputBox.style.display = 'none';

        this.charSelectGroup = false;
        this.charCreateGroup = false;


    }

    preload() {

        
        this.load.image('charSlot', 'assets/sprites/icons/inventoryBack.png');
        this.load.image('charSlot2', 'assets/sprites/icons/inventorySlot.png');

        this.load.bitmapFont('chartext', 'assets/fonts/test/font.png', 'assets/fonts/test/font.fnt');
    }

    create() {
        let phaser = window.game;
        let scene = phaser.scene.getScene('Game');


        this.input.on('pointerdown', () => {
            console.log('pointerdown')
            //phaser.scale.startFullscreen();
        });

        //this.inputBox = scene.add.dom(0, 0, 'input', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser');
        //this.inputBox.style.display = 'none';
        //console.log

        this.charSelectGroup = this.add.group();
        this.charCreateGroup = this.add.group();
        


        // *** CHAR SELECT SCREEN ***


        for(let i=0;i<this.totalCharSlots;i++) {
            this.charSlot[i] = this.add.sprite(0,0,'charSlot').setInteractive();
            this.charSlot[i].alpha = 0.75;
            this.charSlot[i].setOrigin(0);

            this.charNames[i] = this.add.bitmapText(0, 0, 'chartext', 'Loading...');
            this.charClass[i] = this.add.bitmapText(0, 0, 'chartext', '');
            this.charLevel[i] = this.add.bitmapText(0, 0, 'chartext', '');

            this.charDelete[i] = this.add.bitmapText(0, 0, 'chartext', 'Delete').setInteractive();
            this.charDelete[i].tint = 0xff0000;

            this.classSprite[i] = this.physics.add.sprite(0, 0, 'knight');
            this.classSprite[i].setScale(0.7, 0.7);
            this.classSprite[i].anims.play('idle', true);
            this.classSprite[i].depth = 5;

            this.charSlot[i].on('pointerdown', () => {
                this.clickSlot(i);
            });

            this.charDelete[i].on('pointerdown', () => {
                this.deleteSlot(i);
            });
        }

        this.charSelectGroup.addMultiple(this.charNames);
        this.charSelectGroup.addMultiple(this.charDelete);
        this.charSelectGroup.addMultiple(this.charClass);
        this.charSelectGroup.addMultiple(this.charLevel);
        this.charSelectGroup.addMultiple(this.classSprite);


        // *** CHAR CREATE SCREEN ***

        this.charCreateInput = this.add.sprite(0,0,'charSlot').setInteractive();
        this.charCreateTopText = this.add.bitmapText(0, 0, 'chartext', 'Create a character');
        this.charCreateInputText = this.add.bitmapText(0, 0, 'chartext', 'Enter desired character name...');
        this.charCreateInputText.alpha = 0.8;
        this.charCreateAvailableText = this.add.bitmapText(0, 0, 'chartext', '...');
        this.charCreateButton = this.add.bitmapText(0, 0, 'chartext', 'Create').setInteractive();

        this.charCreateGroup.addMultiple([this.charCreateInput, this.charCreateTopText, this.charCreateInputText, this.charCreateAvailableText, this.charCreateButton]);

        this.charCreateInput.on('pointerdown', () => {
            //this.toggleInput();
        });

        this.charCreateButton.on('pointerdown', () => {
            this.createCharacter();
            this.toggleInput();
        });


        this.charCreateGroup.toggleVisible();


        socketConnect();
        requestCharacters();
        this.onResize();
    }

    clickSlot(id) {
        console.log('clickSlot', id, this.charNames)
        if(this.charNames[id] && this.charNames[id].text !== 'Create new character' && this.charNames[id].text !== 'Loading...') {
            startGameScenes(id);
        } else {
            selectedSlot = id;
            this.toggleCharacterCreate();
            this.toggleInput();
        }
    }

    deleteSlot(id) {
        if(this.charNames[id].text !== 'Create new character') {
            deleteCharacter(id);
            console.log('deleteCharacter', id)
        }
    }

    createCharacter() {
        sendCreateCharacter(this.inputName, selectedSlot);
        this.toggleCharacterCreate();
    }

    toggleInput() {
        if(typing) {

            if(this.inputBox.value != '') {
                //sendChatMessage(this.inputBox.value);
            }

            this.inputBox.value = '';
            this.inputBox.style.display = 'none';

            typing = false;

        } else {
            typing = true;
            this.inputBox.style.display = '';

            this.inputBox.zIndex = '3';
            this.inputBox.focus();
        }
    }

    toggleCharacterCreate() {
        if(!this.creatingCharacter) {
            this.creatingCharacter = true;
            this.charSelectGroup.toggleVisible();
            this.charCreateGroup.toggleVisible();

            
            //this.charCreateGroup.setAlpha(0.5);

            //this.charCreateGroup.iterate(this.doStuff, this);
            /*this.tweens.add({
                targets: this.charCreateGroup.getChildren(),
                alpha: 1,
                duration: 1000,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: true
            });*/

        } else {
            this.creatingCharacter = false;
            this.charCreateGroup.toggleVisible();
            this.charSelectGroup.toggleVisible();
            this.inputBox.value = '';
        }
        this.onResize();
    }

    onResize() {
        this.lastWidth = this.cameras.main.width;
        this.lastHeight = this.cameras.main.height;

        if(this.creatingCharacter) {
            this.charSelectAlpha = 0;
            this.charCreateAlpha = 1;
        } else {
            this.charSelectAlpha = 1;
            this.charCreateAlpha = 0;
        }

        this.charCreateInput.x =  this.lastWidth * 0.5;
        this.charCreateInput.y = 100;
        this.charCreateInput.displayWidth = this.lastWidth * 0.5;
        this.charCreateInput.displayHeight = 50;
        this.charCreateInput.alpha = this.charCreateAlpha * this.charCreateInputAlpha;

        this.charCreateTopText.x =  this.lastWidth * 0.5;
        this.charCreateTopText.y =  50;
        this.charCreateTopText.setFontSize(Math.round((this.cameras.main.width / 90) + (this.cameras.main.height / 70)));
        this.charCreateTopText.setOrigin(0.5);

        this.charCreateInputText.x =  this.lastWidth * 0.5;
        this.charCreateInputText.y =  100;
        this.charCreateInputText.text = this.inputName;
        this.charCreateInputText.setFontSize(Math.round((this.cameras.main.width / 90) + (this.cameras.main.height / 70)));
        this.charCreateInputText.setOrigin(0.5);

        this.charCreateAvailableText.x =  this.charCreateInput.x + (this.charCreateInput.displayWidth / 1.9);
        this.charCreateAvailableText.y =  100;
        this.charCreateAvailableText.setFontSize(Math.round((this.cameras.main.width / 90) + (this.cameras.main.height / 70)));
        this.charCreateAvailableText.setOrigin(0);

        this.charCreateButton.x =  this.charCreateInput.x;
        this.charCreateButton.y =  this.charCreateInput.y + (this.charCreateInput.displayHeight / 1.5);
        this.charCreateButton.setFontSize(Math.round((this.cameras.main.width / 70) + (this.cameras.main.height / 60)));
        this.charCreateButton.setOrigin(0.5);




        for(let i=0;i<this.totalCharSlots;i++) {
            this.charSlot[i].displayWidth = this.cameras.main.width * this.charSlotWidthPercent;
            this.charSlot[i].displayHeight = this.cameras.main.height * this.charSlotHeightPercent;
            this.charSlot[i].x = (this.cameras.main.width * (this.charSlotStartPercent[0])) + (this.cameras.main.width * (this.charSlotSepPercent[0]*i)) + ((this.charSlot[i].displayWidth * i));
            this.charSlot[i].y = this.cameras.main.height * this.charSlotStartPercent[1];
            this.charSlot[i].alpha = this.charSelectAlpha;

            this.charNames[i].x = (this.cameras.main.width * (this.charSlotStartPercent[0])) + (this.cameras.main.width * (this.charSlotSepPercent[0]*i)) + ((this.charSlot[i].displayWidth * i)) + (this.charSlot[i].displayWidth / 2);
            this.charNames[i].y = this.cameras.main.height * (this.charSlotStartPercent[1] + 0.02);
            this.charNames[i].setOrigin(0.5);
            this.charNames[i].setFontSize(Math.round((this.cameras.main.width / 90) + (this.cameras.main.height / 70)));
            this.charNames[i].alpha = this.charSelectAlpha;

            this.charClass[i].x = (this.cameras.main.width * (this.charSlotStartPercent[0])) + (this.cameras.main.width * (this.charSlotSepPercent[0]*i)) + ((this.charSlot[i].displayWidth * i)) + (this.charSlot[i].displayWidth / 2);
            this.charClass[i].y = this.cameras.main.height * (this.charSlotStartPercent[1] + 0.1);
            this.charClass[i].setOrigin(0.5);
            this.charClass[i].setFontSize(Math.round((this.cameras.main.width / 90) + (this.cameras.main.height / 70)));
            this.charClass[i].alpha = this.charSelectAlpha;

            this.charDelete[i].x = (this.cameras.main.width * (this.charSlotStartPercent[0])) + (this.cameras.main.width * (this.charSlotSepPercent[0]*i)) + ((this.charSlot[i].displayWidth * i)) + (this.charSlot[i].displayWidth / 2);
            this.charDelete[i].y = this.cameras.main.height * (this.charSlotStartPercent[1] + 0.75);
            this.charDelete[i].setOrigin(0.5);
            this.charDelete[i].setFontSize(Math.round((this.cameras.main.width / 90) + (this.cameras.main.height / 70)));
            this.charDelete[i].alpha = this.charSelectAlpha;

            this.classSprite[i].x = (this.cameras.main.width * (this.charSlotStartPercent[0])) + (this.cameras.main.width * (this.charSlotSepPercent[0]*i)) + ((this.charSlot[i].displayWidth * i)) + (this.charSlot[i].displayWidth / 2);
            this.classSprite[i].y = this.charClass[0].y + 100;
            this.classSprite[i].anims.play('idle', true);
            
            if(chars[i].name) {
                this.charNames[i].text = chars[i].name;
                if(chars[i].name != 'Create new character') {
                    this.charClass[i].text = 'Level ' + chars[i].level + ' ' + chars[i].class;
                    this.charClass[i].alpha = this.charSelectAlpha;
                    this.classSprite[i].alpha = this.charSelectAlpha;
                    this.charDelete[i].alpha = 1;
                } else {
                    this.charNames[i].y = this.charClass[0].y + 200;
                    this.charClass[i].text = '';
                    this.classSprite[i].alpha = 0;
                    this.charDelete[i].alpha = 0;
                }
            }
        }

        
    }

    update() {
        if(this.cameras.main.width != this.lastWidth || this.cameras.main.height != this.lastHeight || updated == true) {
            this.onResize();
            if(updated == true) updated = false;
        }

        if(this.charNames[0].text == 'Loading...') {
            console.log('attempting to retrieve characters')
            requestCharacters();

        }

        if(typing && this.inputName != this.inputBox.value) {
            if(this.inputBox.value == '') {
                this.charCreateInputText.text = 'Enter desired character name...';
                this.charCreateInputText.alpha = 0.8;
                this.charCreateAvailableText.text = '';
                this.charCreateButton.alpha = 0.5;
            } else {
                this.inputName = this.inputBox.value;
                this.charCreateInputText.text = this.inputBox.value;
                checkName(this.inputName);
            }

            
        }

        if(this.charCreateAvailableText.text != available) {
            if(this.inputBox.value !== '') {
                this.charCreateAvailableText.text = available;
            } else {
                this.charCreateButton.alpha = 0.5;
            }
            if(available == 'Available') {
                this.charCreateAvailableText.tint = 0x00ff00;
                if(this.inputBox.value !== '')
                    this.charCreateButton.alpha = 1;
            } else {
                this.charCreateAvailableText.tint = 0xff0000;
                this.charCreateButton.alpha = 0.5;
            }
        }
    }

}