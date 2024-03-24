import ModuleBase from "./moduleBase.js";

export default class ParticleSystem extends ModuleBase{ 
    //#region Private Fields
    #systemConfigs = {};
    //#endregion

    //#region Public Fields
    systemInstances = {};
    //#endregion

    constructor(engineAPI, gameConfig) {
        super(engineAPI, gameConfig);
    }

    //#region Enigine Callbacks
    Preload(){
        return new Promise(async (resolve, reject) => {
            this.#systemConfigs = await this.#loadSystems(this.gameConfig);
            resolve();
        });
    }

    Start(){
        
    }

    Update(){
        
    }
    //#endregion



    //#region Public Methods
    SpawnSystem(systemName){
        this.systemInstances[systemName] = new SystemOfEmittersInstance(this.engineAPI, this.#systemConfigs[systemName]);
        this.systemInstances[systemName].Start();
    }
    //#endregion



    //#region Private Methods
    async #loadSystems(gameConfig){
        return new Promise(async (resolve, reject) => {
            const tempConfigs = {};
            for (const systemName in gameConfig.assets.particleSystems){
                const systemConfig = await this.#loadSystem(gameConfig, systemName);
                tempConfigs[systemName] = systemConfig;
            }
            resolve(tempConfigs);
        });
    }

    #loadSystem(gameConfig, systemName){
        return new Promise((resolve, reject) => {
            const systemConfigPath = gameConfig.assets.particleSystems[systemName].pathToParticleSystemConfig;
            this.p5.loadJSON(systemConfigPath, (data) => {
                resolve(data);
            });
        });
    }
    //#endregion
}




class ParticleInstance{
    constructor(engineAPI, particleConfig){
        this.engineAPI = engineAPI;
        this.particleConfig = particleConfig;
    }

    //#region Particle Callbacks
    Start(){

    }

    Update(){

    }
    //#endregion

    //#region Private Methods
    Initialize(){

    }
    //#endregion
}

class ParticleEmitterInstance{
    //#region Private Fields
    #particles = [];
    #enabled = false;
    //#endregion

    constructor(engineAPI, emitterConfig, systemInstance){
        this.engineAPI = engineAPI;
        this.emitterConfig = emitterConfig;
        this.systemInstance = systemInstance;
    }

    //#region Particle Emitter Callbacks
    Start(){
        this.Play();
    }

    Update(){
        if (!this.#enabled) return;
        
    }
    //#endregion

    //#region Private Methods
    #Initialize(){
        this.#particles = [];
        for (let i = 0; i < this.emitterConfig.maxParticles; i++){
            this.#particles.push(new ParticleInstance(this.engineAPI, this.emitterConfig));
        }
    }
    //#endregion

    //#region Public Methods
    Play(){
        this.#Initialize();
        this.#enabled = true;
    }

    Stop(){
        this.#enabled = false;
    }
    //#endregion
}

class SystemOfEmittersInstance{
    //#region Private Fields
    #emitters = {};
    #enabled = false;
    #systemConfig = {};
    //#endregion

    constructor(engineAPI, systemConfig){
        this.engineAPI = engineAPI;
        this.#systemConfig = systemConfig;
    }

    //#region Particle System Callbacks
    Start(){
        this.Play();
    }

    Update(){
        if (!this.#enabled) return;
        for (const emitterName in this.#emitters){
            this.#emitters[emitterName].Update();
        }
    }
    //#endregion



    //#region Private Methods
    #InitializeEmitters(){ 
        this.#emitters = {};

        for (const emitterName in this.#systemConfig.emitters){
            const emitterConfig = this.#systemConfig.emitters[emitterName];
            this.#emitters[emitterName] = new ParticleEmitterInstance(this.engineAPI, emitterConfig, this);
        }
    }
    //#endregion



    //#region Public Methods
    Play(){
        this.#InitializeEmitters();
        this.#enabled = true;
        for (const emitterName in this.#emitters){
            this.#emitters[emitterName].Play();
        }
    }

    Stop(){
        this.#enabled = false;
        for (const emitterName in this.#emitters){
            this.#emitters[emitterName].Stop();
        }
    }
    //#endregion

    //#region Public Getters
    get config (){
        return this.#systemConfig;
    }
}

