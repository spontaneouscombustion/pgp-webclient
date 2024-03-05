<script lang="ts" setup>
import RevokeByCertificateComponent from './RevokeByCertificateComponent.vue'
import RevokeByPrivateKeyComponent from './RevokeByPrivateKeyComponent.vue'
import { ref, shallowRef } from 'vue'

const emit = defineEmits<{
  (e: 'revoked', publicKey: string): void
}>()

const activeTab = ref<number>(0)
const tabs = ref([
  {
    component: shallowRef(RevokeByCertificateComponent),
    name: 'Revocation Key'
  },
  {
    component: shallowRef(RevokeByPrivateKeyComponent),
    name: 'Private Key'
  }
])

function onRevoked(publicKey: string) {
  emit('revoked', publicKey)
}
</script>

<template>
  <div>
    <div role="tablist" class="tabs tabs-boxed">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.name"
        role="tab"
        class="tab"
        @click="activeTab = index"
      >
        {{ tab.name }}
      </button>
    </div>
    <component :is="tabs[activeTab].component" @revoked="onRevoked"></component>
  </div>
</template>
