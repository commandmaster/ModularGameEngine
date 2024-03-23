import ModuleBase from './moduleBase.js';
import { RendererAPI } from './renderer.js';

const Engine = Matter.Engine,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Render = Matter.Render


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
            body.gameObject.components.Transform.localPosition.x = body.composite.position.x;
            body.gameObject.components.Transform.localPosition.y = body.composite.position.y;
            body.gameObject.components.Transform.localRotation = body.composite.angle * 180 / Math.PI;

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
            let i = 0;
            for (const collider of body.colliders){
                if (collider.type === "rectangle" || collider.type === "box"){
                    console.log(body.composite.parts[i].position);
                    this.engineAPI.gameEngine.renderer.addRenderTask(new RendererAPI.BoxColliderRenderTask(this.engineAPI, {x: body.composite.parts[i].position.x, y: body.composite.parts[i].position.y, width: collider.width, height: collider.height, rotation: body.composite.parts[i].angle * 180 / Math.PI}));
                }
                else if (collider.type === "circle"){
                    this.engineAPI.gameEngine.renderer.addRenderTask(new RendererAPI.CircleColliderRenderTask(this.engineAPI, {x: body.composite.parts[i].position.x, y: body.composite.parts[i].position.y, radius: collider.radius, rotation: body.composite.parts[i].angle * 180 / Math.PI}));
                }
                i++;
            }
        }
    }
}