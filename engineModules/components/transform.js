import ComponentBase from "./componentBase.js";

export default class Transform extends ComponentBase {
    constructor(engineAPI, componentConfig) {
        super(engineAPI, componentConfig);

        this.position = this.componentConfig.position;
        this.rotation = this.componentConfig.rotation;
        this.scale = this.componentConfig.scale;
    }

    Start() {
        
    }

    Update() {

    }
}