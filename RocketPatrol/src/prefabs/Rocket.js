// Rocket prefab
class Rocket extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        scene.physics.add.existing(this) // add to physics

        this.setScale(2);

        this.aimMoveSpeed = 2;         // pixels per frame
        this.rocketForce = 200;         // pixels per frame
        this.rocketRotationForce = 20;

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        
        // rocket fly animation config
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('rocket_fire', { 
                start: 0, 
                end: 1, 
                first: 0
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.play('fire');             // play explode animation


        // << TEXT GIZMO >>
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
        this.textGizmo.enable.call(this, "spaceship");

        /*
        // Add a slider to change the moveSpeed
        const slider = document.getElementById('speedSlider');
        slider.value = this.aimMoveSpeed;
        slider.addEventListener('input', (event) => {
            this.aimMoveSpeed = event.target.value;
        });
        */

        // create debug window
        let debugWindow = document.getElementById('debug-window');
        let rocketForce = document.createElement('p');
        rocketForce.innerText = 'rocketForce: ' + this.rocketForce;
        debugWindow.appendChild(rocketForce);

        // Initialize state machine
        this.states = {
            AIM: {
                name: "aim state",
                update: () => {
                    // left/right movement
                    if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                        this.x -= this.aimMoveSpeed;
                    } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                        this.x += this.aimMoveSpeed;
                    }

                    if (keyF.isDown) {this.currentState = this.states.FIRE;}

                    // Move the rocket
                    this.scene.physics.velocityFromRotation(0, 0, this.body.velocity);
                },
            },
            FIRE: {
                name: "fire state",
                enter: () => {
                    this.sfxRocket.play();
                },
                update: () => {
                    // Move the rocket
                    this.scene.physics.velocityFromAngle(this.angle - 90, this.rocketForce, this.body.velocity);

                    // Aim the rocket based on user input
                    if (keyLEFT.isDown) {
                        this.body.setAngularVelocity(this.body.angularVelocity - this.rocketRotationForce);
                    } else if (keyRIGHT.isDown) {
                        this.body.setAngularVelocity(this.body.angularVelocity + this.rocketRotationForce);
                    } else {
                        this.body.setAngularVelocity(Phaser.Math.Linear(this.body.angularVelocity, 0, 0.1));
                    }
                }
            }
        };

        // Set initial state
        this.currentState = this.states.AIM;
    }

    update() {

        this.currentState.update();

        this.textGizmo.update.call(this, this.currentState.name);


        // Check if rocket has gone out of bounds
        if (this.y < -this.height || this.x < -this.width || this.x > game.config.width + this.width) {
            this.reset();
        }
    }

    reset() {
        this.setActive(false);
        this.setVisible(false);
        this.body.stop();
        this.setRotation(0);
        this.scene.time.addEvent({
            delay: 10,
            callback: () => {
                this.scene.children.add(this);
                this.setActive(true);
                this.setVisible(true);
                this.x = game.config.width / 2;
                this.y = game.config.height - borderUISize - borderPadding;
                this.currentState = this.states.AIM;
            },
            loop: false
        });

        this.state = this.states.AIM;
    }
}
