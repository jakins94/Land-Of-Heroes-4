import 'phaser';
import Player from '../Player';
import { socketConnect, sendHeartbeat, sendMovement, sendAttackEnemy, requestItems } from '../Socket';
import io from 'socket.io-client';
import PH from '../PlayerHandler';
import Enemy from '../Enemy';
import EH from '../EnemyHandler';
import IH from '../ItemHandler';

let localPlayer;
let scaleRatio = 0.7;

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
        newPlayer.sprite = scene.physics.add.sprite(400, 150, 'knight');
        newPlayer.sprite.setScale(0.7, 0.7);
        newPlayer.sprite.depth = 15;
        newPlayer.chatSprite = scene.physics.add.sprite(400, 150, 'chatBubble');
        newPlayer.chatSprite.alpha = 0;
        newPlayer.sprite.anims.play('idle', true);
        newPlayer.chatText = scene.add.bitmapText(0, 0, 'prstart', '');
        newPlayer.chatText.tint = 0x222222;
        newPlayer.chatText.setFontSize(Math.round((scene.cameras.main.width / 175) + (scene.cameras.main.height / 130)));


        localPlayer = newPlayer;
        scene.cameras.main.startFollow(newPlayer.sprite, false, 0.08, 0.08);
        scene.cameras.main.setZoom(1.5);

        console.log(newPlayer.pid)

        requestItems();

        return newPlayer;
};

export function newEnemies(data) {
    let phaser = window.game;
    let scene = phaser.scene.getScene('Game');

    for(let i=0;i<data.length;i++) {
        let newEnemy = new Enemy(data[i]);
            newEnemy.sprite = scene.physics.add.sprite(data[i].x, data[i].y, data[i].spriteName).setInteractive();
            newEnemy.sprite.setScale(data[i].scale, data[i].scale);
            newEnemy.scale = data[i].scale;
            newEnemy.sprite.anims.play(data[i].spriteName + '_idle', true);

            newEnemy.sprite.depth = 5;

            newEnemy.sprite.on('pointerdown', () => {
                sendAttackEnemy(newEnemy.id);
                localPlayer.localMoveX = newEnemy.sprite.body.x;
                localPlayer.localMoveY = newEnemy.sprite.body.y;
            });

            let healthBarWidth = 30,
                healthBarHeight = 4;

            newEnemy.healthBarBack = scene.physics.add.sprite(newEnemy.sprite.x - (newEnemy.sprite.displayWidth / 2), newEnemy.sprite.y - (newEnemy.sprite.displayHeight / 1.5), 'blank');
            newEnemy.healthBarBack.tint = 0xff0000;
            newEnemy.healthBarBack.displayHeight = healthBarHeight;
            newEnemy.healthBarBack.displayWidth = healthBarWidth;
            newEnemy.healthBarBack.setOrigin(0);
            newEnemy.healthBarBack.depth = 6;

            newEnemy.healthBarFront = scene.physics.add.sprite(newEnemy.sprite.x - (newEnemy.sprite.displayWidth / 2), newEnemy.sprite.y - (newEnemy.sprite.displayHeight / 1.5), 'blank');
            newEnemy.healthBarFront.tint = 0x00ff00;
            newEnemy.healthBarFront.displayHeight = healthBarHeight;
            newEnemy.healthBarFront.displayWidth = healthBarWidth;
            newEnemy.healthBarFront.setOrigin(0);
            newEnemy.healthBarFront.depth = 6;

            
            EH.addEnemy(newEnemy);
    }

}

