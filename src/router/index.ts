/* eslint-disable brace-style */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { LoadingBar } from 'view-design';
import {setTitle,canTurnTo} from '@/utils/util'
Vue.use(VueRouter);

const LOGIN_PAGE_NAME = 'login'
const LOGIN_PAGE_PATH = '/'+LOGIN_PAGE_NAME
const INDEX_PAGE_NAME = 'index'
const INDEX_PAGE_PATH = '/'+INDEX_PAGE_NAME
let routes = [{
    path:"/",
    redirect:INDEX_PAGE_PATH
  },
  { path:"/401",
    name: 'error_401',
    component:() => import(/* webpackChunkName: 'auth' */ `@/components/error_page/401.vue`)
  },
  { path:"/500",
    name: 'error_500',
    component:() => import(/* webpackChunkName: 'auth' */ `@/components/error_page/500.vue`)
  },
  { path:"*",
    name: 'error_404',
    component:() => import(/* webpackChunkName: 'auth' */ `@/components/error_page/404.vue`)
  }
];
const routerContext = require.context('../views', true, /router\.ts$/);
routerContext.keys().forEach(route => {
    // 如果是根目录的 router.ts、 不做任何处理
    if (route.startsWith('./router')) {
        return
    }
    const routerModule = routerContext(route);
    // 兼容 import export 和 require module.export 两种规范  Es modules  commonjs
    routes = [...(routerModule.default || routerModule),...routes];
});
function getAbsolutePath () {
    let path = location.pathname;
    return path.substring(0, path.lastIndexOf('/') + 1);
}
function turnTo(to:any, access:any, next:any){
  // eslint-disable-next-line block-spacing
  if (canTurnTo(to.name, access, routes)) {return next() } // 有权限，可访问
  // eslint-disable-next-line block-spacing
  else {return next({ replace: true, name: 'error_401' })} // 无权限，重定向到401页面
}
export function createRouter(store:any){
    let router = new VueRouter({mode: 'history',routes,base:process.env.VUE_APP_PROJECT_NAME});

  router.beforeEach((to, from, next) => {
    if(process.env.VUE_APP_TARGET ==='client'){
      LoadingBar.start()
    }
    const token = store.state.token||undefined;
    if (!token && to.name !== LOGIN_PAGE_NAME) {
      // 未登录且要跳转的页面不是登录页
      return next({
        name:LOGIN_PAGE_NAME,
        path: LOGIN_PAGE_PATH
      })//跳转到登录页
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
      // 未登陆且要跳转的页面是登录页
      return next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面是登录页
      return next({
        name:INDEX_PAGE_NAME,
        path: INDEX_PAGE_PATH // 跳转到首页
      })
    } else {
      if (store.state.userInfo) {
        turnTo(to, store.state.userInfo.access, next)
      } else {
        return next({
          name:LOGIN_PAGE_NAME,
          path: LOGIN_PAGE_PATH
        })
        // store.dispatch('getUserInfo').then((user:any) => {
        //   // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        //   turnTo(to, user.access, next)
        // }).catch(() => {
        //   localStorage.removeItem('token');
        //   next({
        //     name:LOGIN_PAGE_NAME,
        //     path: LOGIN_PAGE_PATH
        //   })
        // })
      }
    }
  })

  router.afterEach((to:any) => {
    setTitle(to, router.app)
    if(process.env.VUE_APP_TARGET ==='client'){
      LoadingBar.finish()
      window.scrollTo(0, 0)
    }

  })
    return router;
}
