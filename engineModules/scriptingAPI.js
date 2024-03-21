class MonoBehaviour {
    constructor(engineAPI) {
        this.engineAPI = engineAPI;
    }

    Start(){

    }

    Update(){

    }

    getObjectByName(name){
        return this.engineAPI.gameEngine.instantiatedObjects[name];
    }

    getComponentByName(name, componentName){
        return this.engineAPI.gameEngine.instantiatedObjects[name].components[componentName];
    }

    getComponentFromGameObject(gameObject, componentName){
        return gameObject.components[componentName];
    }

    getEditorReferenceByName(type = "gameObject", referenceName){
        if (type === "gameObject"){
            const objectName = this.engineAPI.gameConfig.editorRefernces[referenceName];
            return this.getObjectByName(objectName);
        }
    }
}



function waitForCondition(condition, timeBetweenChecks = 50){
    return new Promise((resolve, reject) => {
        let interval = setInterval(() => {
            if (typeof condition !== "function" && typeof condition !== "boolean"){
                console.error("Condition must be a function (function should also return a boolean) or a boolean value.");
                reject("Condition must be a function or a boolean value.");
            }

            else if (typeof condition === "boolean"){
                if (condition){
                    clearInterval(interval);
                    resolve();
                }
            }

            else if (typeof condition === "function"){
                if (condition()){
                    clearInterval(interval);
                    resolve();
                }
            }
            
        }, timeBetweenChecks);
    });
}



class ScriptingAPI{
    static MonoBehaviour = MonoBehaviour;
    static waitForCondition = waitForCondition;
}
