class Gizmos {
    constructor(scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics();

        this.showRectGizmos = true;
        this.showCircleGizmos = true;

    }
  
    //#region  [[ CIRCLE ]]
    drawCircle(x, y, radius, color, rotation, lineWidth = 2) {
        this.graphics.lineStyle(lineWidth, color, lineWidth);
        var circleConfig = new Phaser.Geom.Circle(x, y, radius);
        this.graphics.strokeCircleShape(circleConfig);

        let center = { x: x, y: y };
        let radiusPoint = { x: x + radius, y: y };

        const radians = Phaser.Math.DegToRad(rotation);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        
        radiusPoint.x = x + radius * cos;
        radiusPoint.y = y + radius * sin;
        this.line(center, radiusPoint, color, lineWidth);


    }

    drawCircleFill(x, y, radius, color) {
        this.graphics.fillStyle(color);
        this.graphics.fillCircle(x, y, radius);
    }
    //#endregion

    //#region  [[ RECT ]]
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

    drawRectFill(x, y, width, height, rotation, color, lineWidth = 2) {
        this.graphics.fillStyle(color, 1);
        this.graphics.lineStyle(lineWidth, color);
        
        // [[ SET ORIGIN ( 0.5 , 0.5 ) ]]
        const rectX = x - width / 2;
        const rectY = y - height / 2;

        // calculate rotation angle
        const topLeft = this.rotatePoint(rectX, rectY, x, y, rotation);
        const topRight = this.rotatePoint(rectX + width, rectY, x, y, rotation);
        const bottomRight = this.rotatePoint(rectX + width, rectY + height, x, y, rotation);
        const bottomLeft = this.rotatePoint(rectX, rectY + height, x, y, rotation);
        
        // draw the rectangle
        this.graphics.beginPath();
        this.graphics.moveTo(topLeft.x, topLeft.y);
        this.graphics.lineTo(topRight.x, topRight.y);
        this.graphics.lineTo(bottomRight.x, bottomRight.y);
        this.graphics.lineTo(bottomLeft.x, bottomLeft.y);
        this.graphics.closePath();
        this.graphics.fill();
        this.graphics.stroke();
    }
    //#endregion
    
    line (startpoint, endpoint, color, lineWidth = 1, opacity = 1) {
        const graphics = this.graphics;
        graphics.lineStyle(lineWidth, color);
        graphics.beginPath();
        graphics.moveTo(startpoint.x, startpoint.y);
        graphics.lineTo(endpoint.x, endpoint.y);
        graphics.closePath();
        graphics.strokePath();
    }
    
    //#region  [[ LINE RANGE ]] : line from start - end ,  colored lines show width / height
    lineRange(startpoint, endpoint, width, height) {

        // TODO : Midpoint "Vertical" Line

        // [[ MAIN LINE]] 
        this.line(startpoint, endpoint, 0xffffff, 0.2);

        // [[ RANGE WIDTH ]]
        // red outerline >>  - width / 2
        const startpointLeft = { x: startpoint.x - width/2, y: startpoint.y + width/2 };
        const endpointLeft = { x: endpoint.x - width/2, y: endpoint.y + width/2 };
        this.line(startpointLeft, endpointLeft, 0xff0000, 1);

        // green outerline >> + width / 2
        const startpointRight = { x: startpoint.x + width/2, y: startpoint.y - width/2 };
        const endpointRight = { x: endpoint.x + width/2, y: endpoint.y - width/2 };
        this.line(startpointRight, endpointRight, 0x00ff00, 1);

        // [[ MID POINT ]]
        // white crossline >>
        const midpointStart = {
            x: (startpointRight.x + endpointRight.x) * 0.5,
            y: (startpointRight.y + endpointRight.y) * 0.5
        };
        const midpointEnd = {
            x: (startpointLeft.x + endpointLeft.x) * 0.5,
            y: (startpointLeft.y + endpointLeft.y) * 0.5
        };
        this.line(midpointStart, midpointEnd, 0xffffff, 0.2);

        // [[ END LINES]]
        // white end line
        const topLeft = { x: startpoint.x - width/2, y: startpoint.y + width/2 };
        const bottomLeft = { x: startpoint.x + width/2, y: startpoint.y - width/2 };
        const topRight = { x: endpoint.x - width/2, y: endpoint.y + width/2 };
        const bottomRight = { x: endpoint.x + width/2, y: endpoint.y - width/2 };
        this.line(topLeft, bottomLeft, 0xffffff, 1);
        this.line(topRight, bottomRight, 0xffffff, 1);
          
    }
    //#endregion

    //#region [[ TEXT ]]
    // create or update a text object
    createText(x, y, text = "gizmos", fontSize) {
        var textObject = this.scene.add.text(x, y, text);
        textObject.setOrigin(0.5, 0.5);
        textObject.setVisible(true);
        textObject.setFont(fontSize);
        this.scene.add.existing(textObject);
        return textObject;
    }

    // create or update a text object
    updateText(textObject, x, y, text = "gizmos", fontSize) {
        textObject.x = x;
        textObject.y = y;
        textObject.text = text;
        textObject.setFont(fontSize);
    }
    //#endregion

    //#region  [[ HELPER ]]
    // rotate point
    rotatePoint(x, y, cx, cy, angle) {
        const radians = angle * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return { x: nx, y: ny };
    }
    //#endregion
}   
