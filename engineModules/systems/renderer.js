import ModuleBase from './moduleBase.js';

export default class Renderer extends ModuleBase{
    constructor(engineAPI, gameConfig) {
        super(engineAPI, gameConfig);
    }

    Start(){
        this.p5.createCanvas(this.gameConfig.renderSettings.canvasSizeX, this.gameConfig.renderSettings.canvasSizeY);
    }

    Update(){
        this.p5.background(this.gameConfig.renderSettings.backgroundColor);
    }
}