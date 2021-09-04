import * as THREE from "./modules/three.module.js";
import { scene,takeScreenshot,render } from "./setup.js";
import { loadModel } from "./ModelLoader.js";
import {setHDRLighting} from "./panorama.js"

const  wheel = "three/scene_11.glb"
const txturl = "three/texture.png"
const equi = "three/equi.jpeg"
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
const auto = document.getElementById("auto")
let autoSH =false

next.addEventListener('click',()=>replaceTexture(1))
prev.addEventListener('click',()=>replaceTexture(-1))
sh.addEventListener('click',()=>takeScreenshot(1920*0.8,1080*0.8))
auto.addEventListener('click',()=>autoSH = true)

// 
var textureLoader = new THREE.TextureLoader();
const m = new THREE.MeshStandardMaterial({
  // envMap:textureLoader.load(textures[1])
  side:THREE.BackSide
});
textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg",tt=>{
tt.mapping = THREE.EquirectangularReflectionMapping;

  m.map=tt 
})


const texture = new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg', t=>{
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.background = texture;

} );


let mat
function addLights() {
  const amplight = new THREE.AmbientLight(0xffffff, 0.3);
  let lightBack = new THREE.SpotLight(0xffffff, 0.1,undefined,Math.PI/4,1,2);
  let lightFront = new THREE.SpotLight(0xffffff, 0.6,undefined,Math.PI/4,1,2);
  let PointLight = new THREE.PointLight(0xffffff, 0.4);
  lightBack.position.set(10, 80, 70);
  lightFront.position.set(10, 80, -70);
  PointLight.position.set(10, 0, 20);

  lightFront.castShadow = true;
  // lightFront.shadowMapWidth = lightFront.shadowMapHeight = 1024 * 2;
//Set up shadow properties for the light
lightFront.shadow.mapSize.width = 512*4; // default
lightFront.shadow.mapSize.height = 512*4; // default
lightFront.shadow.camera.near = 0.5; // default
lightFront.shadow.camera.far = 500; // default

  scene.add(amplight);
  scene.add(lightBack);
  scene.add(lightFront);
  // scene.add(PointLight)
//Create a DirectionalLight and turn on shadows for the light
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
    // m.map =t
    mat.map = t
  })
  if(autoSH){
    takeScreenshot(1920,1080)
  }
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
     
      const g = new THREE.BoxBufferGeometry(10000,1000,10000)
      const env = new THREE.SphereBufferGeometry(1000,60,60)
      const envmesh = new THREE.Mesh(env,m)
      const mm = new THREE.MeshStandardMaterial()
      const mesh = new THREE.Mesh(g,mm)
      textureLoader.load("three/land.jpeg",t=>{
        t.repeat = new THREE.Vector2(50,50)
        t.wrapS = 10
        t.wrapT = 100
        console.log("HEYY:LOL",t)
        mm.map=t

      } )
      mesh.receiveShadow=true
      mesh.position.y=-1000
      glb.position.y=-500

      scene.add(mesh)
      // scene.add(envmesh)
  setHDRLighting(m)
       
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
    glb.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        // // console.log("HEY",node.material)
        // node.material.metalness = 0.7
        // node.material.roughness = 0.65
        // node.material.reflectivity = 0.5
        
        // node.material.color = new THREE.Color("#2c4391")
      }})
    scene.add(glb)
    setInterval(()=>replaceTexture(1) , 1000)

  }
  )
 
};

export { addToScene ,model};