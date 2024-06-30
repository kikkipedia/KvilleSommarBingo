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
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('../components/Login.vue')
    // },
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
    
  ]
})

export default router
