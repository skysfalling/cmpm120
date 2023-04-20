// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 2;         // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket')  // add rocket sfx

        this.bullets = scene.physics.add.group({
            key: 'bullet',
            frameQuantity: 0,
            gridAlign: {
                x: 25,
                y: 25,
                width: 1,
                height: 12,
                cellWidth: 50,
                cellHeight: 50
            },
            bounceY: 1,
            collideWorldBounds: false,
            outOfBoundsKill: true,
            origin: 0.5,
            setVelocityY: 200
        });

        // Variables for firing delay
        this.fireDelay = 500; // Delay in milliseconds, e.g. 500ms
        this.lastFired = 0;

    }


    update() {
        // left/right movement
        if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        }
        
        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            this.isFiring = true;
            this.lastFired = 0;
        }
        else if (Phaser.Input.Keyboard.JustUp(keyF))
        {
            this.isFiring = false;
        }

        // << FIRE DELAY >>
        if (this.isFiring)
        {
            if (this.scene.time.now - this.lastFired > this.fireDelay) {

                this.sfxRocket.play();
                console.log("new bullet");

                // Create a new bullet sprite
                let newBullet = this.bullets.create(this.x,this.y, 'bullet');
                this.bullets.setVelocityY(-200, 1);
                newBullet.setActive(true);
                newBullet.setVisible(true);

                this.lastFired = this.scene.time.now;
            }
        }

    }



    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
