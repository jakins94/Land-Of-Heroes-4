import 'phaser';
import GameScene from './scenes/GameScene';

export default class Inventory {
    constructor(){

        /*let bmd = this.add.bitmapData(50, 50);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, 50, 50);
            bmd.ctx.fillStyle = '#FFFFFF';
            bmd.ctx.fill();*/
        //let bmd = this.textures.addCanvas('test');


        this.inventoryOpen = false;


        //this.invWidth = (this.game.camera.view.width / 3);
        //this.invHeight = this.game.camera.view.height;
        //this.invStartX = (this.game.camera.view.width - invWidth) + 2;

        /*this.invWidth = 300;
        this.invHeight = 800;
        this.invStartX = 750;

        this.invAlpha = 0.5;

        // stat box and stat text variables
        this.statBoxWidth = invWidth - 20;
        this.statBoxHeight = 125;
        this.statStartX = invStartX + 10;
        this.statStartY = 200;
        this.statSpacingY = 15;
        this.statShadowDistX = 1;
        this.statShadowDistY = 1;
        this.statShadowBlur = 1;
        this.statAnchorX = 0;
        this.statAnchorY = 0;
        this.statAlpha = 0.5;

        // name box variables
        this.nameBoxWidth = invWidth - 20;
        this.nameBoxHeight = 30;
        this.nameBoxStartX = invStartX + 10;
        this.nameBoxStartY = 10;

        // item box variables
        this.itemStartX = statStartX - 2;
        this.itemStartY = statStartY + statBoxHeight + 10;
        this.itemWidth = 32;
        this.itemHeight = 32;
        this.itemSpacing = 4;
        this.itemSlots = 36;

        // equipment box variables
        this.equipWidth = 32;
        this.equipHeight = 32;
        this.equipSpacing = 8;
        this.equipStartX = invStartX - equipSpacing - equipWidth + (invWidth / 2) - 15;
        this.equipStartY = 60;
        this.equipSlots;


        // placeholder stats
        this.maxHP           = Math.round(Math.random() * 600);
        this.HP              = maxHP;
        this.maxMP           = Math.round(Math.random() * 600);
        this.MP              = maxMP;
        this.strength        = Math.round(Math.random() * 120);
        this.dexterity       = Math.round(Math.random() * 120);
        this.intelligence    = Math.round(Math.random() * 120);


        this.itemSlotShadow = [];
        this.itemSlot = [];
        this.equipSlotShadow = [];
        this.equipSlot = [];*/

    }

    startInventory() {
        this.scene.get('Game');

        this.test = this.physics.add.sprite(0, 0, 'invSlot');
    }


    toggleInventory() {
        if(this.inventoryOpen) {
            this.inventoryOpen = false;
        } else {
            this.inventoryOpen = true;
        }
    }
}