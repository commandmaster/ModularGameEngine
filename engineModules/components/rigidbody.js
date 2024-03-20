import ComponentBase from "./componentBase";

export default class Rigidbody extends ComponentBase {
    constructor(engineAPI, componentConfig) {
        super(engineAPI, componentConfig);
    }

    Start(){
        // Set up Matter.js physics 'Composite' <- (collection of rigid bodies)
        this.colliders = this.componentConfig.colliders;
        this.composite = Matter.Composite.create();

        this.colliders.forEach(collider => {
            addColliderBodyToComposite(this.composite, collider);
        });

        function addColliderBodyToComposite(composite, collider){
            let body;
            if (collider.type === "rectangle"){
                body = Matter.Bodies.rectangle(collider.x, collider.y, collider.width, collider.height);
            }

            else if (collider.type === "circle"){
                body = Matter.Bodies.circle(collider.x, collider.y, collider.radius);
            }


            Matter.Composite.add(composite, body);
        }

        this.engineAPI.engine.physicsSystem.addRigidBody(this);
    }

}

