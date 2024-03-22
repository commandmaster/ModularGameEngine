import Transform from "./components/transform.js";
import Rigidbody from "./components/rigidbody.js";
import Script from "./components/script.js";
import StateMachine from "./components/stateMachine.js";



export class GameObjectInstance {
    constructor(engineAPI, gameObjectConfig) {
        this.engineAPI = engineAPI;
        this.gameObjectConfig = gameObjectConfig;

        this.gameEngine = engineAPI.gameEngine;
        this.p5 = engineAPI.gameEngine.p5;
        this.parent = gameObjectConfig.parent;
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
            this.components[componentName] = new Transform(this.engineAPI, componentConfig, this);
        }

        if (componentName === "Rigidbody"){
            this.components[componentName] = new Rigidbody(this.engineAPI, componentConfig, this);
        }

        if (componentName === "StateMachine"){
            this.components[componentName] = new StateMachine(this.engineAPI, componentConfig, this);
        }

        if (componentName === "ScriptingComponent"){
            this.components[componentName] = new Script(this.engineAPI, componentConfig, this);
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