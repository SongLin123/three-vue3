<template>
  <div class="flex min-h-full flex-row bg-gray-100 text-gray-800">
    <aside
      class="sidebar w-48 -translate-x-full transform bg-white p-4 transition-transform duration-150 ease-in md:translate-x-0 md:shadow-md">
      <div class="my-4 w-full border-b-4 border-indigo-100 text-center">
        <span class="font-mono text-xl font-bold tracking-widest">
          <span class="text-indigo-600">HELLO</span> DEV
        </span>
      </div>
      <div class="my-4"></div>
      <el-tree :data="data" :default-expand-all="true" :props="defaultProps" @node-click="handleNodeClick" />
    </aside>
    <main class="main -ml-48 flex flex-grow flex-col p-4 transition-all duration-150 ease-in md:ml-0">
      <div class="flex h-full items-center justify-center bg-white text-center text-5xl font-bold shadow-md">
        <modelViewer ref="vi"></modelViewer>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
// model-viewer
import { modelViewer } from "@my/components";
import { onUnmounted, ref } from "vue";

const vi = ref<modelViewer>()
interface Tree {
  label: string
  model?: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {

  if (!data.model) return
  vi.value?.setModel(data.model)
  console.log(data.model)
}

const data: Tree[] = [
  {
    label: '场景',
    children: [
      {
        label: 'island',
        model: 'models/island/scene.gltf',
      },
      {
        label: 'little-city',
        model: 'models/little-city/scene.gltf',
      },
    ],
  },
  {
    label: '物体',
    children: [
      {
        label: 'bear',
        model: 'models/bear/scene.glb',
      },
    ],
  },
]

const defaultProps = {
  children: 'children',
  label: 'label',
}

onUnmounted(() => {
  vi.value?.renderer.dispose()
})
</script>
<style lang=""></style>
