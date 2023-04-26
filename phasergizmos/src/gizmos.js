class Gizmos {
    constructor(scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics();

        this.showRectGizmos = true;
        this.showCircleGizmos = true;

    }
  
    //#region  [[ CIRCLE ]]
    drawCircle(x, y, radius, color, rotation = 0, lineWidth = 1, depth = 1) {
        this.circleLayer = this.scene.add.graphics();

        this.circleLayer.lineStyle(lineWidth, color, lineWidth);
        var circleConfig = new Phaser.Geom.Circle(x, y, radius);
        this.circleLayer.strokeCircleShape(circleConfig);
        this.circleLayer.depth = depth; // ensure circle layer is on top

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
        console.log("draw rect " + x + "" + y  );

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
        this.graphics.depth = 1;
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
        graphics.depth = 1;
    }
    
    //#region  [[ LINE RANGE ]] : line from start - end ,  colored lines show height
    horzlineRange(startX, endX, y, heightRange) {
        // [[ MAIN LINE]] 
        this.line({x: startX, y: y}, {x: endX, y: y}, 0xffffff, 0.2);

        // [[ RANGE WIDTH ]]
        // draw rect at center point
        let rectX = (startX + endX) / 2;
        this.drawRect(rectX, y, (startX + endX), heightRange, 0, 0xff0000, 1);

        console.log("LINERANGE: " + rectX + " , " + y);
        
        // [[ MID POINT ]]
        // white crossline >>
        const midpointStart = {
            x: (startX + endX) / 2,
            y: y + (heightRange / 2)
        };
        const midpointEnd = {
            x: (startX + endX) / 2,
            y: y - (heightRange / 2)
        };
        this.line(midpointStart, midpointEnd, 0xffffff, 0.2);
        
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
