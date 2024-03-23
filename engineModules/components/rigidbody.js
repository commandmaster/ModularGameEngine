import ComponentBase from "./componentBase.js";

export default class Rigidbody extends ComponentBase {
    constructor(engineAPI, componentConfig, gameObject) {
        super(engineAPI, componentConfig, gameObject);
    }

    Start(){
        // Set up Matter.js physics 'Composite' <- (collection of rigid bodies)
        this.colliders = this.componentConfig.colliders;
        
        const compound = [];

        this.colliders.forEach(collider => {
            addColliderBodyToBody(collider, this.gameObject);
        });



        function addColliderBodyToBody(collider, gameObject){
            let body;
            
            const xPos = collider.offsetX;
            const yPos = collider.offsetY;
            if (collider.type === "rectangle" || collider.type === "box"){
                body = Matter.Bodies.rectangle(
                    xPos, 
                    yPos, 
                    collider.width, 
                    collider.height, 
                    {isStatic: false});
            }

            else if (collider.type === "circle"){
                body = Matter.Bodies.circle(
                    xPos, 
                    yPos, 
                    collider.radius, 
                    {isStatic: false});
            }


            compound.push(body);
        }

        this.bodies = compound;
        this.componentConfig.matterBodyConfig.parts = compound;
        this.composite = Matter.Body.create(this.componentConfig.matterBodyConfig);
        Matter.Body.setPosition(this.composite, {x:this.gameObject.components.Transform.localPosition.x, y:this.gameObject.components.Transform.localPosition.y});
        Matter.Body.setAngle(this.composite, this.gameObject.components.Transform.localRotation * Math.PI / 180);
        this.engineAPI.engine.physicsSystem.addRigidBody(this);
    }


}

