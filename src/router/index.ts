import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Page404View from '@/views/Page404View.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/',
      name: 'generate',
      component: () => import('@/views/GeneratorView.vue')
    },
    {
      path: '/verify',
      name: 'verify',
      component: () => import('@/views/VerifyView.vue')
    },
    {
      path: '/sign',
      name: 'sign',
      component: () => import('@/views/SignView.vue')
    },
    {
      path: '/encrypt',
      name: 'encrypt',
      component: () => import('@/views/EncryptView.vue')
    },
    {
      path: '/decrypt',
      name: 'decrypt',
      component: () => import('@/views/DecryptView.vue')
    },
    {
      path: '/revoke',
      name: 'revoke',
      component: () => import('@/views/RevokeView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: Page404View
    }
  ]
})

export default router
