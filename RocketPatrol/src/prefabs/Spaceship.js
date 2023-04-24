// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, name, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        
        this.name = name;
        this.scene = scene;

        // active position
        this.x = Math.floor(x);
        this.y = Math.floor(y);

        // start position
        this.startX = this.x;
        this.startY = this.y;

        // start scale / rotation
        this.setScale(2);
        this.setAngle(-90);

        // speed
        this.moveSpeed = game.settings.spaceshipSpeed;
    
        // spawn range
        this.spawnHeightOffsetMin =  -25; 
        this.spawnHeightOffsetMax = 25; 

        // death state
        this.dead = false;

        // point value
        this.points = pointValue; 

        // spaceship fly animation config
        this.anims.create({
            key: 'spaceship_fly',
            frames: this.anims.generateFrameNumbers('spaceship_fly', { 
                start: 0, 
                end: 2, 
                first: 0
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.play('spaceship_fly');  // play fly animation

        // << BOX COLLIDER GIZMO >>
        this.boxColliderGizmo = {
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
            },

            disable: function(){
                // Clear previous graphics
                this.graphics.clear();
            }
        };
        this.boxColliderGizmo.enable.call(this);
    
        // << SPAWN RANGE GIZMO >>
        this.spawnRangeGizmo = {
            enable: function() {
                this.graphics = scene.add.graphics();
            },
        
            update: function() {

                // << SPAWN OUTLINE >>
                let spawnRangeSize = this.spawnHeightOffsetMax - this.spawnHeightOffsetMin;
                this.graphics.lineStyle(1, 0xff0000, 1);
                this.graphics.strokeRoundedRect(0, this.startY - spawnRangeSize/2, game.config.width, spawnRangeSize, 1); 

                // << ROCKET START Y LINE >>
                this.graphics.lineStyle(0.1, 0xffff00, 1);
                this.graphics.beginPath();
                this.graphics.moveTo(0, this.startY);
                this.graphics.lineTo(game.config.width, this.startY);
                this.graphics.closePath();
                this.graphics.strokePath();

            },

            disable: function(){
                // Clear previous graphics
                this.graphics.clear();
            }
        };
        this.spawnRangeGizmo.enable.call(this);

        // << TEXT GIZMO >>
        this.spaceshipNameGizmo = {
            enable: function(text = "gizmos") {
                // Create the text object
                this.textObject = scene.add.text(this.x, this.y, text);
                this.textObject.setOrigin(2, 0.5);
                this.textObject.setFontSize(10); // Set font size to 24 pixels
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
        this.spaceshipNameGizmo.enable.call(this, "gizmo");
    }

    update() {
        // move spaceship left
        this.x -= this.moveSpeed;

        // 'kill' spaceship once hits right edge
        if(this.x <= 0 && !this.dead) {
            
            this.dead = true;
            this.reset();

        }
        
        // update gizmos
        this.boxColliderGizmo.update.call(this);
        this.spawnRangeGizmo.update.call(this);

        // Add white text to spaceship
        this.spaceshipNameGizmo.update.call(this, this.name);
    }

    // position reset
    reset() {

        // disable
        this.setActive(false);
        this.setVisible(false);

        // get random height
        let min = this.spawnHeightOffsetMin;
        let max = this.spawnHeightOffsetMax;
        let randomHeight = Math.floor(Math.random() * (max - min + 1)) + min;

        // add random height to start spawn
        this.x = this.startX;
        this.y = this.startY + randomHeight;

        // enable
        this.setActive(true);
        this.setVisible(true);

        this.dead = false;
    }
}
