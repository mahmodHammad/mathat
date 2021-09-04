import * as THREE from "./modules/three.module.js";
import { OrbitControls } from "./modules/OrbitControls.js";
import { displayCoards } from "./helper.js";
import settings from "./variables/settings.js";
import {saveDataURI , defaultFileName}from "./screenshot.js"
// import Stats from "stats-js";
import { addToScene } from "./sceneItems.js";

THREE.Cache.enabled = true;
// const stats = new Stats();
// For 100% width&Height
let width = window.innerWidth;
let height = window.innerHeight;
// ----------------------------------------------> render
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  powerPreference: "high-performance",
  antialias: settings.enableAntialias,
  logarithmicDepthBuffer: true,
});
renderer.setPixelRatio(settings.quality);
renderer.outputEncoding=  THREE.sRGBEncoding
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.physicallyCorrectLights=true
document.body.appendChild(renderer.domElement);

function render() {
  renderer.render(scene, camera);
}

// ----------------------------------------------> scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x333333);

// ----------------------------------------------> camera
const camera = new THREE.PerspectiveCamera(
  45, // fov = field of view
  width / height, // aspect ratio
  0.001, // near plane
  80000 // far plane
);
camera.position.set(130, -450, 50);

// ----------------------------------------------> controls
const controls = new OrbitControls(camera, renderer.domElement);
function setupControls() {
  controls.target = new THREE.Vector3(0, -470, 0);
  const {
    ctrlSpeed,
    maxZoom,
    minZoom,
    maxPolarAngle,
    minPolarAngle,
    autoRotate,
    autoRotateSpeed,
    enableDamping,
    dampingFactor,
  } = settings;

  controls.zoomSpeed = ctrlSpeed;
  controls.panSpeed = ctrlSpeed;
  controls.rotateSpeed = ctrlSpeed;

  controls.maxDistance = maxZoom;
  controls.minDistance = minZoom;

  controls.maxPolarAngle = maxPolarAngle;
  controls.minPolarAngle = minPolarAngle;

  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = autoRotateSpeed;

  controls.enableDamping = enableDamping;
  controls.dampingFactor = dampingFactor;
}

// ----------------------------------------------> resize
const handleWindowResize = () => {
  width = window.innerWidth;
  height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

// ----------------------------------------------> setup
const sceneSetup = (root) => {
  renderer.setSize(width, height);
  // root.appendChild(renderer.domElement);
  window.addEventListener("resize", handleWindowResize);

  if (settings.developmentModel) {
    displayCoards(100, 10);
    // stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild(stats.dom);
  }
  setupControls();
  addToScene();
};


function takeScreenshot(width, height) {
  // set camera and renderer to desired screenshot dimension
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  renderer.render(scene, camera, null, false);

  const DataURI = renderer.domElement.toDataURL("image/png");

  // save
  saveDataURI(defaultFileName(".png"), DataURI);

  // reset to old dimensions by invoking the on window resize function
   handleWindowResize();
}

export { takeScreenshot,sceneSetup, scene, controls, render, renderer, camera };
