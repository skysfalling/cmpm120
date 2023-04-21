class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0, 0);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let headerConfig = {
            fontFamily: 'Courier New',
            fontSize: '30px',
            backgroundColor: m_color.black,
            color: m_color.white,
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
            },
            fixedWidth: 100
        }

        // green UI background
        this.add.rectangle(game.config.width/2, game.config.height, game.config.width , borderUISize * 2, m_color.getColorHexInt("white")).setOrigin(0.5, 0.5);

        // green UI background
        this.add.rectangle(0, 0, game.config.width , borderUISize * 2, m_color.getColorHexInt("green")).setOrigin(0, 0);

        // score value
        this.scoreValueText = this.add.text(game.config.width/4 - (borderUISize + borderPadding), borderUISize, this.p1Score, headerConfig).setOrigin(0.5,0.5);

        // time passed
        this.timePassedText = this.add.text( (game.config.width*0.75) + (borderUISize + borderPadding), borderUISize, 'Time Passed', headerConfig).setOrigin(0.5,0.5);

        // title
        headerConfig.fixedWidth = 0;
        this.titleText = this.add.text(game.config.width/2, borderUISize, "Rocket Patrol", headerConfig).setOrigin(0.5,0.5);

        // GAME OVER flag
        this.gameOver = false;

        // << SETUP TIMER >>
        this.gameTimer = this.time.addEvent({
            delay: 60000, // 60 seconds in milliseconds
            callback: function(){
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', headerConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', headerConfig).setOrigin(0.5);
                this.gameOver = true;
            },
            callbackScope: this,
            loop: false
        });
    }

    update() {

        // << UPDATE CLOCK UI >>
        if (!this.gameOver) {
            const timePassed = Math.floor(this.gameTimer.getElapsedSeconds());
            this.timePassedText.setText(`${timePassed}/60`);
        }

        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
             this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
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
            if (this.time.now - this.lastFired > this.p1Rocket.fireDelay) {

                this.p1Rocket.sfxRocket.play();
                console.log("new bullet");

                // Create a new bullet sprite
                let newBullet = this.p1Rocket.bullets.create(this.p1Rocket.x,this.p1Rocket.y, 'bullet');
                this.p1Rocket.bullets.setVelocityY(-200, 1);
                newBullet.setActive(true);
                newBullet.setVisible(true);

                this.lastFired = this.time.now;
            }
        }

        // Iterate over the bullet group and check for collisions
        for (let bullet of this.p1Rocket.bullets.getChildren()) {
            if (this.checkCollision(bullet, this.ship03)) {
                this.shipExplode(this.ship03);
                bullet.destroy();
            }
            if (this.checkCollision(bullet, this.ship02)) {
                this.shipExplode(this.ship02);
                bullet.destroy();
            }
            if (this.checkCollision(bullet, this.ship01)) {
                this.shipExplode(this.ship01);
                bullet.destroy();
            }
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreValueText.text = this.p1Score; 
        
        this.sound.play('sfx_explosion');
      }
    

}