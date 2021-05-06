let routes = [
  { path:"/login",
    name: 'login',
    component:() => import(/* webpackChunkName: 'auth' */ `@/views/auth/login/login.vue`)
  }
];
export default routes;
