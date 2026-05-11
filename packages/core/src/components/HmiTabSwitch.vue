<script setup lang="ts">
import { ref, watch } from 'vue'

export interface TabOption {
  value: string
  label: string
}

const props = defineProps<{
  /** v-model value — must match one of options[].value */
  modelValue: string
  options: TabOption[]
  /** Accessible label for the tablist */
  ariaLabel?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabRefs = ref<HTMLButtonElement[]>([])

function activate(idx: number, focus = false) {
  emit('update:modelValue', props.options[idx].value)
  if (focus) tabRefs.value[idx]?.focus()
}

function onKeydown(e: KeyboardEvent, idx: number) {
  const last = props.options.length - 1
  if (e.key === 'ArrowRight') { e.preventDefault(); activate((idx + 1) % props.options.length, true) }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); activate((idx - 1 + props.options.length) % props.options.length, true) }
  if (e.key === 'Home')       { e.preventDefault(); activate(0, true) }
  if (e.key === 'End')        { e.preventDefault(); activate(last, true) }
}
</script>

<template>
  <div
    class="hmi-tab-switch"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <button
      v-for="(opt, i) in options"
      :key="opt.value"
      :ref="(el) => { if (el) tabRefs[i] = el as HTMLButtonElement }"
      class="hmi-tab"
      role="tab"
      :aria-selected="modelValue === opt.value"
      :tabindex="modelValue === opt.value ? 0 : -1"
      @click="activate(i)"
      @keydown="onKeydown($event, i)"
    >
      {{ opt.label }}
      <slot :name="opt.value" />
    </button>
  </div>
</template>

<style scoped>
.hmi-tab-switch {
  display: inline-flex;
  background: var(--hmi-surface-1);
  border: 1px solid var(--hmi-border);
  border-radius: var(--hmi-r-2);
  padding: 4px;
  height: 64px;
}

.hmi-tab {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 4px;
  color: var(--hmi-ink-2);
  font-family: var(--hmi-font);
  font-weight: 600;
  font-size: 17px;
  letter-spacing: 0.01em;
  cursor: pointer;
  border: 0;
  background: transparent;
  padding: 0 var(--hmi-s-5);
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.hmi-tab:focus-visible {
  outline: 2px solid var(--hmi-blue-300);
  outline-offset: 3px;
}
.hmi-tab[aria-selected='true'] {
  background: linear-gradient(180deg, var(--hmi-blue-600) 0%, #0f6aaf 100%);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18), 0 1px 0 rgba(0,0,0,.4);
}
</style>
