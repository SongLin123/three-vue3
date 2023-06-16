<script setup lang="ts">
// import { modelViewer } from "@my/components";
import mLayout from "./layout/content/index.vue";


const zIndex = 3000
const size = 'small'

</script>

<template>
  <!-- <modelViewer ref="vi" :gltf-url="'models/island/scene.gltf'"></modelViewer> -->

  <el-config-provider :size="size" :z-index="zIndex">
    <div class="h-full w-full">

      <mLayout>
        <router-view></router-view>
      </mLayout>
    </div>
  </el-config-provider>
</template>

<style scoped></style>
