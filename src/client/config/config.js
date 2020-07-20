export default {
    
    ip: 'http://localhost:8001',
    loginPage: 'http://localhost:3000/login',
    debugMobile: false,
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
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    render: {
        antialias: true
    },
    dom: {
        createContainer: true
      }

  };