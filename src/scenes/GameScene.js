import 'phaser';
import Player from '../Player';
import { InvScene } from '../Inventory';
 
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');

        this.p = new Player();
        this.inv = new InvScene(this);

        this.zoomLevel = 0;
    }

    preload() {
        this.load.spritesheet('knight', 'assets/sprites/player_sprites/knight.png',
                              {frameWidth: 108, frameHeight: 108});

        this.load.tilemapTiledJSON('map', 'assets/maps/newmap.json');
        this.load.image('tiles1', 'assets/sprites/tilesets/mountain-ex.png');
        this.load.image('invSlot', 'assets/sprites/icons/inventorySlot.png');
    }

    create() {

        // set world and camera bounds, 100x100 map is 3200x3200
        this.cameras.main.setBounds(0, 0, 3200, 3200);
        this.physics.world.setBounds(0, 0, 3200, 3200);

        // add invisible background
        let bg = this.physics.add.sprite(0, 0).setInteractive();
        bg.fixedToCamera = true;
        bg.setScale(3200, 3200);

        // when you click the invisible background it gets cursor position relative to the map
        bg.on('pointerdown', (pointer) => {
            this.p.movingX = this.input.activePointer.worldX;
            this.p.movingY = this.input.activePointer.worldY;
            this.physics.moveTo(this.p.sprite, this.p.movingX, this.p.movingY, 100);
        });

        // init map
        let map = this.make.tilemap({ key: 'map' });
        let tileset = map.addTilesetImage('mountain', 'tiles1', 32, 32, 1, 2);
        let ground = map.createStaticLayer('ground', tileset, 0, 0);
        let layer1 = map.createStaticLayer('layer1', tileset, 0, 0);
        let layer2 = map.createStaticLayer('layer2', tileset, 0, 0);
        let layer3 = map.createStaticLayer('layer3', tileset, 0, 0);
        let objects = map.createStaticLayer('objects', tileset, 0, 0);




        this.p.sprite = this.physics.add.sprite(400, 150, 'knight');
        this.p.sprite.setScale(0.7, 0.7);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('knight', { start: 10, end: 13 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.p.sprite.anims.play('idle', true)

        /*this.input.on('pointerdown', (pointer) => {
            this.p.movingX = pointer.x;
            this.p.movingY = pointer.y;
            this.physics.moveToObject(this.p.sprite, pointer, 100);
        });*/

        // initialize camera following and default zoom level
        this.cameras.main.startFollow(this.p.sprite, false, 0.08, 0.08);
        this.cameras.main.setZoom(1.5);

        //this.cameras.main.roundPixels = true;

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

        this.input.keyboard.on('keydown', (event) => {
            if(event.code == 'KeyI') {
                this.inv.toggleInventory();
            }
        });

        //this.inv.startInventory();

    }

    update() {

        if(this.p.sprite) {
            // if player reaches destination, stop moving
            if(this.p.distance(this.p.sprite.x, this.p.sprite.y, this.p.movingX, this.p.movingY) <= 20) {
                this.p.moving = false;
                this.p.sprite.setVelocityX(0);
                this.p.sprite.setVelocityY(0);
            } else {
                this.p.moving = true;
            }

            if(this.p.moving) {
                this.p.sprite.anims.play('walk', true);
            } else {
                this.p.sprite.anims.play('idle', true);
            }

        }

    }

}