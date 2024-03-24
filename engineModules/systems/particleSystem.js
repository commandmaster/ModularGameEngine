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
        for (const systemName in this.systemInstances){
            this.systemInstances[systemName].Update();
        }
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
    size;
    //#endregion

    constructor(engineAPI, particleObj){
        this.engineAPI = engineAPI;
        this.particleObj = particleObj;

        this.#initialize(particleObj);
    }

    //#region Particle Callbacks
    Start(){

    }

    Update(dt){
        // integrate velocity, acceleration, and position using semi implicit euler method (https://gafferongames.com/post/integration_basics/)
        this.velocity.x += this.acceleration.x * dt / 1000;
        this.velocity.y += this.acceleration.y * dt / 1000;

        this.position.x += this.velocity.x * dt / 1000; 
        this.position.y += this.velocity.y * dt / 1000;

        this.rotation += this.angularVelocity * dt / 1000;

        this.#render();
    }
    //#endregion

    //#region Private Methods
    #initialize(particleObj){
        this.texture = this.engineAPI.engine.renderer.textures[particleObj.textureName];
        this.color = particleObj.color;
        this.position = particleObj.position;
        this.velocity = particleObj.velocity;
        this.acceleration = particleObj.acceleration;
        this.rotation = particleObj.rotation;
        this.angularVelocity = particleObj.angularVelocity;
        this.transparency = particleObj.transparency;
        this.lifeRemaining = particleObj.lifeSpan;
        this.size = particleObj.size;
    }

    #render(){
        const particleRenderTask = new RendererAPI.ParticleRenderTask(this.engineAPI, {texture: this.texture, color: this.color, position: this.position, rotation: this.rotation, transparency: this.transparency, size: this.size});
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
    #timeLastBurst = 0;
    #continousTimer = 0;

    // Attributes
    #lifeSpan;
    #position;
    #velocity;
    #acceleration;
    #rotation;
    #angularVelocity;
    #size;
    #textureName;
    #color;
    #transparency;
    #spawnDelay;
    #amountOfBursts;
    #burstCount;
    #burstInterval;   
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
        this.p5 = engineAPI.p5;
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
        this.#timeLastBurst = 0;
        this.#continousTimer = 0;
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
        
        // Over Lifetime Emmiter Behaviors
        this.#continuousRateOverTimeData = this.#emitterConfig.overLifetime.continuousRateOverTimeData;
    }

    #updateParticles(dt){
        //#region Update Logic
        this.#timeLastBurst += dt;
        this.#continousTimer += dt;

        for (const particle of this.#particles){
            // Apply Lifetime Behaviors
            if (this.#colorOverTimeData.curve === "linear") particle.color = ScriptingAPI.lerpColor(this.#colorOverTimeData.color1, this.#colorOverTimeData.color2, 1 - (particle.lifeRemaining / this.#lifeSpan)); // custom color lerp function from scriptingAPI, colors must be in the form of {r: 0-255, g: 0-255, b: 0-255}
            if (this.#sizeOverTimeData.curve === "linear") particle.size = this.#applyLinearCurveOverTime(this.#sizeOverTimeData.size1, this.#sizeOverTimeData.size2, 1 - (particle.lifeRemaining / this.#lifeSpan));
            if (this.#transparencyOverTimeData.curve === "linear") particle.transparency = this.#applyLinearCurveOverTime(this.#transparencyOverTimeData.transparency1, this.#transparencyOverTimeData.transparency2, 1 - (particle.lifeRemaining / this.#lifeSpan));
            if (this.#sizeOverTimeData.curve === "linear") particle.size = this.#applyLinearCurveOverTime(this.#sizeOverTimeData.size1, this.#sizeOverTimeData.size2, 1 - (particle.lifeRemaining / this.#lifeSpan));

            particle.lifeRemaining -= dt;
            particle.Update(dt);

            if (particle.lifeRemaining <= 0){
                this.#particles.splice(this.#particles.indexOf(particle), 1);
            }
        }
        //#endregion

        //#region Spawn Logic
        if (this.#runtime < this.#spawnDelay) return;
        

        //spawn particles in bursts
        if (this.#amountOfBursts > 0 && this.#timeLastBurst >= this.#burstInterval){
            
            for (let i = 0; i < this.#burstCount; i++){
                this.#spawnParticle();
            }

            this.#amountOfBursts--;
        }

        //spawn particles continuously
        const particlesToSpawn = Math.floor(this.#continousTimer / (1000 / this.#continuousRate))
        for (let i = 0; i < particlesToSpawn; i++){
            if (this.#particles.length >= this.#maxParticleCount) break;
            this.#spawnParticle();
        }

        this.#continousTimer -= particlesToSpawn * (1000 / this.#continuousRate);


        //#endregion
    }

    #applyLinearCurveOverTime(value1, value2, fraction){
        return value1 + (value2 - value1) * fraction;
    }

    #spawnParticle(){
        const generateVectorInRange = (vector1, vector2) => {
            const biggerX = vector1.x > vector2.x ? vector1.x : vector2.x;
            const smallerX = vector1.x < vector2.x ? vector1.x : vector2.x;
            const biggerY = vector1.y > vector2.y ? vector1.y : vector2.y;
            const smallerY = vector1.y < vector2.y ? vector1.y : vector2.y;
            
            return {x: this.p5.random(smallerX, biggerX), y: this.p5.random(smallerY, biggerY)};
        }

        const multiplyVector = (vector, scalar) => {
            return {x: vector.x * scalar, y: vector.y * scalar};
        }

        const randomPos = generateVectorInRange({x:this.#position.x1, y:this.#position.y1}, {x:this.#position.x2, y:this.#position.y2});
        const randomVel = multiplyVector(generateVectorInRange({x:this.#velocity.x1, y:this.#velocity.y1}, {x:this.#velocity.x2, y:this.#velocity.y2}), this.#velocity.scalar);
        const randomAcc = multiplyVector(generateVectorInRange({x:this.#acceleration.x1, y:this.#acceleration.y1}, {x:this.#acceleration.x2, y:this.#acceleration.y2}), this.#acceleration.scalar);
        const randomRot = this.p5.random(this.#rotation.z1, this.#rotation.z2);
        const randomAngVel = this.p5.random(this.#angularVelocity.z1, this.#angularVelocity.z2);
        this.#particles.push(new ParticleInstance(this.engineAPI, {textureName: this.#textureName, color: this.#color, position: randomPos, velocity: randomVel, acceleration: randomAcc, rotation: randomRot, angularVelocity: randomAngVel, transparency: this.#transparency, lifeSpan: this.#lifeSpan, size: this.#sizeOverTimeData.size1}));
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

