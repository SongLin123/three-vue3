import type {
    RouteRecordRaw
} from 'vue-router';
import {
    createRouter,
    createWebHistory,
} from 'vue-router'

import modelViewer from '../views/model-viewer/index.vue'
import Home from '../views/home/index.vue'

export const routeForMenu: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Home,
        name: 'Home',
        meta: {
            title: 'Home',

        },
    },
    {
        path: '/model-viewer',
        component: modelViewer,
        name: 'modelViewer',
        meta: {
            title: '模型预览',

        },
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...routeForMenu,
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            meta: { isPublic: true },
            redirect: '/',
        },
    ],
})