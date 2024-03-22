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

class BaseRenderTask{
    constructor(engineAPI){
        this.engineAPI = engineAPI;
    }

    render(){
        return;
    }
}

class AnimationRenderTask extends BaseRenderTask{
    constructor(engineAPI, {img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight, rotation}){
        super(engineAPI);
        this.img = img;
        this.dx = dx;
        this.dy = dy;
        this.dWidth = dWidth;
        this.dHeight = dHeight;
        this.sx = sx;
        this.sy = sy;
        this.sWidth = sWidth;
        this.sHeight = sHeight;      
        this.rotation = rotation;  
    }

    render(){
        this.engineAPI.p5.push();
        this.engineAPI.p5.translate(this.dx, this.dy);
        this.engineAPI.p5.rotate(this.rotation);
        this.engineAPI.p5.image(this.img, 0, 0, this.dWidth, this.dHeight, this.sx, this.sy, this.sWidth, this.sHeight);
        this.engineAPI.p5.pop();
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

        this.enableCameraRendering = false;
    }

    Update(){
        this.Render();

    }

    Render(){
        this.p5.push();
        
        // P5 Draw Configuation
        this.p5.imageMode(this.p5.CENTER);
        this.p5.rectMode(this.p5.CENTER);
        this.p5.angleMode(this.p5.DEGREES);

        // Canvas Reszing
        if (this.p5.width !== this.p5.windowWidth || this.p5.height !== this.p5.windowHeight) this.p5.resizeCanvas(this.p5.windowWidth, this.p5.windowHeight);

        // Color the background
        this.p5.background(this.gameConfig.renderSettings.backgroundColor);

        if (this.enableCameraRendering){
            if (this.camera !== undefined && this.camera !== null){
                this.camera.Update();
            }   
        }

        for (const renderable of this.renderQueue){
            if (renderable instanceof AnimationRenderTask){
                renderable.render();
            }
        }

        this.renderQueue = [];
        this.p5.pop();
    }

    addRenderTask(renderable){
        this.renderQueue.push(renderable);
    }

    setCamera(cameraInstance){
        this.camera = cameraInstance;
        this.enableCameraRendering = true;
    }

    static RendererLoaders = RendererLoaders;
}


export class RendererAPI{
    static AnimationRenderTask = AnimationRenderTask;
}




