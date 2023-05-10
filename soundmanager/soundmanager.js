class SoundManager{
    constuctor(game){
        this.game = game;
    }

    load(){
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    playSFX(soundKey, volume){
        var SFX = null;
        SFX= gameObject.sound.play(soundKey, volume);
    }
    //create STATE MACHINE
    //state of re/a song, and transitions
    update(){

    }
}