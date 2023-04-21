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
    }
}
