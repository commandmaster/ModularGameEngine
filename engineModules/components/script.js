import ComponentBase from "./componentBase";

export default class Script extends ComponentBase {
    constructor(engineAPI, componentConfig) {
        super(engineAPI, componentConfig);
    }

    Preload(){
        import(componentConfig.scriptPath).then((module) => {
            this.script = new module.default(engineAPI, componentConfig);
        });
    }
}