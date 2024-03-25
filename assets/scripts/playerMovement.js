

export default class PlayerMovement extends ScriptingAPI.MonoBehaviour {
    constructor(engineAPI, gameObject) {
        super(engineAPI, gameObject);
    }

    Start() {
        console.log(this.engine.particleSystem)
        //this.engine.particleSystem.SpawnSystem("testSystem1")   
    }

    Update() {
        
    }
}

