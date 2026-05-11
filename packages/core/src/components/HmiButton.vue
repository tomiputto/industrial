<script setup lang="ts">
export type ButtonVariant = 'primary' | 'caution' | 'secondary' | 'ghost'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

function handleClick(e: MouseEvent) {
  if (props.disabled) return
  emit('click', e)
}
</script>

<template>
  <button
    :class="['hmi-btn', `hmi-btn--${variant}`]"
    :type="type"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? 0 : undefined"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.hmi-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: var(--hmi-touch-min);
  min-width: 140px;
  padding: 0 24px;
  border-radius: var(--hmi-r-2);
  font-family: var(--hmi-font);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.08s ease, background 0.15s, border-color 0.15s;
  user-select: none;
}
.hmi-btn:active:not([aria-disabled]) {
  transform: translateY(1px);
}
.hmi-btn:focus-visible {
  outline: 2px solid var(--hmi-blue-300);
  outline-offset: 3px;
}

/* Primary — 4.86:1 ✓ */
.hmi-btn--primary {
  background: linear-gradient(180deg, var(--hmi-blue-600) 0%, #0f6aaf 100%);
  color: #fff;
  border-color: var(--hmi-blue-700);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18), 0 1px 0 rgba(0,0,0,.4);
}
.hmi-btn--primary:hover:not([aria-disabled]) {
  background: linear-gradient(180deg, var(--hmi-blue-500) 0%, var(--hmi-blue-600) 100%);
}

/* Caution — 5.45:1 ✓ */
.hmi-btn--caution {
  background: linear-gradient(180deg, #b8470c 0%, #993c0a 100%);
  color: #fff;
  border-color: var(--hmi-orange-700);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18), 0 1px 0 rgba(0,0,0,.4);
}
.hmi-btn--caution:hover:not([aria-disabled]) {
  background: linear-gradient(180deg, var(--hmi-orange-600) 0%, #b8470c 100%);
}

/* Secondary */
.hmi-btn--secondary {
  background: var(--hmi-surface-2);
  color: var(--hmi-ink-1);
  border-color: var(--hmi-surface-4);
}
.hmi-btn--secondary:hover:not([aria-disabled]) {
  background: var(--hmi-surface-3);
}

/* Ghost */
.hmi-btn--ghost {
  background: transparent;
  color: var(--hmi-ink-2);
  border-color: var(--hmi-surface-4);
}
.hmi-btn--ghost:hover:not([aria-disabled]) {
  background: var(--hmi-surface-2);
}

/* Disabled — explicit palette, not opacity-only */
.hmi-btn[aria-disabled='true'] {
  background: var(--hmi-surface-2);
  color: var(--hmi-ink-3);
  border-color: var(--hmi-surface-4);
  box-shadow: none;
  cursor: not-allowed;
}
.hmi-btn[aria-disabled='true']::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 2px;
  background: var(--hmi-ink-3);
  margin-right: 4px;
  border-radius: 1px;
}
</style>
