class Gizmos {
    constructor(scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.textObjects = [];

    }

    enable() {
        this.graphics.setVisible(true);
    }
    
    disable() {
        this.graphics.setVisible(false);
    }
  
    drawCircleLine(x, y, radius, color, lineWidth = 2) {
        this.graphics.lineStyle(lineWidth, color, 1);
        var circleConfig = new Phaser.Geom.Circle(x, y, radius);
        this.graphics.strokeCircleShape(circleConfig);
    }

    drawCirclFill(x, y, radius, color) {
        this.graphics.fillStyle(color);
        this.graphics.fillCircle(x, y, radius);
    }

    drawRect(x, y, width, height, rotation, color, lineWidth = 2) {
        this.graphics.lineStyle(lineWidth, color, 1);

        // [[ SET ORIGIN ( 0.5 , 0.5 ) ]]
        const rectX = x - width / 2;
        const rectY = y - height / 2;

        // calculate rotation angle
        const topLeft = this.rotatePoint(rectX, rectY, x, y, rotation);
        const topRight = this.rotatePoint(rectX + width, rectY, x, y, rotation);
        const bottomRight = this.rotatePoint(rectX + width, rectY + height, x, y, rotation);
        const bottomLeft = this.rotatePoint(rectX, rectY + height, x, y, rotation);

        // draw rect
        this.graphics.beginPath();
        this.graphics.moveTo(topLeft.x, topLeft.y);
        this.graphics.lineTo(topRight.x, topRight.y);
        this.graphics.lineTo(bottomRight.x, bottomRight.y);
        this.graphics.lineTo(bottomLeft.x, bottomLeft.y);
        this.graphics.closePath();
        this.graphics.stroke();
    }

    // rotate point
    rotatePoint(x, y, cx, cy, angle) {
        const radians = angle * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return { x: nx, y: ny };
    }

    lineRange(startpoint, endpoint, width, height) {

        // TODO : Midpoint "Vertical" Line

        // horizontal "Main" line
        this.graphics.lineStyle(0.5, 0xffff00, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(startpoint.x, startpoint.y);
        this.graphics.lineTo(endpoint.x, endpoint.y);
        this.graphics.closePath();
        this.graphics.strokePath();

        // red outerline
        this.graphics.lineStyle(1, 0xff0000, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(startpoint.x - width/2, startpoint.y + height/2);
        this.graphics.lineTo(endpoint.x - width/2, endpoint.y + height/2);
        this.graphics.closePath();
        this.graphics.strokePath();

        // green outerline
        this.graphics.lineStyle(1, 0x00ff00, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(startpoint.x + width/2, startpoint.y - height/2);
        this.graphics.lineTo(endpoint.x + width/2, endpoint.y - height/2);
        this.graphics.closePath();
        this.graphics.strokePath();
    
        // white end line
        this.graphics.lineStyle(1, 0xffffff, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(startpoint.x + width/2, startpoint.y - height/2);
        this.graphics.lineTo(startpoint.x - width/2, startpoint.y + height/2);
        this.graphics.moveTo(endpoint.x + width/2, endpoint.y - height/2);
        this.graphics.lineTo(endpoint.x - width/2, endpoint.y + height/2);
        this.graphics.closePath();
        this.graphics.strokePath();
          
    }

    // create or update a text object
    createText(x, y, text = "gizmos", fontSize) {
        var textObject = this.scene.add.text(x, y, text);
        textObject.setOrigin(0.5, 0.5);
        textObject.setVisible(true);
        textObject.setFont(fontSize);
        this.scene.add.existing(textObject);
        this.textObjects.push(textObject);
        return textObject;
    }

    // create or update a text object
    updateText(textObject, x, y, text = "gizmos", fontSize) {
        textObject.x = x;
        textObject.y = y;
        textObject.text = text;
        textObject.setFont(fontSize);
    }
}   
