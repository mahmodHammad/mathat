import * as THREE from "./modules/three.module.js";
import { scene,takeScreenshot } from "./setup.js";
import { loadModel } from "./ModelLoader.js";
import {setHDRLighting} from "./panorama.js"

const  wheel = "three/scene_11.glb"
const txturl = "three/texture.png"
let model= undefined

const textures=[
  "https://threejsfundamentals.org/threejs/resources/images/wall.jpg"
   ,"https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg"
   ,"https://threejsfundamentals.org/threejs/resources/images/flower-2.jpg"
   ,"https://threejsfundamentals.org/threejs/resources/images/flower-3.jpg"
   ,"https://threejsfundamentals.org/threejs/resources/images/flower-4.jpg"
   ,"https://threejsfundamentals.org/threejs/resources/images/flower-5.jpg"
   ,"https://threejsfundamentals.org/threejs/resources/images/flower-6.jpg"
 ]
 let textureIndex = 0

const prev = document.getElementById("prev")
const next = document.getElementById("next")
const sh = document.getElementById("sh")

next.addEventListener('click',()=>replaceTexture(1))
prev.addEventListener('click',()=>replaceTexture(-1))
sh.addEventListener('click',()=>takeScreenshot(3840,2160))
// setTimeout(()=>takeScreenshot(1920,1080) , 1000)
var textureLoader = new THREE.TextureLoader();
const m = new THREE.MeshBasicMaterial({
  map: textureLoader.load(textures[0]),
});
let mat
function addLights() {
  const amplight = new THREE.AmbientLight(0xffffff, 0.8);
  let lightBack = new THREE.SpotLight(0xffffff, 0.2);
  let lightFront = new THREE.SpotLight(0xffffff, 0.2);
  let PointLight = new THREE.PointLight(0xffffff, 0.4);
  lightBack.position.set(10, 80, -70);
  lightFront.position.set(10, 80, 70);
  PointLight.position.set(10, 0, 20);

  scene.add(amplight);
  scene.add(lightBack);
  scene.add(lightFront);
  // scene.add(PointLight)
  setHDRLighting()

}

let targetTexture = textures[textureIndex]

const replaceTexture =(direction)=>{
  if(direction===1){
    if(textureIndex===textures.length-1){
      textureIndex=0
    }
    textureIndex++
  }else{
    textureIndex--
  }
  targetTexture = textures[textureIndex]
  textureLoader.load(targetTexture,(t)=>{
    m.map =t
    mat.map = t
  })
// takeScreenshot(1920,1080)
  console.log("HEY",direction)
}

// Any thing will be added to scene should be done here
const addToScene = () => {
  addLights();

  loadModel(wheel).then(glb=>{
    console.log(glb)
    // const l1 = glb.getObjectByName("Circle001_3")
    // const l2 = glb.getObjectByName("Circle005_1")
    const l3 = glb.getObjectByName("il_cremonese_high_poly_1")
     mat = l3.material
    console.log("HEY,",l3)
    // "il_cremonese_high_poly_5"
    // "il_cremonese_high_poly"

    // console.log("HEY l2",l2)
    // console.log("HEY l2",l3)
  // const target = l2.children[0].children[0]
  // target.visable= false
      // target.material.color = new THREE.Color(0x00ff00)
      const g = new THREE.BoxBufferGeometry(10,10,10)
     
 
      const mesh = new THREE.Mesh(g,m)
      // scene.add(mesh)
      // const boxTexture = textureLoader.load(t0,(t)=>{
      //   target.material.map = t
      //   console.log("TTT",t)
      //   target.material.map.repeat = new THREE.Vector2(10, 10);
      //   console.log("MAPP",target.material.map)
      //   // target.material.map.scale = new THREE.Vector2(0.1, 0.1);
      // }  )
      
      // console.log("LOADED",boxTexture)
  

    // glb.position.set(0, 0, -2)
    glb.scale.set(10,10,10)
    glb.rotation.y = 1.2
    scene.add(glb)
    setInterval(()=>replaceTexture(1) , 1000)

  }
  )
 
};

export { addToScene,model };