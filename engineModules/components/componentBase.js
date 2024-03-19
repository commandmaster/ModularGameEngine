export default class ComponentBase{
    constructor(engineAPI, componentConfig) {
        this.componentConfig = componentConfig;
        this.engineAPI = engineAPI;

        this.gameEngine = engineAPI.gameEngine;
        this.p5 = engineAPI.gameEngine.p5;

        this.gameObject = engineAPI.gameObject;
    }

    Preload(){
        return;
    }

    Start(){
        return;
    }

    Update(){
        return;
    }
    
}