import * as THREE from "./modules/three.module.js";;
import { scene ,render,renderer} from "./setup.js";


import { RGBELoader } from './modules/RGBELoader.js';

const hdrbg = "./three/HDR/bush_restaurant_2k.hdr"


function setHDRLighting(){
    new RGBELoader()
    .setDataType( THREE.UnsignedByteType ) // alt: FloatType, HalfFloatType
    .load( hdrbg, function ( texture, textureData ) {
      var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
      // scene.background = envMap;
      scene.environment = envMap;
      texture.dispose();
      pmremGenerator.dispose();
      render();
    } );
    var pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();
  }

export {setHDRLighting}