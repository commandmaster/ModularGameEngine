import ComponentBase from "./componentBase.js";

export default class Rigidbody extends ComponentBase {
    constructor(engineAPI, componentConfig, gameObject) {
        super(engineAPI, componentConfig, gameObject);
    }

    Start(){
        // Set up Matter.js physics 'Composite' <- (collection of rigid bodies)
        this.colliders = this.componentConfig.colliders;
        this.composite = Matter.Composite.create(this.componentConfig.matterBodyConfig);

        this.colliders.forEach(collider => {
            addColliderBodyToComposite(this.composite, collider);
        });

        function addColliderBodyToComposite(composite, collider){
            let body;
            if (collider.type === "rectangle" || collider.type === "box"){
                body = Matter.Bodies.rectangle(collider.offsetX, collider.offsetY, collider.width, collider.height);
            }

            else if (collider.type === "circle"){
                body = Matter.Bodies.circle(collider.offsetX, collider.offsetY, collider.radius);
            }


            Matter.Composite.add(composite, body);
        }

        this.engineAPI.engine.physicsSystem.addRigidBody(this);
    }


}

