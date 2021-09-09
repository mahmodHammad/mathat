import * as THREE from "./modules/three.module.js";
import { scene,takeScreenshot,render } from "./setup.js";
import { loadModel } from "./ModelLoader.js";
import {setHDRLighting} from "./panorama.js"

const  wheel = "three/scene_11.glb"
const txturl = "three/texture.png"
const equi = "three/equi.jpeg"
let model= undefined

const textures=[
  ,["img1",txturl]
  ,["Flower1","https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg"]
   ,["Flower2","https://threejsfundamentals.org/threejs/resources/images/flower-2.jpg"]
   ,["Flower3","https://threejsfundamentals.org/threejs/resources/images/flower-3.jpg"]
   ,["Flower4","https://threejsfundamentals.org/threejs/resources/images/flower-4.jpg"]
   ,["Flower5","https://threejsfundamentals.org/threejs/resources/images/flower-5.jpg"]
   ,["Flower6","https://threejsfundamentals.org/threejs/resources/images/flower-6.jpg"]
 ]
 let textureIndex = 0

const prev = document.getElementById("prev")
const next = document.getElementById("next")
const sh = document.getElementById("sh")
const auto = document.getElementById("auto")
const stop = document.getElementById("stop")
const imageName = document.getElementById("imageName")

let autoSH =false
let intervalID;
const start =()=>{
  intervalID = setInterval(()=>replaceTexture(1) , 1000)
  stop.style.display = "block"
  auto.style.display= "none"
}

const stopAuto = ()=>{
  clearInterval(intervalID)
  stop.style.display = "none"
  auto.style.display= "block"
}

next.addEventListener('click',()=>replaceTexture(1))
prev.addEventListener('click',()=>replaceTexture(-1))
sh.addEventListener('click',()=>takeScreenshot(1920*0.8,1080*0.8))
auto.addEventListener('click',start)
stop.addEventListener('click',stopAuto)


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
  let lightFront = new THREE.SpotLight(0xffffff, 0.6,90000,Math.PI/4,1,2);
  let PointLight = new THREE.PointLight(0xffffff, 0.4);
  lightBack.position.set(10, 80, 70);
  const lightPos = new THREE.Vector3(90, 80, -70).multiplyScalar(15)
  lightFront.position.set(lightPos.x , lightPos.y ,lightPos.z);
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
  imageName.innerHTML= textures[textureIndex][0]
  targetTexture = textures[textureIndex][1]
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
     const g = new THREE.SphereGeometry(10000,1000,1000)
      // const g = new THREE.BoxBufferGeometry(10000,1000,10000)
      const env = new THREE.SphereBufferGeometry(1000,60,60)
      const envmesh = new THREE.Mesh(env,m)
      const mm = new THREE.MeshStandardMaterial()
      const mesh = new THREE.Mesh(g,mm)
      textureLoader.load("three/land.jpeg",t=>{
        t.repeat = new THREE.Vector2(150,150)
        t.wrapS = 10
        t.wrapT = 100
        console.log("HEYY:LOL",t)
        mm.map=t

      } )
      mesh.receiveShadow=true
      mesh.position.y=-10000
      mesh.rotation.x=1
      // glb.position.y=-5
      // glb.position.y=-500

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

  }
  )
 
};

export { addToScene ,model};