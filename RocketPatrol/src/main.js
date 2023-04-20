let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    parent: 'game-container',
    scene: [ Menu, Play ],
}

const game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;

let m_color = {
    pink: "#F6518A",
    blue: "#4C86A8", 
    green: "#62C25B",
    white: "#FFFFFF",
    black: "#101119",
    getColorHexInt: function(colorName) {
      return parseInt(this[colorName].replace("#", "0x"));
    }
  };