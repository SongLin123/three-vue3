<template lang="">
        <Suspense>
        <model-viewer :gltf-url="'models/bear/scene.glb'"></model-viewer>

      <template #fallback>
        Loading...
      </template>
    </Suspense>
</template>
<script setup lang="ts">
import { modelViewer } from "../src";

</script>
<style ></style>