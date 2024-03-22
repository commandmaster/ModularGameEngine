import Transform from "./components/transform.js";
import Rigidbody from "./components/rigidbody.js";
import Script from "./components/script.js";
import Animator from "./components/animator.js";



export class GameObjectInstance {
    constructor(engineAPI, gameObjectConfig) {
        this.engineAPI = engineAPI;
        this.gameObjectConfig = gameObjectConfig;

        this.gameEngine = engineAPI.gameEngine;
        this.p5 = engineAPI.gameEngine.p5;
    }

    async Preload(){
        return new Promise(async (resolve, reject) => { 
            this.initializeComponents();
            const preloadPromises = [];
            for (const componentName in this.components) {
                preloadPromises.push(this.components[componentName].Preload());
            }
            try {
                await Promise.all(preloadPromises);
                resolve();
            } catch (error) {
                reject(error);
            }
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

        if (componentName === "Animator"){
            this.components[componentName] = new Animator(this.engineAPI, componentConfig);
        }

        if (componentName === "scriptingComponent"){
            this.components[componentName] = new Script(this.engineAPI, componentConfig);
        }
    }

    Start(){
        for (const componentName in this.components) {
            this.components[componentName].Start();
        }
    }

    Update(){
        for (const componentName in this.components) {
            this.components[componentName].Update();
        }
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