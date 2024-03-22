import ModuleBase from './moduleBase.js';

const Engine = Matter.Engine,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Composite = Matter.Composite


export default class PhysicsSystem extends ModuleBase{
    constructor(engineAPI, gameConfig) {
        super(engineAPI, gameConfig);
    }

    Start() {
        this.matterEngine = Engine.create();
        this.matterWorld = this.matterEngine.world;
        this.debugMode = false;

        this.rigidBodies = [];
    }

    Update(dt) {
        Engine.update(this.matterEngine, dt);

        if (this.debugMode){
            this.debugRender();
        }
    }



    // called from within the rigidbody component
    addRigidBody(rigidBodyComponent){
        this.rigidBodies.push(rigidBodyComponent);
    }

    debug(enable=true){
        this.debugMode = enable;
    }

    enableDebug(){
        this.debug(true);
    }

    disableDebug(){
        this.debug(false);
    }

    debugRender(){
        this.p5.push();
        this.p5.stroke(255);
        this.p5.fill(0);
        this.p5.strokeWeight(1);

        for (let i = 0; i < this.rigidBodies.length; i++){
            let rigidBody = this.rigidBodies[i];
            let bodies = Composite.allBodies(rigidBody.composite);

            for (let j = 0; j < bodies.length; j++){
                let body = bodies[j];
                let vertices = body.vertices;

                this.p5.beginShape();
                for (let k = 0; k < vertices.length; k++){
                    this.p5.vertex(vertices[k].x, vertices[k].y);
                }
                this.p5.endShape(this.p5.CLOSE);
            }
        }
    }
}