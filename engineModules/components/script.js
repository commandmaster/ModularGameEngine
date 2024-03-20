import ComponentBase from "./componentBase";

export default class Script extends ComponentBase {
    constructor(engineAPI, componentConfig) {
        super(engineAPI, componentConfig);
    }

    Preload(){
        this.scriptInstance = new this.componentConfig.scriptClass(this.engineAPI);
    }

    Start(){
        this.scriptInstance.Start();
    }

    Update(){
        this.scriptInstance.Update();
    }
}