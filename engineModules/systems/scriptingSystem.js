import ModuleBase from './moduleBase.js';

export default class ScriptingSystem extends ModuleBase{
    constructor(engineAPI, gameConfig) {
        super(engineAPI, gameConfig);
    }

    Preload(){
        return new Promise((resolve, reject) => { 

            resolve();
        });
    }
    
    
}