let routes = [
  { path:"/index",
    name: 'index',
    component:() => import(/* webpackChunkName: 'auth' */ `@/views/main/main.vue`)
  }
];
export default routes;
