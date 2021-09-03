import * as THREE from "./modules/three.module.js";
import {  render, controls } from "./setup.js";
import{model} from "./sceneItems.js"

var clock = new THREE.Clock();
let generalTime = 0;


let requestID;
const rotateWheel = ()=>{
  if(model!==undefined){
    model.rotation.z+=0.002
    model.rotation.z*=1.008
    // model.rotation.x+=Math.random()/100
    // model.rotation.y+=Math.random()/100
  }
}
// this function is heavy , OPTIMIZE it as could as possible
const startAnimationLoop = (e) => {
  //   console.log("EEEE:",e)
  //   material.uniforms.time.value = e/10000;
  // console.log(clock.elapsedTime)
  // stats.begin();
  generalTime = clock.elapsedTime;
  // rotateWheel()
  render();
  
  controls.update();
  // stats.end();
  requestID = window.requestAnimationFrame(startAnimationLoop);
};

export {
  startAnimationLoop,
  requestID,
  generalTime,
};