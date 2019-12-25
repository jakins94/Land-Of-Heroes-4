import Phaser from 'phaser';
import config from './client/config/config';
import GameScene from './client/scenes/GameScene';
import { InvScene } from './client/Inventory';
import { ChatScene } from './client/ChatHandler';
import { UIScene } from './client/GUI';
import { EquipScene } from './client/Equipment';



class Game extends Phaser.Game {
    constructor() {
        super(config); 

        this.startGame();
    }

    startGame() {

        this.scene.add('Game', GameScene);
        this.scene.start('Game');
        this.scene.add('Inv', InvScene);
        this.scene.start('Inv'); 
        this.scene.add('Chat', ChatScene);
        this.scene.start('Chat'); 
        this.scene.add('UI', UIScene);
        this.scene.start('UI');
        this.scene.add('Equip', EquipScene);
        this.scene.start('Equip');
        this.events.on('hidden', function() {}, this);
        this.events.on('visible', function() {}, this);

    }
}

window.onload = function() { 
    window.game = new Game();
}