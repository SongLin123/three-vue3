<template>
  <Suspense>
    <sceneViewer scenejson='scene/elements.json' mtlUrl='scene/bridge1.mtl'></sceneViewer>

    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>
<script setup lang="ts">

import { sceneViewer } from "../src";

</script>
<style ></style>