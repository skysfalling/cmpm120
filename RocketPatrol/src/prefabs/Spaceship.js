// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        
        this.scene = scene;
        this.x = Math.floor(x);
        this.y = Math.floor(y);

        this.spawnHeight = game.config.height * 0.66;

        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;         // pixels per frame 

        this.boxGizmo = {
            enable: function() {
                this.graphics = scene.add.graphics();
            },
        
            update: function() {

                // << COLLIDER OUTLINE >>
                this.graphics.clear();
                this.graphics.lineStyle(2, 0xffff00, 1);
                const rectWidth = this.width;
                const rectHeight = this.height;
                const rectX = this.x - rectWidth / 2;
                const rectY = this.y - rectHeight / 2;
                this.graphics.strokeRoundedRect(rectX, rectY, rectWidth, rectHeight, 1);

                // << SPAWN OUTLINE >>
                this.graphics.lineStyle(1, 0xff0000, 1);
                this.graphics.strokeRoundedRect(0, borderUISize * 2, game.config.width, this.spawnHeight, 1); 
            },

            disable: function(){
                // Clear previous graphics
                this.graphics.clear();
            }
        };

        this.textGizmo = {
            enable: function(text = "gizmos") {
                // Create the text object
                this.textObject = scene.add.text(this.x, this.y, text);
                this.textObject.setOrigin(0.5, 2);
                this.textObject.setVisible(true);
                scene.add.existing(this.textObject);  // Add the text object as a child of the spaceship
            },
            update: function(text = "gizmos") {
                // Update the position of the text object
                this.textObject.setPosition(this.x, this.y);
                this.textObject.setText(text);
            },
            disable: function(){
                // Clear previous graphics
                this.textObject.setVisible(true);
            },
            setText: function(newText) {
                // Set the text of the text object
                this.text = newText;
                if (this.textObject) {
                    this.textObject.setText(newText);
                }
            }

        };

        // Add white border around spaceship
        this.boxGizmo.enable.call(this);
    
        this.textGizmo.enable.call(this, "spaceship");
    }

    update() {
        // move spaceship left
        this.x -= this.moveSpeed;
        // wrap around from left edge to right edge
        if(this.x <= 0 - this.width) {
            this.reset();
        }

        // Add white border around spaceship
        this.boxGizmo.update.call(this);

        // Add white text to spaceship
        this.textGizmo.update.call(this, this.x + "/" + this.y);
    }

    // position reset
    reset() {
        // get random height
        let min = borderUISize * 2;
        let max = min + this.spawnHeight;
        let randomHeight = Math.floor(Math.random() * (max - min + 1)) + min;

        this.x = game.config.width;
        this.y = randomHeight;

        // Reset the position of the text object
        this.textObject.setPosition(this.x, this.y);
    }
}
