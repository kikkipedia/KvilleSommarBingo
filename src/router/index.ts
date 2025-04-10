import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
//import PswdReset from '../components/PswdReset.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/Register.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../components/PswdReset.vue')
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../components/Map.vue')
    }
  ]
})

export default router
