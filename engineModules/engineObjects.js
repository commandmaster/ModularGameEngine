import Transform from "./components/transform.js";
import Rigidbody from "./components/rigidbody.js";
import Script from "./components/script.js";
import Animator from "./components/animator.js";


export default class GameObject {
    constructor(engineAPI, gameObjectConfig) {
        this.engineAPI = engineAPI;
        this.gameObjectConfig = gameObjectConfig;

        this.gameEngine = engineAPI.gameEngine;
        this.p5 = engineAPI.gameEngine.p5;
    }

    async Preload(){
        return new Promise((resolve, reject) => { 
            this.initializeComponents();
            resolve();
        });
    }

    initializeComponents(){
        this.components = {};
        for (const componentName in this.gameObjectConfig.components) {
            const componentConfig = this.gameObjectConfig.components[componentName];
            this.addComponent(componentName, componentConfig);
        }
    }

    addComponent(componentName, componentConfig){
        if (componentName === "Transform"){
            this.components[componentName] = new Transform(this.engineAPI, componentConfig);
        }

        if (componentName === "Rigidbody"){
            this.components[componentName] = new Rigidbody(this.engineAPI, componentConfig);
        }

        if (componentName === "Script"){
            this.components[componentName] = new Script(this.engineAPI, componentConfig);
        }

        if (componentName === "Animator"){
            this.components[componentName] = new Animator(this.engineAPI, componentConfig);
        }
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