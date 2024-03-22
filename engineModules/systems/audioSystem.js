import ModuleBase from './moduleBase.js';

export default class AudioSystem extends ModuleBase{
    constructor(engineAPI, gameConfig) {
        super(engineAPI, gameConfig);
    }

    Start(){
        // Temporary fix for audio context
        //
        const startContext = prompt("Allow audio to play", "yes");
        if (startContext === "yes"){
            this.audioContext = new AudioContext();
        }
        //
        // End of temporary fix
    
        
    }
}