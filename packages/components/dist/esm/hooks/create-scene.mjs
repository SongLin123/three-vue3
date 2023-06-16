import '../node_modules/.pnpm/vue@3.3.4/node_modules/vue/dist/vue.runtime.esm-bundler.mjs';
import { Scene, AxesHelper, PerspectiveCamera, WebGLRenderer, BufferGeometry, BufferAttribute, Float32BufferAttribute, Color, PointsMaterial, Points, Box3, Vector3, MathUtils } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/build/three.module.mjs';
import { OrbitControls } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/examples/jsm/controls/OrbitControls.mjs';
import { eventInObject } from '../utils/index.mjs';
import '../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/lodash.mjs';
import { useParentElement } from '../node_modules/.pnpm/@vueuse_core@10.1.2_vue@3.3.4/node_modules/@vueuse/core/index.mjs';
import { gsap as gsapWithCSS } from '../node_modules/.pnpm/gsap@3.11.5/node_modules/gsap/index.mjs';
import { useEdge } from './use-edge.mjs';
import { useSharder } from './use-sharder.mjs';
import throttle from '../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/throttle.mjs';
import { onMounted, onUnmounted } from '../node_modules/.pnpm/@vue_runtime-core@3.3.4/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.mjs';

function createScene(handleModelClick) {
  const width = 300;
  const height = 300;
  const scene = new Scene();
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1e6);
  camera.position.set(0, 0, 0);
  const renderer = new WebGLRenderer({
    antialias: true
  });
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  var planeSize = 144500;
  var totalObjects = 5e4;
  var geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(totalObjects * 3), 3)
  );
  geometry.setAttribute(
    "color",
    new Float32BufferAttribute(new Float32Array(totalObjects * 3), 3)
  );
  var posArr = geometry.attributes.position.array;
  var colorArr = geometry.attributes.color.array;
  for (let i = 0; i < totalObjects; i++) {
    posArr[i * 3] = Math.random() * planeSize - planeSize * 0.5;
    posArr[i * 3 + 1] = Math.random() * planeSize + 100;
    posArr[i * 3 + 2] = Math.random() * planeSize - planeSize * 0.5;
    let cl1 = new Color(Math.random() * 16777215);
    colorArr[i * 3] = cl1.r;
    colorArr[i * 3 + 1] = cl1.g;
    colorArr[i * 3 + 2] = cl1.b;
  }
  var geometry2 = geometry.clone();
  var material = new PointsMaterial({
    size: 50,
    vertexColors: true
  });
  var particles = new Points(geometry, material);
  var material2 = new PointsMaterial({
    size: 50,
    vertexColors: true
  });
  var particles2 = new Points(geometry2, material2);
  particles2.rotation.z = -Math.PI;
  scene.add(particles);
  scene.add(particles2);
  function setAutoCameraLookAt(model, controls2) {
    const box = new Box3().setFromObject(model);
    const boxShap = box.getSize(new Vector3());
    const boxSize = box.getSize(new Vector3()).length();
    const boxCenter = box.getCenter(new Vector3());
    const halfSizeToFitOnScreen = boxSize * 1.7 * 0.5;
    const halfFovY = MathUtils.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    const direction = new Vector3().subVectors(new Vector3(100, 100, 100), boxCenter).normalize();
    const v3 = direction.multiplyScalar(distance).add(boxCenter);
    gsapWithCSS.to(camera.position, {
      duration: 1,
      x: v3.x,
      y: v3.y,
      z: v3.z,
      onUpdate: () => {
        camera.near = boxSize / 100;
        camera.far = boxSize * 100;
        camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
        controls2 && (controls2.target = boxCenter);
        camera.updateProjectionMatrix();
      }
    });
  }
  function resizeRendererToDisplaySize(renderer2) {
    const canvas = renderer2.domElement;
    const width2 = canvas.clientWidth;
    const height2 = canvas.clientHeight;
    const needResize = canvas.width !== width2 || canvas.height !== height2;
    if (needResize) {
      renderer2.setSize(width2, height2, false);
    }
    return needResize;
  }
  let inHoldon = false;
  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  const handleClick = (root) => {
    return (e2) => {
      eventInObject(
        e2,
        (obj) => {
          if (scene.userData.removeEdge) {
            scene.userData.removeEdge();
            scene.userData.removeEdge = null;
          }
          if (typeof obj !== "boolean") {
            scene.userData.removeEdge = useEdge(
              obj.object,
              scene
            );
          }
          handleModelClick && handleModelClick(typeof obj !== "boolean" && obj.object, e2);
        },
        { rootDom: root, scene, camera }
      );
    };
  };
  let removeClickFn = null;
  const handleHover = (root) => {
    let tempMesh = null;
    let removeSharder;
    return (e2) => {
      eventInObject(
        e2,
        throttle(
          (obj) => {
            if (tempMesh) {
              if (tempMesh === (obj || {}).object) {
                return;
              } else {
                tempMesh = null;
                removeSharder();
              }
            }
            if (!obj) {
              return;
            }
            console.log("handleHover", obj);
            tempMesh = obj.object;
            removeSharder = useSharder(tempMesh, scene);
          },
          500
        ),
        { rootDom: root, scene, camera }
      );
    };
  };
  let removeHoverFn = null;
  const setSize = (el2) => {
    const width2 = el2.clientWidth;
    const height2 = el2.clientHeight;
    renderer.setSize(width2, height2);
  };
  const e = useParentElement();
  onMounted(() => {
    var _a;
    let el2 = (_a = e.value) == null ? void 0 : _a.querySelector(".render");
    console.log("el", el2);
    el2.appendChild(renderer.domElement);
    setSize(el2);
    el2.addEventListener("mousedown", (e2) => {
      console.log("mousedown", e2.button);
      if (e2.button === 0) {
        setTimeout(() => {
          inHoldon = true;
        }, 500);
      }
    });
    el2.addEventListener("mouseup", (e2) => {
      console.log("mousedown", e2.button);
      if (e2.button === 0 && inHoldon) {
        inHoldon = false;
        e2.stopPropagation();
        return;
      }
      if (e2.button === 2) {
        if (scene.userData.removeEdge) {
          scene.userData.removeEdge();
          scene.userData.removeEdge = null;
        }
        handleModelClick && handleModelClick(false, e2);
      }
    });
    removeClickFn = handleClick(el2);
    el2.addEventListener("click", removeClickFn);
    removeHoverFn = handleHover(el2);
    el2.addEventListener("mousemove", removeHoverFn);
    requestAnimationFrame(render);
  });
  onUnmounted(() => {
    el.removeEventListener("click", removeClickFn);
    removeClickFn = null;
    el.removeEventListener("click", removeHoverFn);
    removeHoverFn = null;
  });
  return {
    scene,
    camera,
    renderer,
    controls,
    setAutoCameraLookAt,
    setSize: () => setSize(el)
  };
}

export { createScene };
//# sourceMappingURL=create-scene.mjs.map
