<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  min?: number
  max?: number
  unit?: string
  label?: string
  /** Total number of segments */
  segments?: number
  /** Fraction of max above which segments turn orange */
  criticalAbove?: number
}>(), {
  min: 0,
  max: 100,
  unit: '%',
  segments: 20,
  criticalAbove: 0.85,
})

const ratio = computed(() => {
  const r = (props.value - props.min) / (props.max - props.min)
  return Math.max(0, Math.min(1, r))
})

const filledCount = computed(() => Math.round(ratio.value * props.segments))
const critStart = computed(() => Math.round(props.criticalAbove * props.segments))

function segClass(i: number) {
  // 0-indexed
  if (i < filledCount.value) {
    return i >= critStart.value ? 'hmi-seg--crit' : 'hmi-seg--on'
  }
  return ''
}

const displayValue = computed(() => `${props.value} ${props.unit}`.trim())
</script>

<template>
  <div
    class="hmi-seg-bar"
    role="meter"
    :aria-label="label || displayValue"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="value"
    :aria-valuetext="displayValue"
  >
    <!-- optional icon slot -->
    <slot name="icon" />

    <div
      v-for="i in segments"
      :key="i"
      :class="['hmi-seg', segClass(i - 1)]"
    />

    <div class="hmi-seg-bar__val" aria-hidden="true">
      {{ value }}<span class="hmi-seg-bar__unit">{{ unit }}</span>
    </div>
  </div>
</template>

<style scoped>
.hmi-seg-bar {
  display: flex;
  gap: 2px;
  background: var(--hmi-surface-1);
  padding: 8px 10px;
  border-radius: var(--hmi-r-2);
  border: 1px solid var(--hmi-border);
  align-items: center;
}

.hmi-seg {
  width: 8px;
  height: 22px;
  background: #586168; /* raised for WCAG 1.4.11 */
  border-radius: 1px;
  flex-shrink: 0;
}

.hmi-seg--on   { background: var(--hmi-blue-500); }
.hmi-seg--crit { background: var(--hmi-orange-500); }

.hmi-seg-bar__val {
  margin-left: 14px;
  font-family: var(--hmi-mono);
  font-weight: 600;
  font-size: 15px;
  color: var(--hmi-ink-1);
  white-space: nowrap;
}

.hmi-seg-bar__unit {
  color: var(--hmi-ink-3);
  margin-left: 4px;
  font-weight: 400;
}
</style>
