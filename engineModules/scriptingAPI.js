class MonoBehaviour {
    constructor(engineAPI, gameObject) {
        this.engineAPI = engineAPI;
        this.gameObject = gameObject;
    }

    Start(){

    }

    Update(){

    }

    getObjectByName(name){
        return this.engineAPI.gameEngine.instantiatedObjects[name];
    }

    getComponentByName(objectName, componentName){
        return this.engineAPI.gameEngine.instantiatedObjects[objectName].components[componentName];
    }

    getComponentFromGameObject(gameObject, componentName){
        return gameObject.components[componentName];
    }
}

function getObjectByName(engineAPI, name){
    return engineAPI.gameEngine.instantiatedObjects[name];
}

function getComponentByName(engineAPI, objectName, componentName){
    return engineAPI.gameEngine.instantiatedObjects[objectName].components[componentName];
}

function getComponentFromGameObject(gameObject, componentName){
    return gameObject.components[componentName];
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
    static getObjectByName = getObjectByName;
    static getComponentByName = getComponentByName;
    static getComponentFromGameObject = getComponentFromGameObject;
}
