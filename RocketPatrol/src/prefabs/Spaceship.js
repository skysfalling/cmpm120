// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;         // pixels per frame 

        // Create the text object
        this.textObject = scene.add.text(this.x, this.y, 'test', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' });
        this.textObject.setOrigin(0.5);
        this.textObject.setVisible(true);
        scene.add.existing(this.textObject);  // Add the text object as a child of the spaceship
    }

    update() {
        // move spaceship left
        this.x -= this.moveSpeed;
        // wrap around from left edge to right edge
        if(this.x <= 0 - this.width) {
            this.reset();
        }

        this.rotation += 0.02;

        // Update the position of the text object
        this.textObject.setPosition(this.x, this.y);
    }

    // position reset
    reset() {
        this.x = game.config.width;

        // Reset the position of the text object
        this.textObject.setPosition(this.x, this.y);
    }
}
