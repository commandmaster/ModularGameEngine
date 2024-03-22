import ComponentBase from './componentBase.js';

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

                this.animations[animation.name] = new Animation(animConfig.name, animConfig.type, animConfig.frameStartIndex, animConfig.frameEndIndex, animConfig.framesAcross, animConfig.framesDown, animConfig.speed, sheet);
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
    constructor(name, type, frameStartIndex, frameEndIndex, framesAcross, framesDown, speed, sheet){
        this.name = name;
        this.type = type;
        this.frameStartIndex = frameStartIndex;
        this.frameEndIndex = frameEndIndex;
        this.framesAcross = framesAcross;
        this.framesDown = framesDown;
        this.speed = speed;
        this.sheet = sheet;

        this.frames = [];
        this.cutSheet();
    }

    cutSheet(){

    }

    Start(){
        
    }

    Update(){
        
    }
}
