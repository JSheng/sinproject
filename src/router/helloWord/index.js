const routes = [
    {
        path: '/',
        name: 'HelloWorld',
        component:() => import (/* webpackChunkName:'login' */ `@/components/HelloWorld.vue`)
        //component:r => require.ensure( [], () => r (require('@/components/HelloWorld.vue')))
    }
];
export default routes;