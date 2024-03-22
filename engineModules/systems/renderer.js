import ModuleBase from './moduleBase.js';


class RendererLoaders{
    constructor(p5){
        this.p5 = p5;
    }

    async preloadStateMachines(gameConfig){
        return new Promise(async (resolve, reject) => {
            try {
                const loadedMachines = {};
                const stateMachines = gameConfig.assets.stateMachines;
                const promises = [];

                for (const stateMachineName in stateMachines){
                    const stateMachine = stateMachines[stateMachineName];
                    const sm = await this.loadJSONAsync(stateMachine.pathToStateMachineConfig);
                    loadedMachines[stateMachine.stateMachineName] = sm;
                }

                await Promise.all(promises);
                resolve(loadedMachines);
            } catch (err) {
                reject(err);
            }
        });
    }

    async preloadAnimConfigs(gameConfig){
        return new Promise(async (resolve, reject) => {
            try {
                const animations = {};
                const promises = []

                for (const animName in gameConfig.assets.animations){
                    const anim = gameConfig.assets.animations[animName];
                    const animConfig = await this.loadJSONAsync(anim.pathToAnimationConfig);
                    animations[animName] = animConfig;
                }

                await Promise.all(promises);
                resolve(animations);
            } catch (err) {
                reject(err);
            }
        });
    }

    async preloadAnimSheets(gameConfig){
        return new Promise(async (resolve, reject) => {
            try {
                const animationsSheets = {};
                const animations = gameConfig.assets.animations;
                const promises = [];

                for (const animName in animations){
                    const anim = animations[animName];
                    const img = await this.loadImageAsync(anim.pathToSpriteSheet);
                    animationsSheets[animName] = img;
                }

                await Promise.all(promises);
                resolve(animationsSheets);
            } catch (err) {
                reject(err);
            }
        });
    }

    async preloadTextures(gameConfig){
        return new Promise(async (resolve, reject) => {
            try {
                const textures = {};
                const promises = gameConfig.assets.textures.map(async (texture) => {
                    const img = await loadImageAsync(texture.path);
                    textures[texture.name] = img;
                });

                await Promise.all(promises);
                resolve(textures);
            } catch (err) {
                reject(err);
            }
        });
    }

    loadImageAsync(path){
        return new Promise((resolve, reject) => {
            this.p5.loadImage(path, (img) => {
                resolve(img);
            }, (err) => {
                reject(err);
            });
        });
    }

    loadJSONAsync(path){
        return new Promise((resolve, reject) => {
            this.p5.loadJSON(path, (json) => {
                resolve(json);
            }, (err) => {
                reject(err);
            });
        });
    }
    
}



export default class Renderer extends ModuleBase{
    constructor(engineAPI, gameConfig) {
        super(engineAPI, gameConfig);
    }

    Preload(){
        this.rendererLoaders = new RendererLoaders(this.p5);
        return new Promise(async (resolve, reject) => {
            try{
                this.stateMachines = await this.rendererLoaders.preloadStateMachines(this.gameConfig);
                this.animationConfigs = await this.rendererLoaders.preloadAnimConfigs(this.gameConfig);
                this.animationsSheets = await this.rendererLoaders.preloadAnimSheets(this.gameConfig);
                this.textures = await this.rendererLoaders.preloadTextures(this.gameConfig);

                this.renderQueue = []; // This will be used to store all the objects that need to be rendered this frame and will be reset every frame

                resolve();
            }
            catch(err){
                reject(err);
            }
        });
    }

    

    Start(){
        this.p5.createCanvas(this.gameConfig.renderSettings.canvasSizeX, this.gameConfig.renderSettings.canvasSizeY);
    }

    Update(){
        this.p5.background(this.gameConfig.renderSettings.backgroundColor);

        for (const object of this.renderQueue){
            if (object.type === "image"){
                this.p5.push();
                this.p5.translate(100, 100)
                this.p5.image(object.img, object.dx, object.dy, object.dWidth, object.dHeight, object.sx, object.sy, object.sWidth, object.sHeight);
                this.p5.pop();
            }
        }
    }

    static RendererLoaders = RendererLoaders;
}


