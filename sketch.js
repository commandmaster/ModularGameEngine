// 
// Bennett Friesen
// 
//
// Extra for Experts:

// Library Imports





// Engine Imports
import Renderer from './engineModules/systems/renderer.js';
import InputSystem from './engineModules/systems/inputSystem.js';
import PhysicsSystem from './engineModules/systems/physicsSystem.js';
import ScriptingSystem from './engineModules/systems/scriptingSystem.js';
import AudioSystem from './engineModules/systems/audioSystem.js';
import ParticleSystem from './engineModules/systems/particleSystem.js';

import GameObject, {Camera} from './engineModules/engineObjects.js';


/**
 * Waits for a condition to be met.
 * @param {Function} condition - The condition to wait for.
 * @returns {Promise} A promise that resolves when the condition is met.
 */
function waitForCondition(condition) {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      if (condition()) {
        clearInterval(intervalId);
        resolve();
      }
    }, 50);
  });
}


let preloadDone = false;
let firstUpdate = false
let game = function(p5){
  let gameEngine = new Engine(p5);

  p5.preload = async function(){
    await gameEngine.Preload();
    preloadDone = true;
  };

  p5.setup = function(){
    waitForCondition(() => {return preloadDone}).then(() => {
      gameEngine.Start();
    });
    
  }

  p5.draw = function(){
    // avoid issues where the draw loop will run before the preload is done and setup is called
    // it will run aproximately 50 ms after setup is called

    if (preloadDone) {
      if (!firstUpdate){
        setTimeout(() => {
          gameEngine.Update(p5.deltaTime);
          firstUpdate = true;
        }, 100);
        
      }

      else {
        gameEngine.Update(p5.deltaTime);
      }
    }
  };
  
}

class EngineAPI {
  constructor(engine){
    this.engine = engine;
    this.gameEngine = engine;
    this.p5 = engine.p5;
  }
}

class Engine {
  constructor(p5){
    this.p5 = p5;
    this.engineAPI = new EngineAPI(this);

    this.renderer = new Renderer(this.engineAPI);
    this.inputSystem = new InputSystem(this.engineAPI);
    this.physicsSystem = new PhysicsSystem(this.engineAPI);
    this.scriptingSystem = new ScriptingSystem(this.engineAPI);
    this.audioSystem = new AudioSystem(this.engineAPI);
    this.particleSystem = new ParticleSystem(this.engineAPI);
  }

  async Preload(){
    await Promise.all([
      this.inputSystem.Preload(),
      this.physicsSystem.Preload(),
      this.audioSystem.Preload(),
      this.particleSystem.Preload(),
      this.scriptingSystem.Preload(),
      this.renderer.Preload(),
      this.loadGameConfig()
    ]);
  }

  Start(){
    // Load Engine Modules
    this.inputSystem.Start();
    this.physicsSystem.Start();
    this.audioSystem.Start();
    this.particleSystem.Start();
    this.scriptingSystem.Start();
    this.renderer.Start();

    // Load Current Level
    this.instantiatedObjects = {};

    this.loadLevel("level1");
  }

  Update(dt){
    this.inputSystem.Update(dt);
    this.physicsSystem.Update(dt);
    
    for (const objName in this.instantiatedObjects){
      this.instantiatedObjects[objName].Update(dt);
      console.log(objName)
    }

    this.scriptingSystem.Update(dt);
    this.audioSystem.Update(dt);
    this.particleSystem.Update(dt);
    this.renderer.Update(dt);
  }

  loadGameConfig(){
    return new Promise((resolve, reject) => {
      this.p5.loadJSON("./gameConfig.json", (data) => {
        this.gameConfig = data;
        resolve(data);
      });
    });
  }

  loadLevel(levelName){
    const level = this.gameConfig.levels[levelName];

    if (level === undefined){
      console.error(`Level ${levelName} not found in gameConfig`);
      return;
    }

    for (const objName in level.gameObjects){
      const obj = level.gameObjects[objName];
      this.instantiateGameObject(obj);
    }
  }

  instantiateGameObject(obj){
    const gameObjectInstance = new GameObject(this.engineAPI, obj);
    
    gameObject.Preload().then(() => {
      gameObject.Start();
      this.instantiatedObjects[obj.name + '_' + crypto.randomUUID()] = gameObjectInstance;
    });

  }


}


window.addEventListener("load", async () => {
  new p5(game);
});