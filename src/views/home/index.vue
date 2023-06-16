<template>
    <div class="h-full w-full relative" ref="container" @dblclick.capture="fullscreen">

        <div class="absolute right-0 top-0 text-white bg-slate-600 text-xs leading-loose pl-2">
            <div> 双击全屏</div>
            <div> 鼠标左键旋转视角</div>
            <div> 鼠标中键缩放视角</div>
            <div> 鼠标左键点击查看构件</div>
            <div> 鼠标右键键点击返回初始视角</div>
        </div>

        <Transition>
            <div v-if="isfull" class="absolute top-0 text-center pointer-events-none headimg">head</div>

        </Transition>
        <Transition>
            <div v-if="isfull" class="absolute left-0">left</div>

        </Transition>
        <Transition>
            <div v-if="isfull" class="absolute right-0">right</div>

        </Transition>

        <loading v-model:active="isLoading" :is-full-page="false" />
        <sceneViewer class="h-full w-full" ref="vi" scenejson='scene/elements.json' @loadStatus="isLoading = $event">
        </sceneViewer>
    </div>
</template>
<script setup lang="ts">
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { sceneViewer } from "@my/components";
import { onUnmounted, ref, onMounted, watch } from "vue";
const vi = ref<sceneViewer>()
const container = ref<Element>()


const isLoading = ref(false)

const isfull = ref(false)
const fullscreen = (e: MouseEvent) => {
    if (!isfull.value) {
        container.value!.style = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999"
    } else {
        container.value!.style = ''
    }
    isfull.value = !isfull.value;
    vi.value?.setSize()
}


onUnmounted(() => {
    vi.value?.renderer.dispose()
})
</script>
<style lang="less" scoped>
.render {
    width: 100%;
    height: 100%;
    flex: 1;
}

.headimg {
    background-image: url(~/assets/head.png);
}
</style>