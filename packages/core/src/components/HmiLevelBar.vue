<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  value: number
  min?: number
  max?: number
  unit?: string
  /** Value 0–1 at which the fill turns orange */
  criticalAt?: number
}>(), {
  min: 0,
  max: 100,
  unit: '%',
  criticalAt: 1,
})

const ratio = computed(() => {
  const r = (props.value - props.min) / (props.max - props.min)
  return Math.max(0, Math.min(1, r))
})

const isCritical = computed(() => ratio.value >= props.criticalAt)
const fillColor = computed(() =>
  isCritical.value ? 'linear-gradient(90deg, var(--hmi-orange-500), var(--hmi-orange-300))' : 'linear-gradient(90deg, var(--hmi-blue-500), var(--hmi-blue-300))'
)
const displayValue = computed(() => `${props.value} ${props.unit}`.trim())
</script>

<template>
  <div
    class="hmi-level"
    role="meter"
    :aria-label="label"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="value"
    :aria-valuetext="displayValue"
  >
    <div class="hmi-level__label">{{ label }}</div>
    <div class="hmi-level__track">
      <div
        class="hmi-level__fill"
        :style="{ width: `${ratio * 100}%`, background: fillColor }"
      />
      <div class="hmi-level__needle" :style="{ left: `${ratio * 100}%` }" />
    </div>
    <div class="hmi-level__value" aria-hidden="true">{{ displayValue }}</div>
  </div>
</template>

<style scoped>
.hmi-level {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hmi-level__label {
  font-size: 13px;
  color: var(--hmi-ink-3);
  min-width: 110px;
  flex-shrink: 0;
}

.hmi-level__track {
  flex: 1;
  height: 8px;
  background: #586168; /* raised for WCAG 1.4.11 */
  border-radius: 2px;
  position: relative;
  overflow: visible;
}

.hmi-level__fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.hmi-level__needle {
  position: absolute;
  top: -6px;
  width: 2px;
  height: 20px;
  background: var(--hmi-blue-100);
  transform: translateX(-50%);
  transition: left 0.3s ease;
}

.hmi-level__value {
  font-family: var(--hmi-mono);
  font-weight: 600;
  font-size: 15px;
  color: var(--hmi-ink-1);
  min-width: 70px;
  text-align: right;
  flex-shrink: 0;
}
</style>
