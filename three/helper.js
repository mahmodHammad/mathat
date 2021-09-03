import * as THREE from "./modules/three.module.js";
import { scene } from "./setup.js";
import settings from "./variables/settings.js";
console.log(settings ,settings.gridDivision)
function displayCoards(  gridSize =100,gridDivisions =100) {
  scene.add(new THREE.AxesHelper(20));
  scene.add(new THREE.GridHelper(gridSize, gridDivisions, "green", "green"));
  scene.add(
    new THREE.GridHelper(gridSize, gridDivisions, "blue", "blue").rotateX(
      Math.PI / 2
    )
  );
  scene.add(
    new THREE.GridHelper(gridSize, gridDivisions, "red", "red").rotateZ(
      Math.PI / 2
    )
  );
}

function getExactPosition(target) {
  const { shift, direction } = target;
  let exactPositions = shift.map((s) => {
    return new THREE.Vector3(s.x, s.y, s.z);
  });

  let helperPosition = new THREE.Vector3(direction.x, direction.y, direction.z);

  return { exactPositions, helperPosition, direction };
}

export { displayCoards, getExactPosition };
