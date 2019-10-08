import Vue from 'vue'
import App from './App.vue'
import store from './store'
import {createRouter} from './router'
import '@babel/polyfill'
import './plugins/iview.js';

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
    const router = createRouter();
    const app = new Vue({
        store,
        router,
        render: h => h(App)// 根实例简单的渲染应用程序组件。
    })
    return {app,router }
}
