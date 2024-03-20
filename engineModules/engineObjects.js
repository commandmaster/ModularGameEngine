export default class GameObject {
    constructor(engineAPI, gameObjectConfig) {
        this.engineAPI = engineAPI;
        this.gameObjectConfig = gameObjectConfig;

        this.gameEngine = engineAPI.gameEngine;
        this.p5 = engineAPI.gameEngine.p5;
    }

    async Preload(){
        return;
    }

    Start(){
        return;
    }

    Update(){
        return;
    }
    
}

export class Camera{
    constructor(engineAPI, cameraConfig) {
        this.engineAPI = engineAPI;
        this.cameraConfig = cameraConfig;

        this.gameEngine = engineAPI.gameEngine;
        this.p5 = engineAPI.gameEngine.p5;
    }

    async Preload(){
        return;
    }

    Start(){
        return;
    }

    Update(){
        return;
    }
}