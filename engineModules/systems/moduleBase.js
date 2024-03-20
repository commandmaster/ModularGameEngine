export default class ModuleBase {
    constructor(engineAPI) {
        this.engineAPI = engineAPI;
        this.engine = engineAPI.engine;
        this.p5 = engineAPI.engine.p5;
    }

    Preload() {
        return new Promise((resolve, reject) => { 
            resolve();
        });
    }

    Start() {
        return;
    }

    Update() {
        return;
    }
}