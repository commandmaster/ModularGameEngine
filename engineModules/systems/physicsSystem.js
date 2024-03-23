import ModuleBase from './moduleBase.js';
import { RendererAPI } from './renderer.js';

const Engine = Matter.Engine,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Composite = Matter.Composite


export default class PhysicsSystem extends ModuleBase{
    constructor(engineAPI, gameConfig) {
        super(engineAPI, gameConfig);
    }

    Start() {
        this.matterEngine = Engine.create({gravity: {x: 0, y: 1}});
        this.matterWorld = this.matterEngine.world;
        this.debugMode = true;

        this.rigidBodies = [];
    }

    Update(dt) {
        Engine.update(this.matterEngine, dt);

        for (const body of this.rigidBodies){
            body.gameObject.components.Transform.localPosition.x = body.composite.bodies[0].position.x;
            body.gameObject.components.Transform.localPosition.y = body.composite.bodies[0].position.y;
            body.gameObject.components.Transform.rotation = body.composite.bodies[0].angle;

            console.log(body.gameObject.components.Transform.localPosition);
        }

        if (this.debugMode){
            this.debugRender();
        }
    }



    // called from within the rigidbody component
    addRigidBody(rigidBodyComponent){
        this.rigidBodies.push(rigidBodyComponent);
        Matter.World.add(this.matterWorld, rigidBodyComponent.composite);
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
        for (const body of this.rigidBodies){
            for (const collider of body.colliders){
                if (collider.type === "rectangle" || collider.type === "box"){
                    this.engineAPI.gameEngine.renderer.addRenderTask(new RendererAPI.BoxColliderRenderTask(this.engineAPI, {x: body.composite.bodies[0].position.x + collider.offsetX, y: body.composite.bodies[0].position.y + collider.offsetY, width: collider.width, height: collider.height, rotation: body.composite.bodies[0].angle}));
                }
                // else if (collider.type === "circle"){
                //     this.engineAPI.gameEngine.renderer.drawCircle(collider.offsetX, collider.offsetY, collider.radius);
                // }
            }
        }
    }
}