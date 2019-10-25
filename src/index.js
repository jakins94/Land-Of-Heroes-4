import Phaser from 'phaser';
import config from './config/config';
import GameScene from './scenes/GameScene';
import { InvScene } from './Inventory';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add('Game', GameScene);
    this.scene.start('Game');

    this.scene.add('Inv', InvScene);
    this.scene.start('Inv');
    this.scene.setVisible(false, 'Inv')
  }
}

window.onload = function() {
  window.game = new Game();
}