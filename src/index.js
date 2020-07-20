import Phaser from 'phaser';
import config from './client/config/config';
import GameScene from './client/scenes/GameScene';
import { InvScene } from './client/Inventory';
import { ChatScene } from './client/ChatHandler';
import { UIScene } from './client/GUI';
import { EquipScene } from './client/Equipment';
import { AssetScene } from './client/AssetScene';
import { CharSelectScene } from './client/CharSelect';
import { LoadingScene } from './client/LoadingScene';
import { characterSelected } from './client/Socket';

let gameReady = false;
let numScenesLoaded = 0;
let scenesToLoad = 5;
let charSlotSelected = -1;

// id is the character slot selected, we will load it when the game starts
export function startGameScenes(id) {
    let phaser = window.game;
    let scene = phaser.scene.getScene('CharSelect');

    charSlotSelected = id;

    phaser.scene.stop('CharSelect');



    phaser.scene.start('Game');
    phaser.scene.start('Inv'); 
    phaser.scene.start('Chat'); 
    phaser.scene.start('UI');
    phaser.scene.start('Equip');
    phaser.scene.start('Loading');
    phaser.scene.bringToTop('Loading');
    



    console.log('Scenes started', phaser.scene)

}

export function sceneLoaded() {
    let phaser = window.game;

    numScenesLoaded++;
    console.log('numScenesLoaded', numScenesLoaded)
    

    if(numScenesLoaded == scenesToLoad) {
        console.log('all scenes loaded')
        phaser.scene.stop('Loading');
        characterSelected(charSlotSelected);
    }
}


export class Game extends Phaser.Game {
    constructor() {
        super(config); 

        this.testCharSelect = true; // for debugging


        this.startGame();
    }

    startGame() {

        this.scene.add('Assets', AssetScene);
        this.scene.start('Assets');

        this.scene.add('Loading', LoadingScene);
        this.scene.add('Game', GameScene);
        this.scene.add('Inv', InvScene);
        this.scene.add('Chat', ChatScene);
        this.scene.add('UI', UIScene);
        this.scene.add('Equip', EquipScene);


        if(this.testCharSelect == false) {
            this.scene.start('Game');
            this.scene.start('Inv'); 
            this.scene.start('Chat'); 
            this.scene.start('UI');
            this.scene.start('Equip');
        } else {
            this.scene.add('CharSelect', CharSelectScene);
            this.scene.start('CharSelect');
            //console.log(this.scene.getScenes())
            //this.getScene('CharSelect').setVisible(false, 'CharSelect');
        }

        
        this.events.on('hidden', function() {}, this);
        this.events.on('visible', function() {}, this);

    }
}

window.onload = function() { 
    window.game = new Game();
}