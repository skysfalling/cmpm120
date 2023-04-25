class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }
  
    preload() {
        this.testGizmos = new Gizmos(this);
    }
  
    create() {

        /*
        this.boxGizmo = gizmos.box.create(this);
        this.lineRangeGizmo = gizmos.lineRange.create(this);
        this.textGizmo = gizmos.text.create(this, game.config.width/2, game.config.height/2, "Gizmos", 30);
        this.textGizmo2 = gizmos.text.create(this, game.config.width/2, game.config.height/2, "Gizmos", 30);
        this.circleGizmo = gizmos.circle.create(this)
        */

        // >> CREATE TEXT GIZMO :: [ scene , x, y, text, fontSize ]
        this.text = this.testGizmos.createText(this.infiniteRot, game.config.height/2, "text1", "50px");

    }
  
    update() {

        // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
        this.testGizmos.graphics.clear();

        // update infinite rotation
        if (this.infiniteRot < 360) { this.infiniteRot += 1; } else { this.infiniteRot = 0; }
        //console.log(this.rotation)

        // ---------------------------------------------------------------------------------------------------

        // >> CIRCLE GIZMO :: [ x, y, radius, color ]
        this.testGizmos.drawCircleLine(200, 200, 200, m_color.toHex("blue"));

        // >> RECT GIZMO :: [ x , y, width, height, rotation , color ]
        this.testGizmos.drawRect(200, 200, 200, 200, this.infiniteRot, m_color.toHex("green"));

        // >> LINE RANGE GIZMO :: [ scene , startpoint, endpoint, width, height, rotation, horzLine, vertLine ]
        let startpoint =  { x: 0, y: 0 };
        let endpoint = { x: game.config.width, y: game.config.height };
        let width = 100;
        let height = 100;
        this.testGizmos.lineRange(startpoint, endpoint, width, height);

        // >> UPDATE TEXT : [ textObject, x, y, text, fontSize ]
        this.testGizmos.updateText(this.text, this.infiniteRot, game.config.height/2, "test", "40px")

    }
}


  