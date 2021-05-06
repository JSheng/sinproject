import Vue from 'vue'
import {createStore} from '@/store'
import {createRouter} from '@/router'
import { sync } from 'vuex-router-sync'
import 'view-design/dist/styles/iview.css'
import '@/plugins/iview.ts'
import '@/assets/scss/base.scss'
import App from '@/App.vue'

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
    const store = createStore();
    const router = createRouter(store);
    // 同步路由状态(route state)到 store
    sync(store, router)
    // @ts-ignore
    const app = new Vue({
        store,
        router,
        render: h => h(App)// 根实例简单的渲染应用程序组件。
    });
    return {app,router,store}
}
