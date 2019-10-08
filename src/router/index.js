import Vue from 'vue'
import VueRouter from 'vue-router'
import { LoadingBar } from 'iview';

Vue.use(VueRouter);
let routes = [];
const routerContext = require.context('./', true, /index\.js$/);
routerContext.keys().forEach(route => {
    // 如果是根目录的 index.js、 不做任何处理
    if (route.startsWith('./index')) {
        return
    }
    const routerModule = routerContext(route);
    // 兼容 import export 和 require module.export 两种规范  Es modules  commonjs
    routes = [...routes, ...(routerModule.default || routerModule)];
});
function getAbsolutePath () {
    let path = location.pathname;
    console.log("项目名："+path);
    return path.substring(0, path.lastIndexOf('/') + 1);
}
export function createRouter(){
    let router = new VueRouter({mode: 'history',routes,base:getAbsolutePath()});
        router.beforeEach((to, from, next) => {
            LoadingBar.start();
            next();
        });
        router.afterEach(() => {
            LoadingBar.finish();
        });
    return router;
};
