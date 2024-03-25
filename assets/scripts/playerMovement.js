

export default class PlayerMovement extends ScriptingAPI.MonoBehaviour {
    constructor(engineAPI, gameObject) {
        super(engineAPI, gameObject);
    }

    Start() {
        this.simepleTimer = 0;
    }

    Update() {
        this.simepleTimer += this.engineAPI.p5.deltaTime;
        if (this.gameObject.components.ParticleSystem !== undefined) {
            if (this.simepleTimer > 2000 && this.simepleTimer < 6000) {
                this.gameObject.components.ParticleSystem.Stop(true);
                //console.log("Particle System Stop")
            }
            else if (this.simepleTimer > 6000){
                this.gameObject.components.ParticleSystem.Play();
                //console.log("Particle System Play")
                this.simepleTimer = 0;
            }


            
        }

        
        
    }
}

