import 'phaser';
import Player from '../Player';
import { socketConnect, sendHeartbeat, sendMovement, sendAttackEnemy, requestItems, sendAbility } from '../Socket';
import io from 'socket.io-client';
import PH from '../PlayerHandler';
import Enemy from '../Enemy';
import EH from '../EnemyHandler';
import IH from '../ItemHandler';
import { sceneLoaded } from '../../index';

let localPlayer;
let scaleRatio = 0.7;
let hoverTarget = -1;

export function myPlayer() {
    return localPlayer;
}

export function bloodEffect(x,y) {
    let phaser = window.game;
    let scene = phaser.scene.getScene('Game');

    let part = scene.add.particles('shapes',  new Function('return ' + phaser.cache.text.get('blood'))());
    part.x = x;
    part.y = y;
}

// when the user connects
export function newUser(p) {

    let phaser = window.game;
    let scene = phaser.scene.getScene('Game');

    let newPlayer = new Player(p.name, p.pid, p.x, p.y, p.mapId);
        newPlayer.sprite = scene.physics.add.sprite(p.x, p.y, 'knight');
        newPlayer.sprite.setScale(0.7, 0.7);
        newPlayer.sprite.depth = 15;
        newPlayer.sprite.anims.play('idle', true);
        newPlayer.sprite.setOrigin(0.5);


        newPlayer.chatSprite = scene.physics.add.sprite(newPlayer.sprite.x, newPlayer.sprite.y, 'chatBubble');
        newPlayer.chatSprite.alpha = 0;
        //scene.add.bitmapText()
        let style = { 
            //fontSize: 48,
            fontStyle: 'bold',
            fontFamily: 'arial',
            color: '#888',
            align: "center",
            stroke: '#000',
            strokeThickness: 2,
            shadowBlur: 5,
            shadowColor: '#ff0000',
            shadowStroke: true,
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            resolution: 5,
            wordWrap: { width: 250, useAdvancedWrap: true }
        }
        newPlayer.chatText = scene.add.text(newPlayer.sprite.x, newPlayer.sprite.y - 40, '', style);
        //newPlayer.chatText = scene.add.bitmapText(newPlayer.sprite.x, newPlayer.sprite.y - 40, 'prstart', '');
        newPlayer.chatText.tint = 0xffffff;
        newPlayer.chatText.setFontSize(Math.round((scene.cameras.main.width / 125) + (scene.cameras.main.height / 110)));
        //newPlayer.chatText.setMaxWidth(300);
        newPlayer.chatText.setOrigin(0.5, 1);

        console.log('chatText ',newPlayer.chatText)

        scene.physics.world.enable(newPlayer.chatText);

        newPlayer.playerGroup = scene.physics.add.group();
        newPlayer.playerGroup.addMultiple([newPlayer.chatText, newPlayer.sprite]);

        localPlayer = newPlayer;
        scene.cameras.main.startFollow(newPlayer.sprite, false, 0.08, 0.08);
        scene.cameras.main.setZoom(1.5);

        console.log('newPlayer',newPlayer)

        requestItems();

        return newPlayer;
};

