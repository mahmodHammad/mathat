import * as THREE from "./modules/three.module.js";
import { OrbitControls } from "./modules/OrbitControls.js";
import { displayCoards } from "./helper.js";
import settings from "./variables/settings.js";
import {saveDataURI , defaultFileName}from "./screenshot.js"
// import Stats from "stats-js";
import { addToScene } from "./sceneItems.js";
import { BokehShader, BokehDepthShader } from "./modules/BokehShader2.js";
let materialDepth;
const postprocessing = { enabled: true };

      const shaderSettings = {
        rings: 3,
        samples: 4
      };
      const target = new THREE.Vector3( 0, 20, - 50 );

const effectController = {

  enabled: true,
  jsDepthCalculation: true,
  shaderFocus: false,

  fstop: 2.2,
  maxblur: 1.0,

  showFocus: false,
  focalDepth: 2.8,
  manualdof: false,
  vignetting: false,
  depthblur: false,

  threshold: 0.5,
  gain: 2.0,
  bias: 0.5,
  fringe: 0.7,

  focalLength: 35,
  noise: true,
  pentagon: false,

  dithering: 0.0001

};

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
renderer.autoClear = false;
// renderer.physicallyCorrectLights=true
document.body.appendChild(renderer.domElement);

function render() {
  const ldistance = 100;
  postprocessing.bokeh_uniforms[ 'focalDepth' ].value = ldistance;
  effectController[ 'focalDepth' ] = ldistance;


  // render scene into texture

  renderer.setRenderTarget( postprocessing.rtTextureColor );
  renderer.clear();
  renderer.render( scene, camera );

  // render depth into texture

  scene.overrideMaterial = materialDepth;
  renderer.setRenderTarget( postprocessing.rtTextureDepth );
  renderer.clear();
  renderer.render( scene, camera );
  scene.overrideMaterial = null;

  // render bokeh composite

  renderer.setRenderTarget( null );
  renderer.render( postprocessing.scene, postprocessing.camera );

  // renderer.render(scene, camera);
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
camera.position.set(120, 40, 60);

// ----------------------------------------------> controls
const controls = new OrbitControls(camera, renderer.domElement);
function setupControls() {
  controls.target = new THREE.Vector3(0, 32, 0);
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
  const depthShader = BokehDepthShader;
  materialDepth = new THREE.ShaderMaterial( {
    uniforms: depthShader.uniforms,
    vertexShader: depthShader.vertexShader,
    fragmentShader: depthShader.fragmentShader
  } );
  materialDepth.uniforms[ 'mNear' ].value = camera.near;
  materialDepth.uniforms[ 'mFar' ].value = camera.far;

  const matChanger = function () {
    initPostprocessing();

    for ( const e in effectController ) {

      if ( e in postprocessing.bokeh_uniforms ) {

        postprocessing.bokeh_uniforms[ e ].value = effectController[ e ];

      }

    }

    postprocessing.enabled = effectController.enabled;
    postprocessing.bokeh_uniforms[ 'znear' ].value = camera.near;
    postprocessing.bokeh_uniforms[ 'zfar' ].value = camera.far;
    camera.setFocalLength( effectController.focalLength );

  };

  matChanger();
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

function initPostprocessing() {

  postprocessing.scene = new THREE.Scene();

  postprocessing.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 10000, 10000 );
  postprocessing.camera.position.z = 100;

  postprocessing.scene.add( postprocessing.camera );

  const pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
  postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
  postprocessing.rtTextureColor = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

  const bokeh_shader = BokehShader;

  postprocessing.bokeh_uniforms = THREE.UniformsUtils.clone( bokeh_shader.uniforms );

  postprocessing.bokeh_uniforms[ 'tColor' ].value = postprocessing.rtTextureColor.texture;
  postprocessing.bokeh_uniforms[ 'tDepth' ].value = postprocessing.rtTextureDepth.texture;
  postprocessing.bokeh_uniforms[ 'textureWidth' ].value = window.innerWidth;
  postprocessing.bokeh_uniforms[ 'textureHeight' ].value = window.innerHeight;

  postprocessing.materialBokeh = new THREE.ShaderMaterial( {

    uniforms: postprocessing.bokeh_uniforms,
    vertexShader: bokeh_shader.vertexShader,
    fragmentShader: bokeh_shader.fragmentShader,
    defines: {
      RINGS: shaderSettings.rings,
      SAMPLES: shaderSettings.samples
    }

  } );

  postprocessing.quad = new THREE.Mesh( new THREE.PlaneGeometry( window.innerWidth, window.innerHeight ), postprocessing.materialBokeh );
  postprocessing.quad.position.z = - 500;
  postprocessing.scene.add( postprocessing.quad );

}

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
