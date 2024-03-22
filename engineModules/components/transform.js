import ComponentBase from "./componentBase.js";

export default class Transform extends ComponentBase {
    constructor(engineAPI, componentConfig, gameObject) {
        super(engineAPI, componentConfig, gameObject);

        this.localPosition = this.componentConfig.position;
        this.localRotation = this.componentConfig.rotation;
        this.localScale = this.componentConfig.scale;


        this.worldPosition = this.localPosition;
        this.worldRotation = this.localRotation;
        this.worldScale = this.localScale;
    }

    Start() {
        if (this.gameObject.parent !== "world" && this.gameObject.parent !== undefined && this.gameObject.parent !== null) this.parentTransform = ScriptingAPI.getComponentByName(this.engineAPI, this.gameObject.parent, "Transform");
        this.setWorldTransform();
    }

    Update() {
        this.setWorldTransform();
    }

    setWorldTransform(){
        if (this.gameObject.parent === "world") {
            this.worldPosition = this.localPosition;
            this.worldRotation = this.localRotation;
            this.worldScale = this.localScale;
        }

        else if (this.gameObject.parent !== undefined && this.gameObject.parent !== null) {
            const parentPosition = this.parentTransform.worldPosition;
            const parentRotation = this.parentTransform.worldRotation;
            const degToRad = Math.PI / 180;

            const x1 = parentPosition.x + this.localPosition.x;
            const y1 = parentPosition.y + this.localPosition.y;

            const rotatedX = (x1 - parentPosition.x) * Math.cos(parentRotation * degToRad) - (y1 - parentPosition.y) * Math.sin(parentRotation * degToRad) + parentPosition.x;
            const rotatedY = (x1 - parentPosition.x) * Math.sin(parentRotation * degToRad) + (y1 - parentPosition.y) * Math.cos(parentRotation * degToRad) + parentPosition.y;

            this.worldPosition = {x: rotatedX, y: rotatedY}

            this.worldRotation =  this.parentTransform.worldRotation + this.localRotation;
            this.worldScale = this.localScale;
        }

        else{
            console.error("Parent transform not found for game object: " + this.gameObject.name + ". Defaulting to world as the parent.");
            this.worldPosition = this.localPosition;
            this.worldRotation = this.localRotation;
            this.worldScale = this.localScale;
        }
    }
}