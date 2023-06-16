import { Raycaster, Vector2, Mesh, Box3, Vector3 } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/build/three.module.mjs';

function eventInObject(event, callback, {
  rootDom,
  scene,
  camera
}) {
  let evtx = event.offsetX ? event.offsetX : event.touches ? event.touches[0].clientX : null;
  let evty = event.offsetY ? event.offsetY : event.touches ? event.touches[0].clientY : null;
  if (evtx === null) {
    return;
  }
  var raycaster = new Raycaster();
  var mouse = new Vector2();
  let width1 = rootDom.clientWidth;
  let height1 = rootDom.clientHeight;
  mouse.x = evtx / width1 * 2 - 1;
  mouse.y = -(evty / height1 * 2 - 1);
  raycaster.setFromCamera(mouse, camera);
  const meshes = [];
  scene.traverse((mesh) => {
    if (mesh instanceof Mesh && mesh.material != null && mesh.userData.type !== "floor") {
      meshes.push(mesh);
    }
  });
  var intersects = raycaster.intersectObjects(meshes);
  if (intersects && intersects.length > 0) {
    let selected = intersects[0];
    if (callback && typeof callback == "function") {
      callback(selected);
    }
  } else {
    if (callback && typeof callback == "function") {
      callback(false);
    }
  }
}
function getObjFrame(obj) {
  let bbox2 = new Box3().setFromObject(obj);
  const center = bbox2.getCenter(new Vector3());
  const size = bbox2.getSize(new Vector3());
  return { center, size };
}

export { eventInObject, getObjFrame };
//# sourceMappingURL=index.mjs.map
