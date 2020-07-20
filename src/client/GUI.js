import 'phaser';
import { myPlayer } from './scenes/GameScene';
import { sceneLoaded } from '../index';
import EH from './EnemyHandler';



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

        this.totalAbilities = 2;
        this.abilityIcons = [];
        this.abilityPositionsDesktop = [[0.45, 0.925],
                                        [0.5, 0.925]];
        this.abilityKeys = [ 1, 2, 3, 4 ];
        this.abilityKeyText = [];

        this.targetDisplayed = false;

    }

    preload() {
        this.load.image('expBar', 'assets/sprites/icons/inventorySlot.png');
        this.load.image('abilityBack', 'assets/sprites/icons/abilityBack.png');
    }

    create() {

        this.targetHPBarWidth = this.cameras.main.width / 8;
        this.targetHPBarHeight = this.cameras.main.height / 27;

        this.targetText = this.add.bitmapText(this.cameras.main.width / 2, 50, 'prstart', '');
        this.targetText.setFontSize(20);
        this.targetText.alpha = 0;
        this.targetText.setOrigin(0.5);

        this.targetHealthBarBack = this.add.sprite(0, 0, 'expBar');
        this.targetHealthBarBack.tint = 0xFF0000;
        this.targetHealthBarBack.displayWidth = this.targetHPBarWidth;
        this.targetHealthBarBack.displayHeight = this.targetHPBarHeight;
        this.targetHealthBarBack.x = (this.cameras.main.width / 2) - this.targetHPBarWidth;
        this.targetHealthBarBack.y = this.cameras.main.width / 20;
        this.targetHealthBarBack.alpha = 0;
        this.targetHealthBarBack.setOrigin(0);

        this.targetHealthBarFront = this.add.sprite(0, 0, 'expBar');
        this.targetHealthBarFront.tint = 0x00FF00;
        this.targetHealthBarFront.displayWidth = this.targetHPBarWidth;
        this.targetHealthBarFront.displayHeight = this.targetHPBarHeight;
        this.targetHealthBarFront.x = (this.cameras.main.width / 2) - this.targetHPBarWidth;
        this.targetHealthBarFront.y = (this.cameras.main.width / 20);
        this.targetHealthBarFront.alpha = 0;
        this.targetHealthBarFront.setOrigin(0);

        this.targetHPText = this.add.bitmapText(this.cameras.main.width / 2, 50, 'prstart', '');
        this.targetHPText.alpha = 0;
        this.targetHPText.setFontSize(15);
        this.targetHPText.setOrigin(0.5);


        //let phaser = window.game;
        //let scene = phaser.scene.getScene('Game');

        /*this.targetUIGroup = this.add.group();
        this.targetUIGroup.addMultiple([this.targetText, this.targetHPText, this.targetHealthBarFront, this.targetHealthBarBack]);

        this.targetUIGroup.alpha = 0;*/
        

        for(let i=0;i<this.totalAbilities;i++) {
            this.abilityIcons[i] = this.add.sprite(0, 0, 'abilityBack');
            this.abilityIcons[i].displayWidth = 32;
            this.abilityIcons[i].displayHeight = 32;
            this.abilityIcons[i].alpha = 0.75;

            this.abilityKeyText[i] = this.add.bitmapText(0, 0, 'prstart', this.abilityKeys[i]);
        }

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



        sceneLoaded();
        this.onResize();
    }

    onResize() {
        let p = myPlayer();

        for(let i=0;i<this.totalAbilities;i++) {
            this.abilityIcons[i].x = this.abilityPositionsDesktop[i][0] * this.cameras.main.width;
            this.abilityIcons[i].y = this.abilityPositionsDesktop[i][1] * this.cameras.main.height;
        
            this.abilityKeyText[i].setFontSize(16);
            this.abilityKeyText[i].setOrigin(0.5);

            this.abilityKeyText[i].x = this.abilityIcons[i].x;
            this.abilityKeyText[i].y = this.abilityIcons[i].y;
        }

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

            if(p.target > -1) {
                let e = EH.enemyById(p.target);

                if(e) {
                    this.targetDisplayed = true;
                    this.targetText.text = e.name;
                    this.targetText.x = this.targetHealthBarFront.x + (this.targetHPBarWidth / 2);
                    this.targetText.y = this.targetHealthBarFront.y + (this.targetHPBarHeight);
                    this.targetText.setOrigin(0.5, 0);

                    this.targetHPText.text = e.HP + ' / ' + e.maxHP;
                    this.targetHPText.x = this.targetHealthBarFront.x + (this.targetHPBarWidth / 2);
                    this.targetHPText.y = this.targetHealthBarFront.y + (this.targetHPBarHeight / 4);
                    this.targetHPText.setOrigin(0.5, 0.5);

                    this.targetHealthBarFront.alpha = 0.8;
                    this.targetHealthBarBack.alpha = 0.8;
                    this.targetText.alpha = 0.8;
                    this.targetHPText.alpha = 0.8;
                    this.targetHealthBarFront.displayWidth = this.targetHPBarWidth * (e.HP / e.maxHP);
                }
            } else {
                if(this.targetDisplayed) {

                    this.tweens.add({
                        targets: [ this.targetHealthBarBack, this.targetHealthBarFront, this.targetText, this.targetHPText ],
                        alpha: 0,
                        duration: 1000,
                        ease: 'Sine.easeOut',
                        repeat: 0,
                        yoyo: false
                    });

                    this.targetDisplayed = false;


                    /*this.targetText.text = '';
                    this.targetHealthBarFront.alpha = 0;
                    this.targetHealthBarBack.alpha = 0;*/
                }
                
            }
        }
    }

}