export function newEnemies(data) {
    let phaser = window.game;
    let scene = phaser.scene.getScene('Game');

    for(let i=0;i<data.length;i++) {
        let newEnemy = new Enemy(data[i]);

            newEnemy.sprite = scene.physics.add.sprite(data[i].x, data[i].y, data[i].spriteName).setInteractive();
            newEnemy.sprite.setScale(data[i].scaleX, data[i].scaleY);
            newEnemy.scaleX = data[i].scaleX;
            newEnemy.scaleY = data[i].scaleY;
            newEnemy.sprite.setOrigin(0.5);
            newEnemy.sprite.anims.play(data[i].spriteName + '_idle', true);


            newEnemy.sprite.depth = 5;

            newEnemy.sprite.on('pointerdown', () => {
                sendAttackEnemy(newEnemy.id);
                localPlayer.localMoveX = newEnemy.sprite.x;
                localPlayer.localMoveY = newEnemy.sprite.y;
                localPlayer.target = newEnemy.id;
            });

            let healthBarWidth = newEnemy.sprite.displayWidth / 2,
                healthBarHeight = 4;

            newEnemy.healthBarBack = scene.physics.add.sprite(newEnemy.sprite.x - (newEnemy.sprite.displayWidth / 4), newEnemy.sprite.y - (newEnemy.sprite.displayHeight / 1.5), 'blank');
            newEnemy.healthBarBack.tint = 0xff0000;
            newEnemy.healthBarBack.displayHeight = healthBarHeight;
            newEnemy.healthBarBack.displayWidth = healthBarWidth;
            newEnemy.healthBarBack.setOrigin(0);
            newEnemy.healthBarBack.depth = 6;

            newEnemy.healthBarFront = scene.physics.add.sprite(newEnemy.sprite.x - (newEnemy.sprite.displayWidth / 4), newEnemy.sprite.y - (newEnemy.sprite.displayHeight / 1.5), 'blank');
            newEnemy.healthBarFront.tint = 0x00ff00;
            newEnemy.healthBarFront.displayHeight = healthBarHeight;
            newEnemy.healthBarFront.displayWidth = healthBarWidth;
            newEnemy.healthBarFront.setOrigin(0);
            newEnemy.healthBarFront.depth = 6;

            newEnemy.nameText = scene.add.bitmapText(newEnemy.sprite.x, newEnemy.sprite.y + (newEnemy.sprite.displayHeight / 1.5), 'prstart', data[i].name)
            //newEnemy.nameText = scene.add.bitmapText(newEnemy.sprite.x - (newEnemy.sprite.displayWidth / 2), newEnemy.sprite.y + (newEnemy.sprite.displayHeight / 1.5), 'prstart', data[i].name)
            newEnemy.nameText.setFontSize(12);
            newEnemy.nameText.setOrigin(0.5);

            scene.physics.world.enable(newEnemy.nameText);

            newEnemy.enemyGroup = scene.physics.add.group();
            newEnemy.enemyGroup.addMultiple([newEnemy.healthBarFront, newEnemy.healthBarBack, newEnemy.sprite, newEnemy.nameText]);


            newEnemy.healthBarGroup = scene.add.group();
            newEnemy.healthBarGroup.addMultiple([newEnemy.healthBarFront, newEnemy.healthBarBack, newEnemy.nameText]);

            newEnemy.healthBarGroup.setAlpha(0);


            newEnemy.sprite.on('pointerover', () => {
                console.log('enemyhover', newEnemy.id)
                newEnemy.sprite.tintBottomLeft = 0xffff00;
                newEnemy.healthBarGroup.setAlpha(1);
                newEnemy.healthBarGroup.setDepth(7);
                newEnemy.sprite.depth = 7;
                hoverTarget = newEnemy.id;
            });

            newEnemy.sprite.on('pointerout', () => {
                console.log('enemyhover', newEnemy.id)
                newEnemy.sprite.clearTint();
                newEnemy.healthBarGroup.setAlpha(0);
                newEnemy.healthBarGroup.setDepth(6);
                newEnemy.sprite.depth = 6;
                hoverTarget = -1;
            });

            
            EH.addEnemy(newEnemy);
    }

}

