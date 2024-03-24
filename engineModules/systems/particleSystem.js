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
    //#region Public Fields
    texture;
    color;
    position;
    velocity;
    acceleration;
    rotation;
    angularVelocity;
    lifeSpan;
    transparency;
    //#endregion

    constructor(engineAPI, particleObj){
        this.engineAPI = engineAPI;
        this.particleConfig = particleConfig;

        this.#initialize(particleObj);
    }

    //#region Particle Callbacks
    Start(){

    }

    Update(){
        
    }
    //#endregion

    //#region Private Methods
    #initialize(particleObj){
        this.texture = this.engineAPI.renderer.textures[particleObj.textureName];
        this.color = particleObj.color;
        this.position = particleObj.position;
        this.velocity = particleObj.velocity;
        this.acceleration = particleObj.acceleration;
        this.rotation = particleObj.rotation;
        this.angularVelocity = particleObj.angularVelocity;
        this.lifeSpan = particleObj.lifeSpan;
        this.transparency = particleObj.transparency;
    }

    #render(){
        
    }
    //#endregion

    //#region Public Methods
    forceDestroy(){
        this.lifeSpan = 0;
    }
}

class ParticleEmitterInstance{
    //#region Private Fields
    #particles = [];
    #enabled = false;
    #emitterConfig = {};
    #systemInstance;
    //#endregion

    //#region Public Fields
    
    //#endregion

    constructor(engineAPI, emitterConfig, systemInstance){
        this.engineAPI = engineAPI;
        this.#emitterConfig = emitterConfig;
        this.#systemInstance = systemInstance;
    }

    //#region Particle Emitter Callbacks
    Start(){
        this.Play();
    }

    Update(){
        if (!this.#enabled) return;
        this.#updateParticles();
    }
    //#endregion

    //#region Private Methods
    #initializeParticles(){
        this.#particles = [];
    }

    #updateParticles(){
        //#region Update Logic
        for (const particle of this.#particles){
            
        }
        //#endregion



        //#region Spawn Logic

        // Start Atributes
        const lifeSpan = this.#emitterConfig.startAttributes.lifeSpan;
        const position = this.#emitterConfig.startAttributes.position;
        const velocity = this.#emitterConfig.startAttributes.velocity;
        const acceleration = this.#emitterConfig.startAttributes.acceleration;
        const rotation = this.#emitterConfig.startAttributes.rotation;
        const angularVelocity = this.#emitterConfig.startAttributes.angularVelocity;

        // Render Atributes
        const textureName = this.#emitterConfig.renderAttributes.textureName;
        const color = this.#emitterConfig.renderAttributes.color;
        const transparency = this.#emitterConfig.renderAttributes.transparency;

        // Spawn Behaviors
        const spawnDelay = this.#emitterConfig.spawnBehavior.spawnDelay;
        const spawnType = this.#emitterConfig.spawnBehavior.spawnType;
        const spawnRate = this.#emitterConfig.spawnBehavior.spawnRate;
        const maxCount = this.#emitterConfig.spawnBehavior.maxCount;
    

        // Spawn Particles
        if (spawnType === "burst"){
            for (let i = 0; i < spawnRate; i++){
                const particleObj = {
                    lifeSpan: lifeSpan,
                    position: position,
                    velocity: velocity,
                    acceleration: acceleration,
                    rotation: rotation,
                    angularVelocity: angularVelocity,
                    textureName: textureName,
                    color: color,
                    transparency: transparency
                }
                this.#particles.push(new ParticleInstance(this.engineAPI, particleObj));
            }
        }

        //#endregion
    }
    //#endregion

    //#region Public Methods
    Play(){
        this.#initializeParticles();
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

