import 'phaser';
import { getItemList } from './ItemHandler';

let itemList = getItemList();

export class AssetScene extends Phaser.Scene {
    constructor() {
        super('Assets');
    }

    preload() {

        this.load.image('blank', 'assets/sprites/icons/inventoryBack.png');


        this.load.image('loadingSplash', 'assets/sprites/LoHSplash.png');


        this.load.tilemapTiledJSON('map2', 'assets/maps/newmap.json'); 
        this.load.image('tiles1', 'assets/sprites/tilesets/mountain-ex.png');

        this.load.spritesheet('knight', 'assets/sprites/player_sprites/knight.png',
                              {frameWidth: 108, frameHeight: 108});
        
        this.load.atlas('minotaur', 'assets/sprites/npc_sprites/minotaur/spritesheet.png', 'assets/sprites/npc_sprites/minotaur/sprites.json')

        this.load.spritesheet('slime', 'assets/sprites/npc_sprites/slime.png',
                                { frameWidth: 64, frameHeight: 50 });

        this.load.spritesheet('wormWarrior', 'assets/sprites/npc_sprites/wormWarrior.png',
                                { frameWidth: 32, frameHeight: 32 });

        this.load.bitmapFont('prstart', 'assets/fonts/test/font.png', 'assets/fonts/test/font.fnt');
        

        for(let i=0;i<itemList.length;i++) {
            this.load.image(itemList[i][1], 'assets/sprites/items/'+itemList[i][1]+'.png');
            console.log(itemList[i][1])
        }

    }

    create() {
        let map2 = this.make.tilemap({ key: 'map2' });
        let tileset = map2.addTilesetImage('mountain', 'tiles1', 32, 32, 1, 2);
        let ground = map2.createStaticLayer('ground', tileset, 0, 0);
        let layer1 = map2.createStaticLayer('layer1', tileset, 0, 0);
        let layer2 = map2.createStaticLayer('layer2', tileset, 0, 0);
        let layer3 = map2.createStaticLayer('layer3', tileset, 0, 0);
        let objects = map2.createStaticLayer('objects', tileset, 0, 0);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('knight', { start: 10, end: 13 }),
            frameRate: 6,
            repeat: -1
        });

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
            key: 'wormWarrior_idle',
            frames: this.anims.generateFrameNumbers('wormWarrior', { start: 0, end: 7 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'wormWarrior_attack',
            frames: this.anims.generateFrameNumbers('wormWarrior', { start: 10, end: 30 }),
            frameRate: 20, 
            repeat: 0
        });

        this.anims.create({
            key: 'wormWarrior_death',
            frames: this.anims.generateFrameNumbers('wormWarrior', { start: 0, end: 7 }),
            frameRate: 3,
            repeat: 0
        });

        this.anims.create({
            key: 'wormWarrior_walk',
            frames: this.anims.generateFrameNumbers('wormWarrior', { start: 0, end: 7 }),
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
    }
}