import '../node_modules/.pnpm/vue@3.3.4/node_modules/vue/dist/vue.runtime.esm-bundler.mjs';
import { HemisphereLight, DirectionalLight, Group, Mesh } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/build/three.module.mjs';
import '../hooks/index.mjs';
import { MTLLoader } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/examples/jsm/loaders/MTLLoader.mjs';
import { OBJLoader } from '../node_modules/.pnpm/three@0.152.1/node_modules/three/examples/jsm/loaders/OBJLoader.mjs';
import { defineComponent, mergeDefaults, watch, openBlock, createElementBlock } from '../node_modules/.pnpm/@vue_runtime-core@3.3.4/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.mjs';
import { createScene } from '../hooks/create-scene.mjs';
import { createFloor } from '../hooks/create-floor.mjs';
import { ref } from '../node_modules/.pnpm/@vue_reactivity@3.3.4/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.mjs';

var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const _hoisted_1 = { class: "render" };
var _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  props: mergeDefaults({
    scenejson: {
      type: String,
      default: ""
    },
    mtlUrl: {
      type: String,
      default: ""
    }
  }, {}),
  emits: ["loadStatus"],
  setup(__props, { expose: __expose, emit }) {
    const { scene, camera, renderer, controls, setAutoCameraLookAt, setSize } = createScene(handleModelClick);
    const { grid } = createFloor(scene);
    function handleModelClick(select, e) {
      if (select) {
        setAutoCameraLookAt(select, controls);
      } else if (e.button === 2) {
        setAutoCameraLookAt(model, controls);
      }
    }
    const hemiLight = new HemisphereLight(16777215, 4473924, 1.5);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    const dirLight = new DirectionalLight(16777215, 1.5);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);
    let model;
    const isLoading = ref(false);
    watch(isLoading, (newVal) => {
      emit("loadStatus", isLoading.value);
    });
    function loadSceneFromJson(scenejson, mtlUrl) {
      if (model) {
        scene.remove(model);
      }
      if (!scenejson) {
        return;
      }
      isLoading.value = true;
      const urlRoot = "scene/";
      model = new Group();
      const loadObjItem = (revitElement, material) => __async(this, null, function* () {
        let objFileName = revitElement.elementId + ".obj";
        let objLoader = new OBJLoader();
        objLoader.path = urlRoot;
        material && objLoader.setMaterials(material);
        const obj = yield objLoader.loadAsync(objFileName);
        obj.traverse((mesh) => {
          if (mesh instanceof Mesh) {
            mesh.geometry.scale(0.01, 0.01, 0.01);
            mesh.geometry.rotateX(-Math.PI / 2);
          }
        });
        model.add(obj);
      });
      fetch(new Request(scenejson)).then(function(response) {
        return response.json();
      }).then((body) => __async(this, null, function* () {
        let mtl;
        if (mtlUrl) {
          const mtlLoader = new MTLLoader();
          mtl = yield mtlLoader.loadAsync(mtlUrl);
        }
        for (let i = 0; i < body.length; i++) {
          let objElem1 = body[i];
          yield loadObjItem(objElem1, mtl);
        }
        isLoading.value = false;
        scene.add(model);
        setAutoCameraLookAt(model);
      }));
    }
    loadSceneFromJson(__props.scenejson, __props.mtlUrl);
    __expose({
      scene,
      camera,
      renderer,
      controls,
      loadSceneFromJson,
      isLoading,
      setSize
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1);
    };
  }
});

export { _sfc_main as default };
//# sourceMappingURL=index.vue2.mjs.map
