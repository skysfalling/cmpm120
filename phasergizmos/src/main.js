let config = {
    type: Phaser.CANVAS,
    width: 500,
    height: 500,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
          debug: false,
          gravity: { y: 0 }
      }
    },  
    scene: [ Play ],
    pixelArt: true
}
const game = new Phaser.Game(config);

let m_color = {
    pink: "#F6518A",
    blue: "#4C86A8", 
    green: "#62C25B",
    white: "#FFFFFF",
    black: "#101119",
    toHex: function(colorName) {
      return parseInt(this[colorName].replace("#", "0x"));
    }
  };

  const gizmos = {
    box: {
      create: function(scene) {
        scene.graphics = scene.add.graphics();
        return this;
      },
    
      update: function(scene, color, x, y, width, height, rotation) {
        scene.graphics.clear();
        scene.graphics.lineStyle(2, color, 1);
    
        // [[ SET ORIGIN ( 0.5 , 0.5 ) ]]
        const rectX = x - width / 2;
        const rectY = y - height / 2;
    
        // calculate rotation angle
        const topLeft = this.rotatePoint(rectX, rectY, x, y, rotation);
        const topRight = this.rotatePoint(rectX + width, rectY, x, y, rotation);
        const bottomRight = this.rotatePoint(rectX + width, rectY + height, x, y, rotation);
        const bottomLeft = this.rotatePoint(rectX, rectY + height, x, y, rotation);
    
        // draw rect
        scene.graphics.beginPath();
        scene.graphics.moveTo(topLeft.x, topLeft.y);
        scene.graphics.lineTo(topRight.x, topRight.y);
        scene.graphics.lineTo(bottomRight.x, bottomRight.y);
        scene.graphics.lineTo(bottomLeft.x, bottomLeft.y);
        scene.graphics.closePath();
        scene.graphics.stroke();
      },

      rotatePoint: function(x, y, cx, cy, angle) {
        const radians = angle * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return { x: nx, y: ny };
      },
    
      destroy: function(scene) {
        scene.graphics.clear();
      },
    },

    lineRange: {
      // TODO : Midpoint "Vertical" Line
      create: function(scene) {
        scene.graphics = scene.add.graphics();
        return this;
      },
      update: function(scene, startpoint, endpoint, width, height) {

          // mid line
          scene.graphics.lineStyle(0.25, 0xffff00, 1);
          scene.graphics.beginPath();
          scene.graphics.moveTo(startpoint.x, startpoint.y);
          scene.graphics.lineTo(endpoint.x, endpoint.y);
          scene.graphics.closePath();
          scene.graphics.strokePath();

          // red outerline
          scene.graphics.lineStyle(1, 0xff0000, 1);
          scene.graphics.beginPath();
          scene.graphics.moveTo(startpoint.x - width/2, startpoint.y + height/2);
          scene.graphics.lineTo(endpoint.x - width/2, endpoint.y + height/2);
          scene.graphics.closePath();
          scene.graphics.strokePath();

          // green outerline
          scene.graphics.lineStyle(1, 0x00ff00, 1);
          scene.graphics.beginPath();
          scene.graphics.moveTo(startpoint.x + width/2, startpoint.y - height/2);
          scene.graphics.lineTo(endpoint.x + width/2, endpoint.y - height/2);
          scene.graphics.closePath();
          scene.graphics.strokePath();
      
          // white end line
          scene.graphics.lineStyle(1, 0xffffff, 1);
          scene.graphics.beginPath();
          scene.graphics.moveTo(startpoint.x + width/2, startpoint.y - height/2);
          scene.graphics.lineTo(startpoint.x - width/2, startpoint.y + height/2);
          scene.graphics.moveTo(endpoint.x + width/2, endpoint.y - height/2);
          scene.graphics.lineTo(endpoint.x - width/2, endpoint.y + height/2);
          scene.graphics.closePath();
          scene.graphics.strokePath();
        
      },
      destroy: function(scene) {
        scene.graphics.clear();
      }
    },

    text: {
      create: function(scene, x, y, text = "gizmos", fontSize) {
        scene.textObject = scene.add.text(x, y, text);
        scene.textObject.setOrigin(0.5, 0.5);
        scene.textObject.setVisible(true);
        scene.textObject.setFont(10);
        scene.add.existing(scene.textObject);
        return this;
      },
      update: function(scene, x, y, text = "gizmos", fontSize) {
        scene.textObject.setPosition(x, y);
        scene.textObject.text = text;
        scene.textObject.setFont(fontSize);

      },
      setFont: function(scene, font){
        scene.textObject.setFont(font);
      },
      destroy: function(scene) {
        scene.textObject.setVisible(false);
      }
    },

    circle: {
      create: function(scene) {
        scene.graphics = scene.add.graphics();
        return this;
      },
      update: function(scene, color, x, y, radius) {        
        // draw circle
        scene.graphics.lineStyle(1, color, 1);
        var circleConfig = new Phaser.Geom.Circle(x, y, radius);
        scene.graphics.strokeCircleShape(circleConfig);

      },
      destroy: function(scene) {
        scene.graphics.clear();
      },
    }

  }

