const routes = [
    {
        path: '/HelloWorld',
        name: 'HelloWorld',
        component:() => import (/* webpackChunkName:'login' */ `@/components/HelloWorld.vue`)
    }
];
export default routes;