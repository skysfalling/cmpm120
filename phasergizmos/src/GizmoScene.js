class GizmoScene extends Phaser.Scene {
    constructor() {
        super('GizmosScene');

        this.speed = 1;

        this.infiniteRot = 0;

        this.infiniteMove = 0;
        this.moveFlip = false;

        this.lineRange = 100;
    }
  
    preload() {

        // [[ MAIN GIZMOS OBJECT ]]
        this.Gizmos = new Gizmos(this);
    }
  
    create() {
        // >> CREATE TEXT GIZMO :: [ scene , x, y, text, fontSize ]
        // this "created" instance will not move
        this.text = this.Gizmos.createText(this.infiniteRot, game.config.height/2, "text1", "50px");
        
        // >> TOGGLE DEBUG :: //
        const toggleButton = document.querySelector("#toggle-gizmos");

        // store a reference to the scene object in a variable
        const scene = this;

        // toggle squares
        toggleButton.innerHTML = "squares: " + scene.Gizmos.showRectGizmos;
        toggleButton.addEventListener("click", function () { 
            scene.Gizmos.showRectGizmos = !scene.Gizmos.showRectGizmos; 
            toggleButton.innerHTML = "squares: " + scene.Gizmos.showRectGizmos;
        });

    }
  
    update() {

        // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
        this.Gizmos.graphics.clear();

        // update infinite move
        if (!this.moveFlip && this.infiniteMove < 1) { this.infiniteMove += 0.01 * this.speed}
        else if (!this.moveFlip && this.infiniteMove >= 1) {this.moveFlip = true; this.infiniteMove = 1;}
        else if (this.moveFlip && this.infiniteMove > 0) {this.infiniteMove -= 0.01 * this.speed;}
        else if (this.moveFlip && this.infiniteMove <= 0) {this.moveFlip = false; this.infiniteMove = 0;}
        //console.log(this.move)

        // update infinite rotation
        if (this.infiniteRot < 360) { this.infiniteRot += this.speed; } else { this.infiniteRot = 0; }
        //console.log(this.rotation)

        // >> DEBUG SLIDER : : // 
        // Get slider percentage from HTML page (( range 0 - 100 ))
        let debugSpeedSlider = document.getElementById('speed-slider');
        this.speed = debugSpeedSlider.value / 10;  // turns slider into percentage
        // Set slider text
        let debugSpeed = document.getElementById('speed-info');
        debugSpeed.innerHTML = "speed " + this.speed;

        

        // ---------------------------------------------------------------------------------------------------

        // >> CIRCLE GIZMO :: [ x, y, radius, color, rotation, lineWidth ]
        this.Gizmos.drawCircle(screen.center.x, screen.center.y, 200, color_pal.toInt("blue"), this.infiniteRot);
        
        
        if (this.Gizmos.showRectGizmos == true)
        {
            console.log("show rect " + this.Gizmos.showRectGizmos);
            // >> RECT LINE GIZMO :: [ x , y, width, height, rotation , color ]
            this.Gizmos.drawRect(screen.center.x, screen.center.y, 200, 200, this.infiniteRot, color_pal.toInt("green"));

            // >> RECT FILL GIZMO :: [ x , y, width, height, rotation , color ]
            this.Gizmos.drawRectFill(screen.center.x, screen.center.y, 100, 100, -this.infiniteRot, color_pal.toInt("pink"));
        }

        // >> LINE RANGE GIZMO :: [ scene , startpoint, endpoint, width, height, rotation, horzLine, vertLine ]
        let startpoint =  { x: 50, y: 250 };
        let endpoint = { x: screen.width - 50, y: 250 };

        this.Gizmos.horzlineRange(1, 500, 250, 50);
        this.Gizmos.vertLineRange(250, 0, 500, 50);


        // >> UPDATE TEXT : [ textObject, x, y, text, fontSize ]
        // create() text first, then call this function
        this.Gizmos.updateText(this.text, this.infiniteRot + screen.center.x / 3, screen.center.y, "hello <3", "40px");

    }
}


  