//when another player connects
export function newPlayer(p) {

    let phaser = window.game;
    let scene = phaser.scene.getScene('Game');

    let newPlayer = new Player(p.name, p.pid, p.x, p.y, p.mapId);
        newPlayer.sprite = scene.physics.add.sprite(400, 150, 'knight');
        newPlayer.sprite.setScale(0.7, 0.7);
        newPlayer.sprite.anims.play('idle', true);
        newPlayer.sprite.depth = 10;
        newPlayer.chatSprite = scene.physics.add.sprite(400, 150, 'chatBubble');
        newPlayer.chatSprite.alpha = 0;
        newPlayer.chatText = scene.add.bitmapText(0, 0, 'prstart', '');
        newPlayer.chatText.tint = 0x222222;

        newPlayer.chatText.setFontSize(Math.round((scene.cameras.main.width / 175) + (scene.cameras.main.height / 130)));


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

    create() {

        this.input.mouse.disableContextMenu();

        this.bgmusic = this.sound.add('bgmusic');
        this.sword1 = this.sound.add('sword1');
        this.sword2 = this.sound.add('sword2');

        //this.bgmusic.play();
        
        
        // for multi-touch events (camera zoom)
        this.input.addPointer(1);

        let preloadKnight = this.add.sprite(0, 0, 'knight');
            preloadKnight.alpha = 0;

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

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('knight', { start: 10, end: 13 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('knight', { start: 6, end: 9 }),
            frameRate: 6,
            repeat: 0
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });


        this.anims.create({
            key: 'slime_idle',
            frames: this.anims.generateFrameNumbers('slime', { start: 17, end: 21 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'slime_attack',
            frames: this.anims.generateFrameNumbers('slime', { start: 6, end: 12 }),
            frameRate: 6,
            repeat: 0
        });

        this.anims.create({
            key: 'slime_death',
            frames: this.anims.generateFrameNumbers('slime', { start: 3, end: 0 }),
            frameRate: 3,
            repeat: 0
        });

        this.anims.create({
            key: 'slime_walk',
            frames: this.anims.generateFrameNumbers('slime', { start: 17, end: 21 }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: 'minotaur_idle',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNames('minotaur', {
                prefix: 'sprite',
                suffix: '',
                start: 1,
                end: 5,
            }),
            
        });

        this.anims.create({
            key: 'minotaur_attack',
            frameRate: 6,
            repeat: 0,
            frames: this.anims.generateFrameNames('minotaur', {
                prefix: 'sprite',
                suffix: '',
                start: 54,
                end: 59,
            }),
            
        });

        this.anims.create({
            key: 'minotaur_death',
            frameRate: 7,
            repeat: 0,
            frames: this.anims.generateFrameNames('minotaur', {
                prefix: 'sprite',
                suffix: '',
                start: 67,
                end: 74,
            }),
            
        });

        this.anims.create({
            key: 'minotaur_walk',
            frameRate: 7,
            repeat: -1,
            frames: this.anims.generateFrameNames('minotaur', {
                prefix: 'sprite',
                suffix: '',
                start: 7,
                end: 9,
            }),
            
        });

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

        socketConnect();

        // when you click the invisible background it gets cursor position relative to the map
        bg.on('pointerdown', () => {
            
            //let client = io();

            //this.scale.startFullscreen();
            //console.log(this.scale.fullscreen)
            //console.log(this.scale.isFullscreen)
            //if(!this.scale.isFullscreen) {
                //let inputBox = document.getElementById('chat');
                //inputBox.requestFullscreen({preventScroll: true});
            //}

            let clickX = this.input.activePointer.worldX;
            let clickY = this.input.activePointer.worldY;
            sendMovement(clickX, clickY, 1);

            localPlayer.localMoveX = clickX;
            localPlayer.localMoveY = clickY;

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

        let heartbeatLoop = setInterval(sendHeartbeat, 5000);
        
        let enemyLoop = setInterval(EH.enemyLoop, 100);
        let playerLoop = setInterval(PH.playerLoop, 100);
        let itemLoop = setInterval(IH.itemLoop, 100);

        /*let minoTest = this.add.sprite(400, 400, 'minotaur', 'sprite1');
        minoTest.setScale(2);
        minoTest.anims.play('minotaur_idle');*/


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

        for(let i=0;i<EH.enemyList().length;i++) {
            let e = EH.enemyList()[i];
                if(!e || !e.sprite) break;

                if(e.distance(e.sprite.body.x, e.sprite.body.y, e.movingX, e.movingY) <= 10) {
                    e.moving = false;
                    e.sprite.setVelocityX(0);
                    e.sprite.setVelocityY(0);
                    e.movingX = e.sprite.body.x;
                    e.movingY = e.sprite.body.y;

                } else {
                    if(e.distance(e.sprite.body.x, e.sprite.body.y, e.movingX, e.movingY) <= e.attackRange && e.target != -1) {
                        e.moving = false;
                        e.sprite.setVelocityX(0);
                        e.sprite.setVelocityY(0);
                    } else if(e.distance(e.sprite.body.x, e.sprite.body.y, e.movingX, e.movingY) > e.attackRange && e.target != -1){
                        this.physics.moveTo(e.sprite, e.movingX, e.movingY, 100);
                        //newEnemy.sprite.x - (newEnemy.sprite.displayWidth / 2), newEnemy.sprite.y - (newEnemy.sprite.displayHeight / 1.5)
                        e.healthBarBack.x = Math.round(e.sprite.x - (e.sprite.displayWidth / 2));
                        e.healthBarBack.y = Math.round(e.sprite.y - (e.sprite.displayHeight / 1.5));
                        e.healthBarFront.x = Math.round(e.sprite.x - (e.sprite.displayWidth / 2));
                        e.healthBarFront.y = Math.round(e.sprite.y - (e.sprite.displayHeight / 1.5));
                        e.moving = true;
                    }

                    if(e.sprite.body.x > e.movingX) {
                        e.sprite.setScale(-e.scale, e.scale);
                    } else {
                        e.sprite.setScale(e.scale, e.scale);
                    }
                }
                if(e.moving) {
                    if(e.sprite.anims.currentAnim.key != e.spriteName+'_walk')
                        e.sprite.anims.play(e.spriteName+'_walk', true);
                }
                if(e.target == -1) {
                    if(!e.moving) {
                        if(e.sprite.anims.currentAnim.key != e.spriteName+'_idle')
                            e.sprite.anims.play(e.spriteName+'_idle', true);
                    }
                }
                

                
        }

        for(let i=0;i<PH.playerList().length;i++) {
            let thisPlayer = PH.playerList()[i];
            if(thisPlayer) {
                if(!thisPlayer.sprite) {
                    break;
                }

                if(thisPlayer.distance(thisPlayer.sprite.body.x, thisPlayer.sprite.body.y, thisPlayer.localMoveX, thisPlayer.localMoveY) >= 10) {
                    thisPlayer.movingX = thisPlayer.localMoveX;
                    thisPlayer.movingY = thisPlayer.localMoveY;
                }

                if(thisPlayer.distance(thisPlayer.sprite.x, thisPlayer.sprite.y, thisPlayer.movingX, thisPlayer.movingY) <= 5) {
                    thisPlayer.moving = false;
                    thisPlayer.sprite.setVelocityX(0);
                    thisPlayer.sprite.setVelocityY(0);
                } else {
                    if(thisPlayer.distance(thisPlayer.sprite.body.x, thisPlayer.sprite.body.y, thisPlayer.movingX, thisPlayer.movingY) <= thisPlayer.attackRange && thisPlayer.target != -1) {
                        thisPlayer.moving = false;
                        thisPlayer.sprite.setVelocityX(0);
                        thisPlayer.sprite.setVelocityY(0);
                        thisPlayer.localMoveX = thisPlayer.sprite.body.x;
                        thisPlayer.localMoveY = thisPlayer.sprite.body.y;
                    } else {
                        this.physics.moveTo(thisPlayer.sprite, thisPlayer.movingX, thisPlayer.movingY, 100);
                        thisPlayer.moving = true;
                    }

                    if(thisPlayer.sprite.body.x > thisPlayer.movingX) {
                        thisPlayer.sprite.setScale(-scaleRatio, scaleRatio);
                    } else {
                        thisPlayer.sprite.setScale(scaleRatio, scaleRatio);
                    }
                }
                
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
                        }
                    }
                }


                if(thisPlayer.lastChatText != '') {
                    thisPlayer.chatText.text = thisPlayer.lastChatText;

                    thisPlayer.chatSprite.body.x = Math.round(thisPlayer.sprite.body.x + 65);
                    thisPlayer.chatSprite.body.y = Math.round(thisPlayer.sprite.body.y - 70);
                    thisPlayer.chatSprite.displayWidth = 100;
                    thisPlayer.chatSprite.displayHeight = 75;
                    thisPlayer.chatText.x = Math.round(thisPlayer.sprite.body.x + 75);
                    thisPlayer.chatText.y = Math.round(thisPlayer.sprite.body.y - 60);
                    let fontWeight = 225;
                    let screenRatio = this.cameras.main.width / this.cameras.main.height;
                    thisPlayer.chatText.setFontSize(Math.round((this.cameras.main.width / fontWeight) + (this.cameras.main.height / (fontWeight / screenRatio))));
                    //console.log(thisPlayer.chatText.width)
                    //thisPlayer.chatText.setOrigin(0.5);
                    thisPlayer.chatSprite.alpha = 1;
                    if(thisPlayer.lastChatTime < Date.now() - 7000) {
                        thisPlayer.lastChatText = '';
                        thisPlayer.chatText.text = '';
                        thisPlayer.chatSprite.alpha = 0;
                    }
                }
            }
            
        }

        /*if(localPlayer) {
            // if player reaches destination, stop moving
            if(localPlayer.distance(localPlayer.sprite.x, localPlayer.sprite.y, localPlayer.movingX, localPlayer.movingY) <= 20) {
                localPlayer.moving = false;
                localPlayer.sprite.setVelocityX(0);
                localPlayer.sprite.setVelocityY(0);
            } else {
                localPlayer.moving = true;
            }

            if(localPlayer.moving) {
                localPlayer.sprite.anims.play('walk', true);
            } else {
                localPlayer.sprite.anims.play('idle', true);
            }

        }*/

    }

}