export default {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    scale: {
        parent: 'phaser-example',
        mode: Phaser.Scale.RESIZE
    },
    physics: {
        default: 'arcade'
    },
    render: {
        antialias: true
    }
  };