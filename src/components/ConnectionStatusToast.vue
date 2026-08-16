<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)
const isOnline = ref(true)
const message = ref('')

// only show the "back online" toast if the user actually saw the offline one first
let hasNotifiedOffline = false
let hideTimeout: ReturnType<typeof setTimeout> | undefined

function handleOffline() {
  hasNotifiedOffline = true
  clearTimeout(hideTimeout)
  isOnline.value = false
  message.value = "You're offline — showing cached data."
  visible.value = true
}

function handleOnline() {
  if (!hasNotifiedOffline) return
  hasNotifiedOffline = false
  isOnline.value = true
  message.value = "You're back online."
  visible.value = true
  hideTimeout = setTimeout(() => {
    visible.value = false
  }, 4000)
}

onMounted(() => {
  window.addEventListener('offline', handleOffline)
  window.addEventListener('online', handleOnline)
})

onUnmounted(() => {
  window.removeEventListener('offline', handleOffline)
  window.removeEventListener('online', handleOnline)
  clearTimeout(hideTimeout)
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div
        :class="[
          'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg',
          isOnline ? 'bg-emerald-600' : 'bg-brand',
        ]"
      >
        <span class="h-2 w-2 flex-none rounded-full bg-white/80"></span>
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
