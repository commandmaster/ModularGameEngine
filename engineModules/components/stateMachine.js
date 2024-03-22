import ComponentBase from './componentBase.js';
import { RendererAPI} from '../systems/renderer.js';

export default class StateMachine extends ComponentBase{
    constructor(engineAPI, componentConfig, gameObject) {
        super(engineAPI, componentConfig, gameObject);
    }

    Preload(){
        return new Promise((resolve, reject) => {
            this.animations = {};
            this.machineConfig = this.engineAPI.gameEngine.renderer.stateMachines[this.componentConfig.stateMachineName];
            for (const animationName in this.machineConfig.animations){
                const animation = this.machineConfig.animations[animationName];

                const sheet = this.engineAPI.gameEngine.renderer.animationsSheets[animation.name];
                const animConfig = this.engineAPI.gameEngine.renderer.animationConfigs[animation.name];

                this.animations[animation.name] = new Animation(this.engineAPI, {
                    name:animConfig.name, 
                    type: animConfig.type, 
                    frameStartIndex: animConfig.frameStartIndex, 
                    frameEndIndex: animConfig.frameEndIndex, 
                    framesAcross: animConfig.framesAcross, 
                    framesDown: animConfig.framesDown, 
                    speed: animConfig.speed, 
                    size: animConfig.size, 
                    sheet
                });
            }

            resolve();
        });
    }

    Start(){
        for (const animation in this.animations){
            this.animations[animation].Start();
        }
    }

    Update(){
        for (const animation in this.animations){
            this.animations[animation].Update();
        }
    }

}

class Animation{
    constructor(engineAPI, {name, type, frameStartIndex, frameEndIndex, framesAcross, framesDown, speed, size, sheet}){
        this.engineAPI = engineAPI;
        this.name = name;
        this.type = type;
        this.frameStartIndex = frameStartIndex;
        this.frameEndIndex = frameEndIndex;
        this.framesAcross = framesAcross;
        this.framesDown = framesDown;
        this.speed = speed;
        this.sheet = sheet;
        this.size = size;

        this.frames = [];
        this.cutSheet();
    }

    cutSheet(){
        this.frameWidth = this.sheet.width / this.framesAcross;
        this.frameHeight = this.sheet.height / this.framesDown;
        for (let i = this.frameStartIndex; i < this.frameEndIndex; i++){
            let j = Math.floor(i / this.framesAcross);
            this.frames.push({"img": this.sheet, "sWidth": this.frameWidth, "sHeight": this.frameHeight, "sx": ((i) * this.frameWidth) % this.framesAcross, "sy": j * this.frameHeight, "size": this.size})
        }
    }

    Start(){
        
    }

    Update(){
        
        this.engineAPI.p5.image(this.frames[0].img, 0, 0, this.frames[0].sWidth*this.frames[0].size, this.frames[0].img.height*this.frames[0].size, this.frames[0].sx, this.frames[0].sy, this.frames[0].sWidth, this.frames[0].img.height);

        const img = this.frames[0].img;
        const dx = 0;
        const dy = 0;
        const dWidth = this.frames[0].sWidth*this.frames[0].size;
        const dHeight = this.frames[0].img.height*this.frames[0].size;
        const sx = this.frames[0].sx;
        const sy = this.frames[0].sy;
        const sWidth = this.frames[0].sWidth;
        const sHeight = this.frames[0].sHeight;


        this.engineAPI.engine.renderer.addRenderTask(new RendererAPI.AnimationRenderTask(this.engineAPI, {img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight}));

        console.log("Animation Update");
    }
}
