import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VerifyView from '@/views/VerifyView.vue'
import SignView from '@/views/SignView.vue'
import EncryptView from '@/views/EncryptView.vue'
import DecryptView from '@/views/DecryptView.vue'
import RevokeView from '@/views/RevokeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/verify',
      name: 'verify',
      component: VerifyView
    },
    {
      path: '/sign',
      name: 'sign',
      component: SignView
    },
    {
      path: '/encrypt',
      name: 'encrypt',
      component: EncryptView
    },
    {
      path: '/decrypt',
      name: 'decrypt',
      component: DecryptView
    },
    {
      path: '/revoke',
      name: 'revoke',
      component: RevokeView
    }
  ]
})

export default router
