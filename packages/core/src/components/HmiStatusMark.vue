<script setup lang="ts">
export type StatusMarkVariant = 'allow' | 'deny' | 'ok' | 'warning' | 'fault'

const LABELS: Record<StatusMarkVariant, string> = {
  allow:   'Allowed',
  deny:    'Restricted',
  ok:      'OK',
  warning: 'Warning',
  fault:   'Fault',
}

withDefaults(defineProps<{
  variant: StatusMarkVariant
  /** Hide the text label below the mark */
  hideLabel?: boolean
}>(), {
  hideLabel: false,
})
</script>

<template>
  <div class="hmi-status-cell">
    <div
      :class="['hmi-status-mark', `hmi-status-mark--${variant}`]"
      role="img"
      :aria-label="LABELS[variant]"
    >
      <!-- ok -->
      <svg
        v-if="variant === 'ok'"
        width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false"
      >
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <!-- warning -->
      <svg
        v-else-if="variant === 'warning'"
        width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false"
      >
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      </svg>
      <!-- fault -->
      <svg
        v-else-if="variant === 'fault'"
        width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false"
      >
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <!-- allow / deny: rendered via CSS pseudo-elements -->
    </div>
    <div v-if="!hideLabel" class="hmi-status-mark__label" aria-hidden="true">
      {{ LABELS[variant].toUpperCase() }}
    </div>
  </div>
</template>

<style scoped>
.hmi-status-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hmi-status-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.hmi-status-mark__label {
  font-family: var(--hmi-mono);
  font-size: 11px;
  color: var(--hmi-ink-4);
  text-align: center;
}

/* allow */
.hmi-status-mark--allow {
  background: transparent;
  border: 3px solid var(--hmi-blue-300);
}

/* deny */
.hmi-status-mark--deny {
  background: transparent;
  border: 3px solid var(--hmi-orange-500);
  position: relative;
}
.hmi-status-mark--deny::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 4px;
  top: 50%;
  height: 3px;
  background: var(--hmi-orange-500);
  transform: rotate(-45deg);
}

/* ok */
.hmi-status-mark--ok {
  background: var(--hmi-ok);
  color: #fff;
}

/* warning */
.hmi-status-mark--warning {
  background: var(--hmi-warn);
  color: #1a1106;
}

/* fault */
.hmi-status-mark--fault {
  background: var(--hmi-danger);
  color: #fff;
}
</style>
