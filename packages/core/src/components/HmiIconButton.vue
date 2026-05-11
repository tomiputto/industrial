<script setup lang="ts">
withDefaults(defineProps<{
  /** Accessible label — required */
  label: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <button
    class="hmi-icon-btn"
    :type="type"
    :aria-label="label"
    :aria-disabled="disabled || undefined"
    @click="(e) => !disabled && emit('click', e)"
  >
    <!-- Pass SVG icon via default slot. Set aria-hidden + focusable="false" on the SVG. -->
    <slot />
  </button>
</template>

<style scoped>
.hmi-icon-btn {
  width: var(--hmi-touch-min);
  height: var(--hmi-touch-min);
  padding: 0;
  background: var(--hmi-surface-2);
  border: 1px solid var(--hmi-surface-4);
  border-radius: var(--hmi-r-2);
  color: var(--hmi-ink-1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}
.hmi-icon-btn:hover:not([aria-disabled]) {
  background: var(--hmi-surface-3);
}
.hmi-icon-btn:active:not([aria-disabled]) {
  transform: translateY(1px);
}
.hmi-icon-btn:focus-visible {
  outline: 2px solid var(--hmi-blue-300);
  outline-offset: 3px;
}
.hmi-icon-btn[aria-disabled='true'] {
  background: var(--hmi-surface-2);
  color: var(--hmi-ink-4);
  cursor: not-allowed;
}
</style>
