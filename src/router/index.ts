import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import store from '@/store';

const Home = () => import('@/views/Home.vue');
const About = () => import('@/views/About.vue');
const Song = () => import(/* webpackChunkName: "groupedChunk" */'@/views/Song.vue');
const Manage = () => import(/* webpackChunkName: "groupedChunk" */'@/views/Manage.vue');

const routes: Array<RouteRecordRaw> = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'about',
    path: '/about',
    component: About,
  },
  {
    name: 'manage',
    // alias: '/manage',
    path: '/manage-music',
    meta: {
      requiresAuth: true,
    },
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log('Manage Route Guard');
      next();
    },
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song,
  },
  {
    path: '/manage',
    redirect: {
      name: 'manage',
    },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if ((store.state as any).auth.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
