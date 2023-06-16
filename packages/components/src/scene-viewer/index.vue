<template >
    <div class="render">


    </div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { createScene, createFloor, createGui } from "../hooks";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { defineComponent, getCurrentInstance, h, onMounted, onUnmounted, ref, watch, defineEmits } from "vue";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";


const { scenejson, mtlUrl } = defineProps({
    scenejson: {
        type: String,
        default: ''
    },
    mtlUrl: {
        type: String,
        default: ''
    }
})

const { scene, camera, renderer, controls, setAutoCameraLookAt, setSize } = createScene(handleModelClick);

const { grid } = createFloor(scene)


function handleModelClick(select: THREE.Object3D<THREE.Event> | false, e: MouseEvent) {
    if (select) {


        setAutoCameraLookAt(select, controls)

    }
    // 右键点击
    else if (e.button === 2) {
        setAutoCameraLookAt(model, controls)

    }
}
// 加载半球光
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(0, 200, 100);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 180;
dirLight.shadow.camera.bottom = - 100;
dirLight.shadow.camera.left = - 120;
dirLight.shadow.camera.right = 120;
scene.add(dirLight);



let model: THREE.Group
const isLoading = ref(false)
const emit = defineEmits(['loadStatus'])
watch(isLoading, (newVal) => {
    emit('loadStatus', isLoading.value)
})
function loadSceneFromJson(scenejson, mtlUrl) {

    if (model) {
        scene.remove(model)
    }
    if (!scenejson) {
        return
    }

    isLoading.value = true
    const urlRoot = 'scene/';
    model = new THREE.Group();

    const loadObjItem = async (revitElement, material?) => {



        let objFileName = revitElement.elementId + '.obj';

        let objLoader = new OBJLoader();
        objLoader.path = urlRoot;

        material && objLoader.setMaterials(material);

        const obj = await objLoader.loadAsync(objFileName)


        obj.traverse((mesh: THREE.Object3D | THREE.Mesh) => {

            if (mesh instanceof THREE.Mesh) {

                mesh.geometry.scale(0.01, 0.01, 0.01);
                mesh.geometry.rotateX(-Math.PI / 2);
                // mesh.material = shadermat3;

                // mesh.material = shadermat4
                // mesh.geometry.computeVertexNormals();

            }

        })

        model.add(obj);

    }

    fetch(new Request(scenejson)).then(function (response) {
        return response.json();
    }).then(async (body) => {
        let mtl
        if (mtlUrl) {
            const mtlLoader = new MTLLoader();
            mtl = await mtlLoader.loadAsync(mtlUrl);
        }

        for (let i = 0; i < body.length; i++) {
            let objElem1 = body[i];


            await loadObjItem(objElem1, mtl);

        }
        isLoading.value = false
        scene.add(model);
        setAutoCameraLookAt(model)
    })

}
loadSceneFromJson(scenejson, mtlUrl)

defineExpose({
    scene,
    camera,
    renderer,
    controls,
    loadSceneFromJson,
    isLoading,
    setSize
})


</script>
<style ></style>