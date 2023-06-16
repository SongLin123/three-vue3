import { Ref, ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { eventInObject } from "../utils";
import { throttle } from "lodash-es";
import { useParentElement } from "@vueuse/core";
// 导入动画库
import gsap from "gsap";
import { useEdge } from "./use-edge";
import { useSharder } from "./use-sharder";

export function createScene(
  handleModelClick?: (obj: THREE.Object3D | false, e: MouseEvent) => void
) {
  const width = 300;
  const height = 300;

  // 初始化场景
  const scene = new THREE.Scene();
  // 坐标轴
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
  // 初始化相机
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000000);
  camera.position.set(0, 0, 0);
  // 初始化渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  // 初始化控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 背景
  var planeSize = 144500;
  var totalObjects = 50000;
  var geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(totalObjects * 3), 3)
  );
  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(new Float32Array(totalObjects * 3), 3)
  );
  var posArr = geometry.attributes.position.array;
  var colorArr = geometry.attributes.color.array;

  for (let i = 0; i < totalObjects; i++) {
    posArr[i * 3] = Math.random() * planeSize - planeSize * 0.5;
    posArr[i * 3 + 1] = Math.random() * planeSize + 100;
    posArr[i * 3 + 2] = Math.random() * planeSize - planeSize * 0.5;

    let cl1 = new THREE.Color(Math.random() * 0xffffff);

    colorArr[i * 3] = cl1.r;
    colorArr[i * 3 + 1] = cl1.g;
    colorArr[i * 3 + 2] = cl1.b;
  }

  var geometry2 = geometry.clone();

  var material = new THREE.PointsMaterial({
    size: 50,
    vertexColors: true,
  });
  var particles = new THREE.Points(geometry, material);

  var material2 = new THREE.PointsMaterial({
    size: 50,
    vertexColors: true,
  });
  var particles2 = new THREE.Points(geometry2, material2);
  // particles2.layers.enable(1)
  particles2.rotation.z = -Math.PI;
  scene.add(particles);
  scene.add(particles2);
  // 添加环境光
  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  // scene.add(ambientLight);

  // 对焦相机
  function setAutoCameraLookAt(
    model: THREE.Object3D,
    controls?: OrbitControls
  ) {
    const box = new THREE.Box3().setFromObject(model);
    const boxShap = box.getSize(new THREE.Vector3());
    const boxSize = box.getSize(new THREE.Vector3()).length();
    const boxCenter = box.getCenter(new THREE.Vector3());

    // const pointlight = new THREE.PointLight('red', 1, 100);
    // pointlight.position.set(boxCenter.x, boxCenter.y, boxCenter.z);
    // const pointlightHelper = new THREE.PointLightHelper(pointlight, 5);
    // scene.add(pointlightHelper);
    // scene.add(pointlight);

    const halfSizeToFitOnScreen = boxSize * 1.7 * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

    // 修改代码使摄像头不管在哪个方向，都能对准盒子侧面中心。
    // 从象限正中心到盒子中心的向量
    const direction = new THREE.Vector3()
      .subVectors(new THREE.Vector3(100, 100, 100), boxCenter)
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    const v3 = direction.multiplyScalar(distance).add(boxCenter);
    gsap.to(camera.position, {
      duration: 1,
      x: v3.x,
      y: v3.y,
      z: v3.z,
      onUpdate: () => {
        // pick some near and far values for the frustum that
        // will contain the box.

        // point the camera to look at the center of the box
        camera.near = boxSize / 100;
        camera.far = boxSize * 100;
        camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
        controls && (controls.target = boxCenter);
        camera.updateProjectionMatrix();
      },
    });
  }

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
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

  // 模型被点击
  const handleClick = (root) => {
    return (e: MouseEvent) => {
      eventInObject(
        e,
        (obj) => {
          if (scene.userData.removeEdge) {
            scene.userData.removeEdge();
            scene.userData.removeEdge = null;
          }
          if (typeof obj !== "boolean") {
            scene.userData.removeEdge = useEdge(
              obj.object as THREE.Mesh,
              scene
            );
          }
          handleModelClick &&
            handleModelClick(typeof obj !== "boolean" && obj.object, e);
        },
        { rootDom: root, scene, camera }
      );
    };
  };
  let removeClickFn: ((e: MouseEvent) => void) | null = null;
  // 模型被鼠标移入
  const handleHover = (root) => {
    let tempMesh: any = null;
    // let removeEdge;
    let removeSharder;

    return (e: MouseEvent) => {
      eventInObject(
        e,
        throttle(
          (obj: false | THREE.Intersection<THREE.Object3D<THREE.Event>>) => {
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

            // removeEdge = useEdge(tempMesh, scene);
            removeSharder = useSharder(tempMesh, scene);
          },
          500
        ),
        { rootDom: root, scene, camera }
      );
    };
  };
  let removeHoverFn: ((e: MouseEvent) => void) | null = null;

  const setSize = (el) => {
    const width = el.clientWidth;
    const height = el.clientHeight;
    renderer.setSize(width, height);
  };
  const e = useParentElement();
  onMounted(() => {
    let el = e.value?.querySelector(".render")!;
    el.appendChild(renderer.domElement);
    setSize(el);

    // 长按
    el.addEventListener("mousedown", (e) => {
      console.log("mousedown", e.button);
      if (e.button === 0) {
        setTimeout(() => {
          inHoldon = true;
        }, 500);
      }
    });
    el.addEventListener("mouseup", (e) => {
      console.log("mousedown", e.button);
      if (e.button === 0 && inHoldon) {
        // 此时为长按,阻止点击触发
        inHoldon = false;
        e.stopPropagation();
        return;
      }
      // 右键点击
      if (e.button === 2) {
        if (scene.userData.removeEdge) {
          scene.userData.removeEdge();
          scene.userData.removeEdge = null;
        }
        handleModelClick && handleModelClick(false, e);
      }
    });

    removeClickFn = handleClick(el);
    el.addEventListener("click", removeClickFn);

    // 鼠标移入
    removeHoverFn = handleHover(el);
    el.addEventListener("mousemove", removeHoverFn);

    requestAnimationFrame(render);
  });
  onUnmounted(() => {
    // 点击
    el.removeEventListener("click", removeClickFn);
    removeClickFn = null;

    // 鼠标移入
    el.removeEventListener("click", removeHoverFn);
    removeHoverFn = null;
  });
  return {
    scene,
    camera,
    renderer,
    controls,
    setAutoCameraLookAt,
    setSize: () => setSize(el),
  };
}
