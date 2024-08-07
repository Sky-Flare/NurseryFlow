import * as VueRouter from 'vue-router';
import EmployeeList from './pages/EmployeeList.vue';
import Childrenlist from './pages/ChildrenList.vue';
import Schedule from '@/pages/Schedule.vue';

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'schedule',
            component: Schedule,
        },
        { path: '/employee', component: EmployeeList, name: 'employee' },
        { path: '/children', component: Childrenlist, name: 'children' },
        { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
});
