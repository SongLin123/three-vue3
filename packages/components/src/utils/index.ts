import * as THREE from "three";

function eventInObject(
  event: MouseEvent | TouchEvent,
  callback: (selected: THREE.Intersection | boolean) => void,
  {
    rootDom,
    scene,
    camera,
  }: { rootDom: HTMLElement; scene: THREE.Object3D; camera: THREE.Camera }
) {
  let evtx = event.offsetX
    ? event.offsetX
    : event.touches
    ? event.touches[0].clientX
    : null;
  let evty = event.offsetY
    ? event.offsetY
    : event.touches
    ? event.touches[0].clientY
    : null;

  if (evtx === null) {
    return;
  }

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  let width1 = rootDom.clientWidth;
  let height1 = rootDom.clientHeight;

  mouse.x = (evtx / width1) * 2 - 1;
  mouse.y = -((evty / height1) * 2 - 1);

  raycaster.setFromCamera(mouse, camera);

  const meshes: THREE.Mesh[] = [];
  scene.traverse((mesh: THREE.Object3D | THREE.Mesh) => {
    if (
      mesh instanceof THREE.Mesh &&
      mesh.material != null &&
      mesh.userData.type !== "floor"
    ) {
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
    // 没点到模型
    if (callback && typeof callback == "function") {
      callback(false);
    }
  }
}

function getObjFrame(obj) {
  let bbox2 = new THREE.Box3().setFromObject(obj);
  const center = bbox2.getCenter(new THREE.Vector3());
  const size = bbox2.getSize(new THREE.Vector3());

  return { center, size };
}

export { eventInObject, getObjFrame };
