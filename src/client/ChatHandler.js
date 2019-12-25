
import 'phaser';
import { sendChatMessage } from './Socket';


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
        this.chatOpen = true;

        this.chatWidthScale = 0.35;

        this.inputBox = document.getElementById('chat');
        this.inputBox.style.display = 'none';
        this.chatTexts = [];
    }

    preload() {
        this.load.bitmapFont('test', 'assets/fonts/test/font.png', 'assets/fonts/test/font.fnt');

        this.load.image('chatBack', 'assets/sprites/icons/inventorySlot.png');
    }

    create() {
        //document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        this.game.device.fullscreen.keyboard = true;

        this.myText = this.add.bitmapText(0, 0, 'test', 'a');

        if(this.game.device.os.desktop) {
            this.myText.text = 'Press enter to chat';
        } else {
            this.myText.text = 'Tap here to chat';
        }
        this.chatBack = this.add.sprite(0, 0, 'chatBack').setInteractive();
        this.chatBack.setOrigin(0);
        this.chatBack.alpha = 0.35;
        this.chatBack.tint = 0x000000;

        this.chatBack.on('pointerdown', () => {
            if(chatOpen) {
                this.toggleInput();
            }
        });

        this.input.keyboard.on('keydown', (event) => {
            if (event.code == 'Enter') {
                this.toggleInput();
            }
        });

        
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
            } else {
                this.myText.text = 'Tap here to chat';
            }

            chatting = false;

            
        } else {
            chatting = true;
            this.inputBox.style.display = '';

            this.inputBox.zIndex = '3';
            this.inputBox.focus();
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

    resizeChatbox() {

        let fontWeight = 150;


        this.myText.setFontSize(Math.round((this.cameras.main.width / fontWeight) + (this.cameras.main.height / (fontWeight * 0.75))));
        this.myText.x = 2;
        this.myText.y = this.chatHeight * 0.90;

        this.chatWidth = this.cameras.main.width * this.chatWidthScale; // chat width is 30% of game screen
        this.chatHeight = this.cameras.main.height / 4;
        this.chatStartX = this.cameras.main.width - this.chatWidth; // where chat starts


        this.chatBack.displayWidth = this.chatWidth;
        this.chatBack.displayHeight = this.chatHeight;

        this.inputBox.style.top = this.chatHeight + 'px';
        this.inputBox.style.width = this.chatWidth+'px';


        for(let i=0;i<this.chatTexts.length;i++) {
            this.chatTexts[i].setFontSize(Math.round((this.cameras.main.width / fontWeight) + (this.cameras.main.height / (fontWeight * 0.75))));
            this.chatTexts[i].x = 2;
            this.chatTexts[i].y = Math.round(this.chatHeight - (this.chatHeight * 0.17) - (i * 10));
        }
    }

    update() {

        if(chatting) {
            this.inputBox.focus();

            if(this.inputBox.value == '') {
                this.myText.text = 'Typing...';
            } else {
                this.myText.text = this.inputBox.value;
            }
        }
        // resize the inventory if size of the game screen has changed
        if ((this.cameras.main.width * this.chatWidthScale) != this.chatWidth || this.cameras.main.height != this.chatBack.displayHeight) {
            this.resizeChatbox();
        }

        if(chatLines.length > this.chatTexts.length) {

            for(let i=0;i<this.chatTexts.length;i++) {
                this.chatTexts[i].y -= 10;
            }
            let newMsg = this.add.bitmapText(0, this.chatHeight - 15, 'prstart', chatLines[chatLines.length - 1]);
            newMsg.setFontSize(Math.round((this.cameras.main.width / 175) + (this.cameras.main.height / 130)));
            this.chatTexts.unshift(newMsg);

        }
    }

}
