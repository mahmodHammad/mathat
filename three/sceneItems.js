import * as THREE from "./modules/three.module.js";
import { scene } from "./setup.js";
import { loadModel } from "./ModelLoader.js";
import {setHDRLighting} from "./panorama.js"

const  wheel = "three/models/test.glb"
let model= undefined

function addLights() {
  const amplight = new THREE.AmbientLight("#ffffff", 0.1);
  let lightBack = new THREE.SpotLight(0xff9900, 0.2);
  let lightFront = new THREE.SpotLight(0x00ffff, 0.2);
  let PointLight = new THREE.PointLight(0xffffff, 0);
  lightBack.position.set(2, 50, -7);
  lightFront.position.set(-2, -30, 7);
  PointLight.position.set(10, 0, 20);

  scene.add(amplight);
  scene.add(lightBack);
  scene.add(lightFront);
  scene.add(PointLight)
}

// Any thing will be added to scene should be done here
const addToScene = () => {
  addLights();
  setHDRLighting()

  loadModel(wheel).then(glb=>{
    console.log(glb)
    // const l1 = glb.getObjectByName
    // glb.position.set(0, 0, -2)
    glb.scale.set(0.1,0.1,0.1)
    scene.add(glb)
  }
  )
 
};

export { addToScene,model };