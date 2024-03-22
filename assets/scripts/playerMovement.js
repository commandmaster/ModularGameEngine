

export default class PlayerMovement extends ScriptingAPI.MonoBehaviour {
    constructor(engineAPI, gameObject) {
        super(engineAPI, gameObject);
    }

    Start() {
        console.log("PlayerMovement Start");
        console.log(this.gameObject)
    }

    Update() {
        
    }
}

