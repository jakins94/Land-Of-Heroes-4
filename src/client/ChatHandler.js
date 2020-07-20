
import 'phaser';
import { sendChatMessage } from './Socket';
import { sceneLoaded } from '../index';
import config from './config/config';


let chatLines = [];

let chatting = false;
let chatOpen = true;

export function isChatting() {

    return chatting;

}

export function toggleChat() {
    if(chatOpen) {
        chatOpen = false;
    } else {
        chatOpen = true;
    }
}


export function newMessage(data) {
    chatLines.push(data.msg);
}


export class ChatScene extends Phaser.Scene {

    constructor() {
        super('Chat');

        this.chatOpen = true; // if chat is open or closed (closes when equipment screen opens)
        this.chatWidthScale = 0.35; // normal chat width of game screen
        this.chatHeightScale = 0.35; // chat height when maxed mobile
        this.mobileTextHeight = 10; // starts mobile chat box min height
        this.chatMin = true; // chat starts minimized

        this.inputBox = document.getElementById('chat');
        this.inputBox.style.display = 'none';
       // this.inputBox.requestFullscreen();

        this.chatTexts = []; // all chat messages bitmaptext objects

        this.lastWidth = 0; // used for resizing
        this.lastHeight = 0;

        
    }

    preload() {
        this.load.bitmapFont('test', 'assets/fonts/test/font.png', 'assets/fonts/test/font.fnt');

        this.load.image('chatBack', 'assets/sprites/icons/inventorySlot.png');
        this.load.image('minusIcon', 'assets/sprites/icons/minusIcon.png');
        this.load.image('plusIcon', 'assets/sprites/icons/plusIcon.png');
    }

    create() {
        //document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        //this.inputBox.requestFullscreen({preventScroll: true});

        this.resizeButton = this.add.sprite(0,0,'plusIcon').setInteractive();
        this.resizeButton.alpha = 0.5;
        this.resizeButton.depth = 5;

        this.game.device.fullscreen.keyboard = true;

        this.myText = this.add.bitmapText(0, 0, 'test', '');
        this.myText.depth = 6;
        this.myText.setOrigin(0, 0.5);

        this.sendText = this.add.bitmapText(0, 0, 'test', 'Send Message').setInteractive();
        this.sendText.alpha = 0;
        this.sendText.depth = 6;
        this.sendText.setFontSize(16);
        this.sendText.setOrigin(1, 0.5);

        if(this.game.device.os.desktop) {
            this.myText.text = '';
        } else {
            this.myText.text = '';
        }
        this.chatBack = this.add.sprite(0, 0, 'chatBack').setInteractive();
        this.chatBack.setOrigin(0);
        this.chatBack.alpha = 0.35;
        this.chatBack.tint = 0x000000;

        this.resizeButton.on('pointerdown', () => {
            if(chatOpen) {
                this.toggleChatSize();
            }
        });

        /*this.chatBack.on('pointerdown', () => {
            if(chatOpen) {
                this.toggleInput();
            }
        });*/

        this.sendText.on('pointerdown', () => {
            if(chatOpen) {
                this.toggleInput();
            }
        });

        this.input.keyboard.on('keydown', (event) => {
            if (event.code == 'Enter') {
                this.toggleInput();
            }
        });

        sceneLoaded();
    }

    toggleInput() {
        if(chatting) {

            if(this.inputBox.value != '') {
                sendChatMessage(this.inputBox.value);
            }

            this.inputBox.value = '';
            this.inputBox.style.display = 'none';

            if(this.game.device.os.desktop) {
                this.myText.text = 'Press enter to chat';
                this.myText.alpha = 0.5;
            } else {
                this.myText.text = 'Tap here to chat';
                this.myText.alpha = 0.5;
            }

            this.sendText.alpha = 0;
            this.sendText.removeInteractive();

            chatting = false;

            
        } else {
            chatting = true;
            this.inputBox.style.display = '';
            this.inputBox.style.opacity = '0';

            this.inputBox.zIndex = '-3';
            this.inputBox.focus();

            this.sendText.setInteractive();


            this.myText.alpha = 1;

        }
    }

    toggleChatbox() {
        if(this.chatOpen) {
            this.chatOpen = false;
            this.scene.get('Chat');
            this.scene.setVisible(false, 'Chat');
        } else {
            this.chatOpen = true;
            this.scene.get('Chat');
            this.scene.setVisible(true, 'Chat');
        }
    }

    // toggles the size of the chatbox, minimized shows 1 message, max shows more
    toggleChatSize() {
        // toggle the size, chatMin means chat minimized
        this.chatMin = !this.chatMin;
        this.resizeChatbox();

        if(this.chatMin) {
            this.resizeButton.setTexture('plusIcon');
            this.myText.alpha = 0;
            this.sendText.alpha = 0;
            this.sendText.removeInteractive();
        } else {
            this.toggleInput();
            this.resizeButton.setTexture('minusIcon');
            this.myText.alpha = 0.5;
        }
    }

