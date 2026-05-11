<script setup lang="ts">
export type BadgeVariant = 'ok' | 'warn' | 'fault' | 'info'

const ICONS: Record<BadgeVariant, string> = {
  ok:    `<polyline points="20 6 9 17 4 12"/>`,
  warn:  `<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
  fault: `<circle cx="12" cy="12" r="9"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  info:  `<line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`,
}

const PREFIXES: Record<BadgeVariant, string> = {
  ok: 'OK ·', warn: 'WARN ·', fault: 'FAULT ·', info: 'INFO ·',
}

withDefaults(defineProps<{
  variant: BadgeVariant
  message: string
}>(), {})
</script>

<template>
  <span
    :class="['hmi-badge', `hmi-badge--${variant}`]"
    :role="variant === 'fault' ? 'alert' : 'status'"
  >
    <span class="hmi-badge__ring" aria-hidden="true">
      <svg
        width="14" height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
        v-html="ICONS[variant]"
      />
    </span>
    <span class="hmi-badge__prefix">{{ PREFIXES[variant] }}</span>
    {{ message }}
  </span>
</template>

<style scoped>
.hmi-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 10px 12px;
  border-radius: var(--hmi-r-pill);
  font-size: 14px;
  font-weight: 600;
  background: var(--hmi-surface-1);
  border: 1px solid var(--hmi-border);
  color: var(--hmi-ink-1);
}

.hmi-badge__ring {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hmi-badge__prefix {
  font-family: var(--hmi-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--hmi-ink-3);
}

/* ok */
.hmi-badge--ok .hmi-badge__ring {
  background: rgba(58, 166, 107, 0.12);
  color: var(--hmi-ok);
  border: 1.5px solid var(--hmi-ok);
}

/* warn */
.hmi-badge--warn .hmi-badge__ring {
  background: rgba(232, 169, 58, 0.12);
  color: var(--hmi-warn);
  border: 1.5px solid var(--hmi-warn);
}

/* fault */
.hmi-badge--fault .hmi-badge__ring {
  background: rgba(216, 58, 58, 0.12);
  color: var(--hmi-danger);
  border: 1.5px solid var(--hmi-danger);
}

/* info */
.hmi-badge--info .hmi-badge__ring {
  background: rgba(31, 143, 230, 0.14);
  color: var(--hmi-blue-300);
  border: 1.5px solid var(--hmi-blue-500);
}
</style>
