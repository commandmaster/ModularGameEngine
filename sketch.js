// Mini Game - Interactive Scene
// Bennett Friesen
// 2/29/2024
//
// Extra for Experts:
// I built a game engine from scratch using p5.js. I also created documentation for the game engine located at https://commandmaster.github.io/EngineDocs/ (the engine is still in development).
// I also used p5js to add html document elements to the game.
// You can ignore the engine code if you would like and just look at the code located in the game state and other scripts. Here is where you will find the code I used to actually develop the games you can play.



// Imports
import ModuleBase from './engineModules/systems/moduleBase.js';

import Renderer from './engineModules/systems/renderer.js';
import InputSystem from './engineModules/systems/inputSystem.js';
import PhysicsSystem from './engineModules/systems/physicsSystem.js';
import ScriptingSystem from './engineModules/systems/scriptingSystem.js';
import AudioSystem from './engineModules/systems/audioSystem.js';
import ParticleSystem from './engineModules/systems/particleSystem.js';



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
    }, 100);
  });
}


let game = function(p5){
  let gameEngine = new Engine(p5);

  p5.preload = async function(){
    gameEngine.Preload();
  };

  p5.setup = function(){
    gameEngine.Start();
  }

  p5.draw = function(){
    gameEngine.Update();
  };
  
}

class EngineAPI {
  constructor(engine){
    this.engine = engine;
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
      this.renderer.Preload()
    ]);
  }

  Start(){
    this.inputSystem.Start();
    this.physicsSystem.Start();
    this.audioSystem.Start();
    this.particleSystem.Start();
    this.scriptingSystem.Start();
    this.renderer.Start();
  }

  Update(){
    this.inputSystem.Update();
    this.physicsSystem.Update();
    this.audioSystem.Update();
    this.particleSystem.Update();
    this.scriptingSystem.Update();
    this.renderer.Update();
  }
}

window.addEventListener("load", async () => {
  new p5(game);
});