let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
          debug: false,
          gravity: { y: 0 }
      }
    },  
    scene: [ Menu, Play ],
    pixelArt: true
}

const game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;

let color_pal = {
    pink: "#F6518A",
    blue: "#4C86A8", 
    green: "#62C25B",
    white: "#FFFFFF",
    black: "#101119",
    toInt: function(colorName) {
      return parseInt(this[colorName].replace("#", "0x"));
    }
  };