//when another player connects
export function newPlayer(p) {

    let phaser = window.game;
    let scene = phaser.scene.getScene('Game');


    let newPlayer = new Player(p.name, p.pid, p.x, p.y, p.mapId);
        newPlayer.sprite = scene.physics.add.sprite(p.x, p.y, 'knight');
        newPlayer.sprite.setScale(0.7, 0.7);
        newPlayer.sprite.anims.play('idle', true);
        newPlayer.sprite.depth = 10;
        newPlayer.chatSprite = scene.physics.add.sprite(400, 150, 'chatBubble');
        newPlayer.chatSprite.alpha = 0;
        newPlayer.chatText = scene.add.bitmapText(0, 0, 'prstart', '');
        newPlayer.chatText.tint = 0xffffff;

        newPlayer.chatText.setFontSize(Math.round((scene.cameras.main.width / 175) + (scene.cameras.main.height / 130)));

        console.log('newPlayer (other)', newPlayer)
        return newPlayer;
};
 
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');

        this.zoomLevel = 0;
    }

    preload() {


        this.load.atlas('minotaur', 'assets/sprites/npc_sprites/minotaur/spritesheet.png', 'assets/sprites/npc_sprites/minotaur/sprites.json')

        this.load.spritesheet('knight', 'assets/sprites/player_sprites/knight.png',
                              {frameWidth: 108, frameHeight: 108});

        this.load.spritesheet('slime', 'assets/sprites/npc_sprites/slime.png',
                                { frameWidth: 64, frameHeight: 50 });


        this.load.tilemapTiledJSON('map', 'assets/maps/newmap.json'); 
        this.load.image('tiles1', 'assets/sprites/tilesets/mountain-ex.png');

        this.load.image('chatBubble', 'assets/sprites/player_sprites/chat_bubble.png');
        this.load.image('blank', 'assets/sprites/blank.png');

        this.load.atlas('shapes', 'assets/shapes.png', 'assets/shapes.json');
        this.load.text('blood', 'assets/LoH.json');

        this.load.audio('bgmusic', ['assets/sounds/bgmusic.ogg']);
        this.load.audio('sword1', ['assets/sounds/sword.ogg']);
        this.load.audio('sword2', ['assets/sounds/sword2.ogg']);
    }

    beginFullscreen() {
        //console.log('fullscreen', this.scale.fullscreen)
        /*console.log('isFullscreen',this.scale.isFullscreen)
        if(!this.scale.isFullscreen) {
            this.scale.startFullscreen();

            let inputBox = document.getElementById('chat');
            inputBox.requestFullscreen({preventScroll: true});
            console.log('fullscreen: ', document.fullscreenElement)
            console.log('fullscreen2: ', document.webkitFullscreenElement)
        } else {

        }*/
    }

    create() {

        this.input.mouse.disableContextMenu();

        this.bgmusic = this.sound.add('bgmusic');
        this.sword1 = this.sound.add('sword1');
        this.sword2 = this.sound.add('sword2');

        //this.bgmusic.play();
        
        
        // for multi-touch events (camera zoom)
        this.input.addPointer(1);

        //let preloadKnight = this.add.sprite(0, 0, 'knight');
            //preloadKnight.alpha = 0;

        // set world and camera bounds, 100x100 map is 3200x3200
        this.cameras.main.setBounds(0, 0, 3200, 3200);
        this.physics.world.setBounds(0, 0, 3200, 3200);

        // add invisible background
        let bg = this.physics.add.sprite(0, 0).setInteractive();
        bg.fixedToCamera = true;
        bg.setScale(3200, 3200);

        // init map
        let map = this.make.tilemap({ key: 'map' });
        let tileset = map.addTilesetImage('mountain', 'tiles1', 32, 32, 1, 2);
        let ground = map.createStaticLayer('ground', tileset, 0, 0);
        let layer1 = map.createStaticLayer('layer1', tileset, 0, 0);
        let layer2 = map.createStaticLayer('layer2', tileset, 0, 0);
        let layer3 = map.createStaticLayer('layer3', tileset, 0, 0);
        let objects = map.createStaticLayer('objects', tileset, 0, 0);

        // camera zoom variables
        let zoomLevel = 0,
            zoomMin = -0.5,
            zoomMax = 1.5;

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            // update zoom level
            zoomLevel -= deltaY * 0.001;
            // prevents from zooming out too far
            if(zoomLevel < zoomMin) zoomLevel = zoomMin;
            if(zoomLevel > zoomMax) zoomLevel = zoomMax;

            this.cameras.main.setZoom(zoomLevel + 1.5);
        });

        //socketConnect();
        let inputBox = document.getElementById('chat');

        /*bg.on('pointerup', () => {

            //this.beginFullscreen();
            
            console.log('isFullscreen',this.scale.isFullscreen)
        if(!this.scale.isFullscreen) {
            //inputBox.requestFullscreen({preventScroll: true});
            //this.scale.startFullscreen();


            console.log('fullscreen: ', document.fullscreenElement)
            console.log('fullscreen2: ', document.webkitFullscreenElement)
        } else {

        } 

            
        }, this);*/

        // when you click the invisible background it gets cursor position relative to the map
        bg.on('pointerdown', () => {
            
            //let client = io();

            let clickX = this.input.activePointer.worldX;
            let clickY = this.input.activePointer.worldY;
            sendMovement(clickX, clickY, 1);

            localPlayer.localMoveX = clickX;
            localPlayer.localMoveY = clickY;
            localPlayer.target = -1;

            if(clickX > localPlayer.sprite.body.x) {
                localPlayer.movingX = localPlayer.sprite.body.x + 32;
            } else {
                localPlayer.movingX = localPlayer.sprite.body.x - 32;
            }

            if(clickY > localPlayer.sprite.body.y) {
                localPlayer.movingY = localPlayer.sprite.body.y + 32;
            } else {
                localPlayer.movingY = localPlayer.sprite.body.y - 32;
            }

        });

        /*bg.on('pointerover', () => {
            let clickX = this.input.activePointer.worldX;
            let clickY = this.input.activePointer.worldY;
        });*/

        this.input.keyboard.on('keydown', (event, pointer) => {
            if (event.code == 'Digit1') {
                sendAbility(1, hoverTarget);
            }

            if (event.code == 'Digit2') {
                sendAbility(2, hoverTarget);
            }
        });

        let heartbeatLoop = setInterval(sendHeartbeat, 5000);
        
        let enemyLoop = setInterval(EH.enemyLoop, 100);
        let playerLoop = setInterval(PH.playerLoop, 100);
        let itemLoop = setInterval(IH.itemLoop, 100);

        /*let minoTest = this.add.sprite(400, 400, 'minotaur', 'sprite1');
        minoTest.setScale(2);
        minoTest.anims.play('minotaur_idle');*/

        sceneLoaded();

        let mainLoop = setInterval(() => {
            this.mainLoop()
        }, 100);

    }

    mainLoop() {

        for(let i=0;i<EH.enemyList().length;i++) {
            let e = EH.enemyList()[i];
                if(!e || !e.sprite) break;

                if(e.target == -1) {
                    if(e.distance(e.sprite.x, e.sprite.y, e.movingX, e.movingY) <= 10) {
                        e.moving = false;
                        e.sprite.setVelocity(0, 0);
                        e.enemyGroup.setVelocity(0, 0);
                        //e.sprite.setVelocityY(0);
                        e.movingX = e.sprite.x;
                        e.movingY = e.sprite.y;
                    } else {
                        e.moving = true;
                        //this.physics.moveTo(e.sprite, e.movingX, e.movingY, 100);
                        this.physics.moveTo(e.sprite, e.movingX, e.movingY, 100);
                        e.enemyGroup.setVelocity(e.sprite.body.velocity.x, e.sprite.body.velocity.y);
                    }
                } else {
                    if(e.distance(e.sprite.x, e.sprite.y, e.movingX, e.movingY) <= e.attackRange && e.target != -1) {
                        e.moving = false;
                        e.sprite.setVelocity(0, 0);
                        e.enemyGroup.setVelocity(0, 0);
                    } else if(e.distance(e.sprite.x, e.sprite.y, e.movingX, e.movingY) > e.attackRange && e.target != -1){
                        this.physics.moveTo(e.sprite, e.movingX, e.movingY, 100);
                        e.enemyGroup.setVelocity(e.sprite.body.velocity.x, e.sprite.body.velocity.y);

                        //newEnemy.sprite.x - (newEnemy.sprite.displayWidth / 2), newEnemy.sprite.y - (newEnemy.sprite.displayHeight / 1.5)
                        e.healthBarGroup.setAlpha(1);
                        e.moving = true;
                    }
                }

                if(e.sprite.x > e.movingX) {
                    //e.sprite.setScale(-e.scaleX, e.scaleY);
                    e.sprite.flipX = true;
                } else {
                    //e.sprite.setScale(e.scaleX, e.scaleY);
                    e.sprite.flipX = false;

                }


                if(e.destroyTimer == -1) { // still alive
                    if(e.moving) {

                        if(e.sprite.anims.currentAnim.key != e.spriteName+'_walk')
                            e.sprite.anims.play(e.spriteName+'_walk', true);
                        
                    }
                    if(e.target == -1) {
                        if(!e.moving) {
                            if(e.sprite.anims.currentAnim.key != e.spriteName+'_idle')
                                e.sprite.anims.play(e.spriteName+'_idle', true);
                        }
                    } else {
                        e.healthBarGroup.setAlpha(1);
                    }
                }

        }

        for(let i=0;i<PH.playerList().length;i++) {
            let thisPlayer = PH.playerList()[i];
            if(thisPlayer) {
                if(!thisPlayer.sprite) {
                    break;
                }

                //console.log('target', thisPlayer.target)

                if(thisPlayer.target == -1) { //no target, just walking
                    if(thisPlayer.distance(thisPlayer.sprite.x, thisPlayer.sprite.y, thisPlayer.localMoveX, thisPlayer.localMoveY) >= 16) {
                        thisPlayer.movingX = thisPlayer.localMoveX;
                        thisPlayer.movingY = thisPlayer.localMoveY;
                        this.physics.moveTo(thisPlayer.sprite, thisPlayer.movingX, thisPlayer.movingY, 100);
                        thisPlayer.playerGroup.setVelocity(thisPlayer.sprite.body.velocity.x, thisPlayer.sprite.body.velocity.y);
                        thisPlayer.moving = true;
                    } else {
                        thisPlayer.moving = false;
                        thisPlayer.sprite.setVelocity(0, 0);
                        thisPlayer.playerGroup.setVelocity(0, 0);
                    }
                } else {
                    let e = EH.enemyById(thisPlayer.target);
                    if(e) {
                        if(thisPlayer.distance(thisPlayer.sprite.x, thisPlayer.sprite.y, e.sprite.x, e.sprite.y) <= (thisPlayer.attackRange + (e.sprite.width / 2))) {
                            thisPlayer.moving = false;
                            thisPlayer.sprite.setVelocity(0, 0);
                            thisPlayer.playerGroup.setVelocity(0, 0);
                            //console.log(thisPlayer.distance(thisPlayer.sprite.x, thisPlayer.sprite.y, e.sprite.x, e.sprite.y))
                            //console.log('range', (thisPlayer.attackRange + (e.sprite.width / 2)))
                        } else {
                            this.physics.moveTo(thisPlayer.sprite, e.sprite.x, e.sprite.y, 100);
                            thisPlayer.playerGroup.setVelocity(thisPlayer.sprite.body.velocity.x, thisPlayer.sprite.body.velocity.y);
                            thisPlayer.moving = true;
                        }
                    }
                }


                    if(thisPlayer.sprite.x > thisPlayer.movingX) {
                        thisPlayer.sprite.setScale(-scaleRatio, scaleRatio);
                    } else {
                        thisPlayer.sprite.setScale(scaleRatio, scaleRatio);
                    }
                //}
                
                if(thisPlayer.target == -1) {
                    if(thisPlayer.moving) {
                        if(thisPlayer.sprite.anims.currentAnim.key != 'walk')
                            thisPlayer.sprite.anims.play('walk', true);
                    } else if(!thisPlayer.moving) {
                        if(thisPlayer.sprite.anims.currentAnim.key != 'idle')
                            thisPlayer.sprite.anims.play('idle', true);
                    }
                } else {
                    let e = EH.enemyById(thisPlayer.target);
                    if(e) {
                        if(e.HP <= 0) {
                            thisPlayer.target = -1;
                            console.log('no hp uhh')
                        } else {
                            e.healthBarGroup.setAlpha(1);
                        }
                    }
                }


                if(thisPlayer.lastChatText.text != '') {

                    if(thisPlayer.chatText.x != thisPlayer.sprite.x || thisPlayer.chatText.y != thisPlayer.sprite.y - 40) {
                        thisPlayer.chatText.x = thisPlayer.sprite.x;
                        thisPlayer.chatText.y = thisPlayer.sprite.y - 40;
                    }

                    thisPlayer.chatText.text = thisPlayer.lastChatText;

                    thisPlayer.chatSprite.displayWidth = 175;
                    thisPlayer.chatSprite.displayHeight = 100;
                    //thisPlayer.chatSprite.body.x =  Math.round(thisPlayer.sprite.x + thisPlayer.chatSprite.displayWidth / 3);
                    //thisPlayer.chatSprite.body.y = Math.round(thisPlayer.sprite.y - thisPlayer.chatSprite.displayHeight);

                    //thisPlayer.chatText.x = Math.round(15 + thisPlayer.sprite.x + thisPlayer.chatSprite.displayWidth / 3);
                    //thisPlayer.chatText.y = Math.round(15 + thisPlayer.sprite.y - thisPlayer.chatSprite.displayHeight);
                    let fontWeight = 150;
                    let screenRatio = this.cameras.main.width / this.cameras.main.height;
                    //thisPlayer.chatText.setFontSize(Math.round((this.cameras.main.width / fontWeight) + (this.cameras.main.height / (fontWeight / screenRatio))));
                    //console.log(thisPlayer.chatText.width)
                    //thisPlayer.chatSprite.setOrigin(0.5)
                    thisPlayer.chatSprite.alpha = 0;
                    if(thisPlayer.lastChatTime < Date.now() - 7000) {
                        thisPlayer.lastChatText = '';
                        thisPlayer.chatText.text = '';
                        thisPlayer.chatSprite.alpha = 0;
                    }
                }
            }
            
        }

    }

    render() {
        	this.game.debug.cameraInfo(this.game.camera, 32, 32);
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    update() {

        if(this.input.pointer1.isDown && this.input.pointer2.isDown) {

            let zoomLevel = 0,
                zoomMin = -0.5,
                zoomMax = 1.5,
                distanceMultiplier = 0.0075;

            zoomLevel = (this.distance(this.input.pointer1.x, this.input.pointer1.y, this.input.pointer2.x, this.input.pointer2.y)) * distanceMultiplier;

            if(zoomLevel < zoomMin) zoomLevel = zoomMin;
            if(zoomLevel > zoomMax) zoomLevel = zoomMax;

            this.cameras.main.setZoom(zoomLevel + 1.5);

        }
    }

        

}