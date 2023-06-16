<template>
    <div class="render">
    </div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { createScene, createFloor, createGui } from "../hooks";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { defineComponent, getCurrentInstance, h, onMounted, onUnmounted, ref } from "vue";
import { GUI } from "dat.gui";



// const renderDom = ref<HTMLElement | null>(null)
const { gltfUrl } = defineProps({
    gltfUrl: {
        type: String,
        default: ''
    }
})

const { scene, camera, renderer, controls, setAutoCameraLookAt } = createScene();

createFloor(scene)
// 加载背景
scene.background = new THREE.Color('grey')

let model: THREE.Group

const setModel = (gltfUrl?: string) => {
    // 加载模型
    if (gltfUrl) {

        if (model) {
            scene.remove(model)
        }
        const loader = new GLTFLoader();
        loader.load(gltfUrl, (gltf) => {
            model = gltf.scene

            const box = new THREE.Box3().setFromObject(model);
            const boxSizeX = box.getSize(new THREE.Vector3()).x
            if (boxSizeX > 100) {
                const scale = 1 / (boxSizeX / 100)
                model.scale.set(scale, scale, scale)
            }

            setAutoCameraLookAt(model)
            scene.add(model);
        })

    }
}



const light2 = new THREE.SpotLight(0xffffff);
light2.position.set(0, 20, 10);

const light2Helper = new THREE.SpotLightHelper(light2, 'red');
light2Helper.visible = false;
scene.add(light2Helper);
scene.add(light2);
const light3 = new THREE.SpotLight(0xffffff, 1, 100);
light3.position.set(0, 20, -10);

const light3Helper = new THREE.SpotLightHelper(light3, 'blue');
light3Helper.visible = false;
scene.add(light3Helper);
scene.add(light3);


// 调整gui位置
const gui = new GUI({ width: 300 });
onMounted(() => {

    const root = getCurrentInstance()?.ctx.$el! as HTMLElement
    const rect = root.getBoundingClientRect()
    gui.domElement.style.position = 'absolute';

    gui.domElement.style.top = rect.top + 'px';
    gui.domElement.style.left = rect.right - 300 + 'px';


})


createGui(gui, {
    target: light2,
    name: 'light2',
    field: {
        'intensity': [0, 2, 0.01],
        'position': {
            x: [-100, 100, 0.1],
            y: [-100, 100, 0.1],
            z: [-100, 100, 0.1],
        },
        'angle': [0, Math.PI / 2, 0.01],
        'penumbra': [0, 1, 0.01],
        'decay': [0, 2, 0.01],
        'distance': [0, 100, 0.01],
        'castShadow': [],
        'visible': [],
    }
})
createGui(gui, {
    target: light3,
    name: 'light3',
    field: {
        'intensity': [0, 2, 0.01],
        'position': {
            x: [-100, 100, 0.1],
            y: [-100, 100, 0.1],
            z: [-100, 100, 0.1],
        },
        'angle': [0, Math.PI / 2, 0.01],
        'penumbra': [0, 1, 0.01],
        'decay': [0, 2, 0.01],
        'distance': [0, 100, 0.01],
        'castShadow': [],
        'visible': [],
    }
})
createGui(gui, {
    target: light2Helper,
    name: 'light2Helper',
    field: {
        'visible': [],
    }
})
createGui(gui, {
    target: light3Helper,
    name: 'light3Helper',
    field: {
        'visible': [],
    }
})




setModel(gltfUrl)
defineExpose({
    scene,
    camera,
    renderer,
    controls,
    setModel
})



</script>
<style>
.render {
    width: 100%;
    height: 100%;
    flex: 1;
}
</style>