import Vue from 'vue'
import { createApp } from '@/main';
import '@babel/polyfill';
import api from '@/api' // 导入api接口
import '../assets/scss/base.scss';
import '../plugins/iview.js';

Vue.config.productionTip = false;
Vue.prototype.$http = api; // 将api挂载到vue

function getServerConfig() {
    return new Promise((resolve, reject) => {
        api.config.then((result) => {
                Vue.prototype.$apiUrl = result.data["apiURL"];
                resolve();
            })
            .catch(error => {
                console.log(error);
                reject();
            });
    });
}
async function init() {
    if(process.env.NODE_ENV === "production"){
        await getServerConfig();
    }
    const { app,router } = createApp();
    router.onReady(() => {
        app.$mount('#app');
    });
}
init();