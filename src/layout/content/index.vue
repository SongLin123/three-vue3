<template >
    <div class="flex flex-col w-full h-full">

        <header class="">
            <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">


                    <a href="#" class="flex items-center">
                        <img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">lin</span>
                    </a>

                    <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
                        <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li v-for="item in routeForMenu">
                                <router-link :to="item.path"
                                    class="block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent
                                                                                                                                                                                 lg:p-0 dark:text-white"
                                    :class="item.path == $route.path ? 'lg:text-blue-600' : ''">{{ item.meta?.title }}
                                </router-link>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </header>

        <main class="flex-1  w-full h-[100px]">
            <slot />
        </main>

        <footer class=" p-4 bg-white  dark:bg-gray-800">

            <hr class="my-2 border-gray-200  dark:border-gray-700" />
            <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 <a href="" target="_blank"
                    class="hover:underline">lin</a>. All Rights Reserved.
            </span>
        </footer>
    </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { routeForMenu } from "../../route";

const $route = useRoute()
console.log($route.path, routeForMenu)

</script>
<style lang="less" scoped></style>