    resizeChatbox() {

        let fontWeight = 10;


        if(this.game.device.os.desktop && config.debugMobile == false) { //desktop
            this.chatWidth = this.cameras.main.width * this.chatWidthScale; // chat width is 30% of game screen
            this.chatHeight = this.cameras.main.height / 4;
            this.chatStartX = this.cameras.main.width - this.chatWidth; // where chat starts
            fontWeight = 165;

            for(let i=0;i<this.chatTexts.length;i++) {
                this.chatTexts[i].setFontSize(Math.round((this.cameras.main.width / fontWeight) + (this.cameras.main.height / (fontWeight * 0.75))));
                this.chatTexts[i].x = 2;
                this.chatTexts[i].y = Math.round(this.chatHeight - (this.chatHeight * 0.17) - (i * 10));
            }


        } else { //mobile

            let defaultText = this.add.bitmapText(0, 0, 'prstart', 'test');
                defaultText.alpha = 0;
                defaultText.setFontSize(16);


            if(this.chatMin) {

                this.chatWidth = this.cameras.main.width * this.chatWidthScale;
                this.chatHeight = defaultText.height + 5;

                // minify and position the last message in the chat
                for(let i=0;i<this.chatTexts.length;i++) {
                    this.chatTexts[i].y = -1000;

                    this.chatTexts[0].setFontSize(16);
                    this.chatTexts[0].setOrigin(0, 0.5);
                    this.chatTexts[0].x = 2;
                    this.chatTexts[0].y = 10;
                    while(this.chatTexts[0].width > this.chatWidth)
                        this.chatTexts[0].text = this.chatTexts[0].text.slice(0, this.chatTexts[0].text.length-4) + '...';
                }

            } else {

                this.chatWidth = this.cameras.main.width;
                this.chatHeight = this.cameras.main.height * this.chatHeightScale;

                for(let i=0;i<this.chatTexts.length;i++) {
                    this.chatTexts[i].setFontSize(16);
                    this.chatTexts[i].setOrigin(0, 0.5);
                    this.chatTexts[i].x = 2;
                    this.chatTexts[i].y = this.chatHeight - 15 - defaultText.height - (i * defaultText.height);
                }

                this.myText.x = 2;
                this.myText.y = this.chatHeight - 15;

                this.sendText.x = this.chatWidth - 25;
                this.sendText.y = this.chatHeight - 15;

            }


            this.resizeButton.x = this.chatWidth - 10;
            this.resizeButton.y = this.chatHeight - 10;

            this.chatStartX = this.cameras.main.width - this.chatWidth; // where chat starts

        }

        this.chatBack.displayWidth = this.chatWidth;
        this.chatBack.displayHeight = this.chatHeight;

        this.myText.setFontSize(16);
        this.myText.x = 2;
        this.myText.y = this.chatHeight * 0.90;

        


        /*for(let i=0;i<this.chatTexts.length;i++) {
            this.chatTexts[i].setFontSize(Math.round((this.cameras.main.width / fontWeight) + (this.cameras.main.height / (fontWeight * 0.75))));
            this.chatTexts[i].x = 2;
            this.chatTexts[i].y = Math.round(this.chatHeight - (this.chatHeight * 0.17) - (i * 10));
        }*/

        //this.inputBox.style.top = this.chatHeight + 'px';
        //this.inputBox.style.width = this.chatWidth+'px';
    }

    update() {

        if(chatting) {
            this.inputBox.focus();

            if(this.inputBox.value == '') {
                this.myText.text = 'Typing...';
                this.sendText.text = 'Cancel';
                this.sendText.alpha = 1;
            } else {
                this.myText.text = this.inputBox.value;
                this.sendText.text = 'Send Message';
                this.sendText.alpha = 1;
            }
        }
        // resize the inventory if size of the game screen has changed
        if (this.cameras.main.width != this.lastWidth || this.cameras.main.height != this.lastHeight) {
            this.lastWidth = this.cameras.main.width;
            this.lastHeight = this.cameras.main.height;
            this.resizeChatbox();
        }

        if(chatLines.length > this.chatTexts.length) {

            for(let i=0;i<this.chatTexts.length;i++) {
                this.chatTexts[i].y -= 10;
            }
            let newMsg = this.add.bitmapText(0, this.chatHeight - 15, 'prstart', chatLines[chatLines.length - 1]);
            newMsg.setFontSize(Math.round((this.cameras.main.width / 175) + (this.cameras.main.height / 130)));
            this.chatTexts.unshift(newMsg);

            this.resizeChatbox();


        }
    }

}
