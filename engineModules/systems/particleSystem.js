import ModuleBase from "./moduleBase.js";
import { RendererAPI } from "./renderer.js";

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
    transparency;
    lifeRemaining;
    //#endregion

    constructor(engineAPI, particleObj){
        this.engineAPI = engineAPI;
        this.particleConfig = particleConfig;

        this.#initialize(particleObj);
    }

    //#region Particle Callbacks
    Start(){

    }

    Update(dt){
        // integrate velocity, acceleration, and position using semi implicit euler method (https://gafferongames.com/post/integration_basics/)
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;

        this.position.x += this.velocity.x * dt; 
        this.position.y += this.velocity.y * dt;

        this.rotation += this.angularVelocity * dt;

        this.#render();
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
        this.transparency = particleObj.transparency;
        this.lifeRemaining = particleObj.lifeSpan;
    }

    #render(){
        const particleRenderTask = RendererAPI.ParticleRenderTask(this.engineAPI, {texture: this.texture, color: this.color, position: this.position, rotation: this.rotation, transparency: this.transparency});
        this.engineAPI.engine.renderer.addRenderTask(particleRenderTask);
    }
    //#endregion

    //#region Public Methods
    forceDestroy(){
        this.lifeRemaining = 0;
    }
}

class ParticleEmitterInstance{
    //#region Private Fields
    #particles = [];
    #enabled = false;
    #emitterConfig = {};
    #runtime = 0;
    #lastUpdateTime = performance.now();
    #systemInstance;

    // Attributes
    #lifeSpan;
    #position;
    #velocity;
    #acceleration;
    #rotation;
    #angularVelocity;
    #textureName;
    #color;
    #transparency;
    #spawnDelay;
    #amountOfBursts;
    #burstInterval;
    #burstCount;
    #continuousRate;
    #maxParticleCount;

    // Over Lifetime Behaviors
    #colorOverTimeData;
    #sizeOverTimeData;
    #transparencyOverTimeData;
    #rotationOverTimeData;
    #velocityOverTimeData;
    #accelerationOverTimeData;
    #angularVelocityOverTimeData;

    #continuousRateOverTimeData;
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

        const dt = Math.min(performance.now() - this.#lastUpdateTime, 50); // Capping the delta time to 50ms to prevent unwanted behavior
        this.#runtime += dt;

        this.#updateParticles(dt);
        
        this.#lastUpdateTime = performance.now();
    }
    //#endregion

