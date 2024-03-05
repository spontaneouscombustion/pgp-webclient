<script lang="ts" setup>
type ToastModes = 'success' | 'info' | 'warning' | 'error'

const emit = defineEmits<{
  (e: 'toast', message: string, mode: ToastModes): void
}>()

withDefaults(
  defineProps<{
    classes: string
    data: string
  }>(),
  {
    classes: 'dropdown-top'
  }
)

function showToast(message: string = '', mode: ToastModes = 'info') {
  emit('toast', message, mode)
}
</script>
<template>
  <div class="join join-horizontal">
    <div class="dropdown" :class="classes">
      <div tabindex="0" class="btn btn-bordered join-item" role="button">
        <svg xmlns="http://www.w3.org/2000/svg" class="fill-current size-5" viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
          />
        </svg>
      </div>
      <ul tabindex="0" class="shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        <li>
          <a href="#" @click.prevent="showToast('test')">Download</a>
        </li>
        <slot></slot>
      </ul>
    </div>
    <button type="button" class="btn btn-bordered join-item">Copy to Clipboard</button>
  </div>
</template>
