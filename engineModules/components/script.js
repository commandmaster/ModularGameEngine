import ComponentBase from "./componentBase.js";

export default class Script extends ComponentBase {
    constructor(engineAPI, componentConfig) {
        super(engineAPI, componentConfig);
    }

    Start() {
        for (const script of this.componentConfig.scripts) {
            this.engineAPI.engine.scriptingSystem.addScriptInstance(script.name, this.gameObject);
        }
    }

    
}