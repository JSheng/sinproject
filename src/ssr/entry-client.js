import Vue from 'vue'
import { createApp } from '@/main';
import HttpRequest from '@/utils/axios';
import IndexRequest from '@/api/index' // 导入api接口
import {LoadingBar} from 'view-design'
import {Constants} from '@/baseclass/constants'
const apiContext = require.context('../views', true, /\\*-api\.ts$/);


Vue.config.productionTip = false;
function getServerConfig() {
    // eslint-disable-next-line no-invalid-this
    const that = this;
    return new Promise((resolve, reject) => {
      that.$http.config().then((result) => {
          Constants.BASE_URL = result.data["baseUrl"];
          resolve();
        }).catch(error => {
            console.log(error);
            reject();
        });
    });
}
async function init() {
    if (process.env.NODE_ENV === "production"){
        await getServerConfig();
    }else{
      Constants.BASE_URL = process.env.VUE_APP_PROXY_URL
    }
    const { app,router,store } = createApp();
    if (window.__INITIAL_STATE__) {
      store.replaceState(window.__INITIAL_STATE__)
      // 创建axios请求实例
      let request = new HttpRequest();
      let indexRequest = new IndexRequest(apiContext);
      indexRequest.setRequest(request);
      store.$http = store.state.$http = indexRequest.toModules();
    }

    router.onReady(() => {
        // 添加路由钩子函数，用于处理 asyncData.
        // 在初始路由 resolve 后执行，
        // 以便我们不会二次预取(double-fetch)已有的数据。
        // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
        router.beforeResolve((to, from, next) => {
          const matched = router.getMatchedComponents(to)
          const prevMatched = router.getMatchedComponents(from)
          // 我们只关心非预渲染的组件
          // 所以我们对比它们，找出两个匹配列表的差异组件
          let diffed = false
          const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c))
          })

          if (!activated.length) {
            return next()
          }
          // 这里如果有加载指示器 (loading indicator)，就触发
          LoadingBar.start()
          Promise.all(activated.map(c => {
            if (c.options && c.options.methods && c.options.methods.asyncData) {
              return c.options.methods.asyncData({ store, route: to })
            }
          })).then(() => {
            // 停止加载指示器(loading indicator)
            LoadingBar.finish()
            next()
          }).catch(next)
        })
        app.$mount('#app');
    });
}
init();