    //#region Private Methods
    #resetEmitter(){
        this.#particles = [];
        this.#runtime = 0;
        this.#lastUpdateTime = performance.now();
    }

    #initailizeAttributes(){
        // Start Atributes
        this.#lifeSpan = this.#emitterConfig.startAttributes.lifeSpan;
        this.#position = this.#emitterConfig.startAttributes.position;
        this.#velocity = this.#emitterConfig.startAttributes.velocity;
        this.#acceleration = this.#emitterConfig.startAttributes.acceleration;
        this.#rotation = this.#emitterConfig.startAttributes.rotation;
        this.#angularVelocity = this.#emitterConfig.startAttributes.angularVelocity;

        // Render Atributes
        this.#textureName = this.#emitterConfig.renderAttributes.textureName;
        this.#color = this.#emitterConfig.renderAttributes.color;
        this.#transparency = this.#emitterConfig.renderAttributes.transparency;

        // Behaviors
        this.#spawnDelay = this.#emitterConfig.spawnBehavior.spawnDelay;

        this.#amountOfBursts = this.#emitterConfig.spawnBehavior.amountOfBursts;
        this.#burstInterval = this.#emitterConfig.spawnBehavior.burstInterval;
        this.#burstCount = this.#emitterConfig.spawnBehavior.burstCount;

        this.#continuousRate = this.#emitterConfig.spawnBehavior.continuousRate; // Particles per second
        this.#maxParticleCount = this.#emitterConfig.spawnBehavior.maxParticleCount;

        // Over Lifetime Attributes
        this.#colorOverTimeData = this.#emitterConfig.overLifetime.colorOverTimeData;
        this.#sizeOverTimeData = this.#emitterConfig.overLifetime.sizeOverTimeData;
        this.#transparencyOverTimeData = this.#emitterConfig.overLifetime.transparencyOverTimeData;
        this.#rotationOverTimeData = this.#emitterConfig.overLifetime.rotationOverTimeDatae;
        this.#velocityOverTimeData = this.#emitterConfig.overLifetime.velocityOverTimeData;
        this.#accelerationOverTimeData = this.#emitterConfig.overLifetime.accelerationOverTimeData;
        this.#angularVelocityOverTimeData = this.#emitterConfig.overLifetime.angularVelocityOverTimeData;

        // Over Lifetime Emmiter Behaviors
        this.#continuousRateOverTimeData = this.#emitterConfig.overLifetime.continuousRateOverTimeData;
    }

    #updateParticles(dt){
        //#region Update Logic
        for (const particle of this.#particles){
            // Apply Lifetime Behaviors
            if (this.#colorOverTimeData.curve === "linear") particle.color = ScriptingAPI.lerpColor(this.#colorOverTimeData.color1, this.#colorOverTimeData.color2, 1 - (particle.lifeRemaining / this.#lifeSpan)); // use custom color lerp function from scriptingAPI, colors must be in the form of {r: 0-255, g: 0-255, b: 0-255}
            if (this.#sizeOverTimeData.curve === "linear") particle.size = this.#applyLinearCurveOverTime(this.#sizeOverTimeData.size1, this.#sizeOverTimeData.size2, 1 - (particle.lifeRemaining / this.#lifeSpan));
            if (this.#transparencyOverTimeData.curve === "linear") particle.transparency = this.#applyLinearCurveOverTime(this.#transparencyOverTimeData.transparency1, this.#transparencyOverTimeData.transparency2, 1 - (particle.lifeRemaining / this.#lifeSpan));
            if (this.#rotationOverTimeData.curve === "linear") particle.rotation = this.#applyLinearCurveOverTime(this.#rotationOverTimeData.rotation1, this.#rotationOverTimeData.rotation2, 1 - (particle.lifeRemaining / this.#lifeSpan));
            if (this.#velocityOverTimeData.curve === "linear") particle.velocity = {x: this.#applyLinearCurveOverTime(this.#velocityOverTimeData.velocity1.x, this.#velocityOverTimeData.velocity2.x, 1 - (particle.lifeRemaining / this.#lifeSpan)), y: this.#applyLinearCurveOverTime(this.#velocityOverTimeData.velocity1.y, this.#velocityOverTimeData.velocity2.y, 1 - (particle.lifeRemaining / this.#lifeSpan))};
            if (this.#accelerationOverTimeData.curve === "linear") particle.acceleration = {x: this.#applyLinearCurveOverTime(this.#accelerationOverTimeData.acceleration1.x, this.#accelerationOverTimeData.acceleration2.x, 1 - (particle.lifeRemaining / this.#lifeSpan)), y: this.#applyLinearCurveOverTime(this.#accelerationOverTimeData.acceleration1.y, this.#accelerationOverTimeData.acceleration2.y, 1 - (particle.lifeRemaining / this.#lifeSpan))};
            if (this.#angularVelocityOverTimeData.curve === "linear") particle.angularVelocity = this.#applyLinearCurveOverTime(this.#angularVelocityOverTimeData.angularVelocity1, this.#angularVelocityOverTimeData.angularVelocity2, 1 - (particle.lifeRemaining / this.#lifeSpan));

            particle.lifeRemaining -= dt;
            particle.Update(dt);
        }
        //#endregion



        //#region Spawn Logic

        //#endregion
    }

    #applyLinearCurveOverTime(value1, value2, fraction){
        return value1 + (value2 - value1) * fraction;
    }

    //#endregion

    //#region Public Methods
    Play(){
        this.#resetEmitter();
        this.#initailizeAttributes();
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
            this.#emitters[emitterName].Start();
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
    //#endregion
}

