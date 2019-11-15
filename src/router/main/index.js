const routes = [
    {
        path: '/index',
        name: 'Main',
        component:() => import (/* webpackChunkName:'main' */ `@/components/layout/main.vue`)
    }
];
export default routes;