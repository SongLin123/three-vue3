import '../node_modules/.pnpm/vue@3.3.4/node_modules/vue/dist/vue.runtime.esm-bundler.mjs';
import { Color, Box3, Vector3, SpotLight, SpotLightHelper } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/build/three.module.mjs';
import '../hooks/index.mjs';
import { GLTFLoader } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/examples/jsm/loaders/GLTFLoader.mjs';
import { GUI as GUI$1 } from '../node_modules/.pnpm/dat.gui@0.7.9/node_modules/dat.gui/build/dat.gui.module.mjs';
import { defineComponent, mergeDefaults, onMounted, getCurrentInstance, openBlock, createElementBlock } from '../node_modules/.pnpm/@vue_runtime-core@3.3.4/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.mjs';
import { createScene } from '../hooks/create-scene.mjs';
import { createFloor } from '../hooks/create-floor.mjs';
import { createGui } from '../hooks/create-gui.mjs';

const _hoisted_1 = { class: "render" };
var _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  props: mergeDefaults({
    gltfUrl: {
      type: String,
      default: ""
    }
  }, {}),
  setup(__props, { expose: __expose }) {
    const { scene, camera, renderer, controls, setAutoCameraLookAt } = createScene();
    createFloor(scene);
    scene.background = new Color("grey");
    let model;
    const setModel = (gltfUrl) => {
      if (gltfUrl) {
        if (model) {
          scene.remove(model);
        }
        const loader = new GLTFLoader();
        loader.load(gltfUrl, (gltf) => {
          model = gltf.scene;
          const box = new Box3().setFromObject(model);
          const boxSizeX = box.getSize(new Vector3()).x;
          if (boxSizeX > 100) {
            const scale = 1 / (boxSizeX / 100);
            model.scale.set(scale, scale, scale);
          }
          setAutoCameraLookAt(model);
          scene.add(model);
        });
      }
    };
    const light2 = new SpotLight(16777215);
    light2.position.set(0, 20, 10);
    const light2Helper = new SpotLightHelper(light2, "red");
    light2Helper.visible = false;
    scene.add(light2Helper);
    scene.add(light2);
    const light3 = new SpotLight(16777215, 1, 100);
    light3.position.set(0, 20, -10);
    const light3Helper = new SpotLightHelper(light3, "blue");
    light3Helper.visible = false;
    scene.add(light3Helper);
    scene.add(light3);
    const gui = new GUI$1({ width: 300 });
    onMounted(() => {
      var _a;
      const root = (_a = getCurrentInstance()) == null ? void 0 : _a.ctx.$el;
      const rect = root.getBoundingClientRect();
      gui.domElement.style.position = "absolute";
      gui.domElement.style.top = rect.top + "px";
      gui.domElement.style.left = rect.right - 300 + "px";
    });
    createGui(gui, {
      target: light2,
      name: "light2",
      field: {
        "intensity": [0, 2, 0.01],
        "position": {
          x: [-100, 100, 0.1],
          y: [-100, 100, 0.1],
          z: [-100, 100, 0.1]
        },
        "angle": [0, Math.PI / 2, 0.01],
        "penumbra": [0, 1, 0.01],
        "decay": [0, 2, 0.01],
        "distance": [0, 100, 0.01],
        "castShadow": [],
        "visible": []
      }
    });
    createGui(gui, {
      target: light3,
      name: "light3",
      field: {
        "intensity": [0, 2, 0.01],
        "position": {
          x: [-100, 100, 0.1],
          y: [-100, 100, 0.1],
          z: [-100, 100, 0.1]
        },
        "angle": [0, Math.PI / 2, 0.01],
        "penumbra": [0, 1, 0.01],
        "decay": [0, 2, 0.01],
        "distance": [0, 100, 0.01],
        "castShadow": [],
        "visible": []
      }
    });
    createGui(gui, {
      target: light2Helper,
      name: "light2Helper",
      field: {
        "visible": []
      }
    });
    createGui(gui, {
      target: light3Helper,
      name: "light3Helper",
      field: {
        "visible": []
      }
    });
    setModel(__props.gltfUrl);
    __expose({
      scene,
      camera,
      renderer,
      controls,
      setModel
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1);
    };
  }
});

export { _sfc_main as default };
//# sourceMappingURL=index.vue2.mjs.map
