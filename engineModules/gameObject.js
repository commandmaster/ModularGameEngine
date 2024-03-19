export default class GameObject {
    constructor(engineAPI, gameObjectConfig) {
        this.engineAPI = engineAPI;
        this.gameObjectConfig = gameObjectConfig;

        this.gameEngine = engineAPI.gameEngine;
        this.p5 = engineAPI.gameEngine.p5;
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