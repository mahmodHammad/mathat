import * as THREE from "./modules/three.module.js";
import { scene } from "./setup.js";
import { loadModel } from "./ModelLoader.js";
import {setHDRLighting} from "./panorama.js"

const  wheel = "three/models/test.glb"
const txturl = "three/texture.png"
let model= undefined

var textureLoader = new THREE.TextureLoader();

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
    const l1 = glb.getObjectByName("Circle001_3")
    const l2 = glb.getObjectByName("Circle005_1")
    const l3 = glb.getObjectByName("Circle003_5")
    console.log("HEY l2",l2)
    console.log("HEY l2",l3)
  const target = l1.children[0].children[0]
  // target.visable= false
    setTimeout(() => {
      // target.material.color = new THREE.Color(0x00ff00)
      const boxTexture = textureLoader.load("https://threejsfundamentals.org/threejs/resources/images/wall.jpg",(t)=>{
        target.material.map = t
        console.log("TTT",t)
      }  )
      console.log("HEY LOL",target)
      
      console.log("LOADED",boxTexture)
    }, 100);

    // glb.position.set(0, 0, -2)
    glb.scale.set(0.1,0.1,0.1)
    scene.add(glb)
  }
  )
 
};

export { addToScene,model };