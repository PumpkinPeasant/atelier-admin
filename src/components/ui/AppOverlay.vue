<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

defineProps<{
  overlayClass?: string
}>()

const emit = defineEmits(['onEscape', 'onClick'])
let isPointerDownOnOverlay = false

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('onEscape')
  }
}

const handlePointerDown = (event: PointerEvent) => {
  isPointerDownOnOverlay = event.target === event.currentTarget
}

const handlePointerUp = (event: PointerEvent) => {
  const isPointerUpOnOverlay = event.target === event.currentTarget

  if (isPointerDownOnOverlay && isPointerUpOnOverlay) {
    emit('onClick')
  }

  isPointerDownOnOverlay = false
}

const resetPointerState = () => {
  isPointerDownOnOverlay = false
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflowY = 'hidden'
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflowY = 'auto'
})
</script>

<template>
  <Transition name="overlay-fade" appear>
    <div
      class="overlay"
      :class="overlayClass"
      @pointerdown="handlePointerDown"
      @pointerup="handlePointerUp"
      @pointercancel="resetPointerState"
    >
      <slot name="content" />
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-300);
  background: rgba(36, 33, 28, 0.32);
  backdrop-filter: blur(4px);
}

@media screen and (max-width: 600px) {
  .overlay {
    padding: 0;
  }
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.1s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
