// import { scene } from "./setup.js";
import { GLTFLoader } from "./modules/GLTFLoader.js";
import { DRACOLoader } from "./modules/DRACOLoader.js";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
dracoLoader.setDecoderConfig({ type: "js" });

const modelLoader = new GLTFLoader();
modelLoader.setDRACOLoader(dracoLoader);

function loadModel(filepath) {

  return new Promise((resolve, reject) => {
    modelLoader.load(
      filepath,
      function (gltf) {
        resolve(gltf.scene);
      },
      function (xhr) {
        console.log("loading", xhr);
      },
      function (error) {
        console.log("ERROR on loading model", error);
        reject(error);
      }
    );
  });
}

export { loadModel };