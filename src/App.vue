<script setup lang="ts">
import { RouterView } from 'vue-router'
import { type PrivateKey } from 'openpgp'
import { provide, ref, onMounted } from 'vue'
import { privateKeySymbol } from '@/keys'
import { registerSW } from 'virtual:pwa-register'
import NavbarComponent from '@/components/NavbarComponent.vue'
import PrivateKeyComponent from '@/components/PrivateKeyComponent.vue'
import ToastComponent from '@/components/ToastComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'

const toastAlerts = ref<
  {
    type: 'alert-success' | 'alert-info' | 'alert-warning' | 'alert-error'
    message: string
    buttons?: {
      name: string
      classes: string
      action: (params: any, event: Event) => any | void
    }[]
  }[]
>([])

onMounted(() => {
  const updateSW = registerSW({
    onNeedRefresh() {
      toastAlerts.value.push({
        message: 'A new update has been detected!',
        type: 'alert-success',
        buttons: [
          {
            name: 'Later',
            classes: 'btn-success',
            action: (index: number) => {
              toastAlerts.value.splice(index, 1)
            }
          },
          {
            name: 'Reload',
            classes: 'btn-primary',
            action: async (index: number) => {
              updateSW()
              toastAlerts.value.splice(index, 1)
            }
          }
        ]
      })
    },
    onOfflineReady() {
      toastAlerts.value.push({
        message: 'This app can now be used even without internet connection!',
        type: 'alert-info',
        buttons: [
          {
            name: 'OK',
            classes: 'btn-info',
            action: (index: number) => {
              toastAlerts.value.splice(index, 1)
            }
          }
        ]
      })
    }
  })
})

const privateKeyObject = ref<PrivateKey>()

function updatePrivateKey(pkey: PrivateKey | undefined) {
  privateKeyObject.value = pkey
}

provide(privateKeySymbol, {
  privateKey: privateKeyObject,
  updatePrivateKey
})
</script>

<template>
  <div class="drawer drawer-end">
    <input id="privkey-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <NavbarComponent />
      <div class="p-4">
        <RouterView />
      </div>
    </div>
    <div class="drawer-side">
      <label for="privkey-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="p-4 w-80 min-h-full bg-base-200 text-base-content">
        <div class="text-center py-5">
          <h4 class="text-xl">Your Private Key</h4>
          <p>Certain functions requires Private Key like signing and decrypting message</p>
        </div>
        <div class="flex flex-col gap-2"><PrivateKeyComponent /></div>
      </div>
    </div>
  </div>
  <ToastComponent>
    <AlertComponent
      v-for="(alert, index) in toastAlerts"
      :key="index"
      :type="alert.type"
      :message="alert.message"
    >
      <div>
        <button
          v-for="(button, i) in alert.buttons"
          :key="i"
          class="btn btn-sm"
          :class="button.classes"
          v-text="button.name"
          @click="(e) => button.action(index, e)"
        ></button>
      </div>
    </AlertComponent>
  </ToastComponent>
</template>
