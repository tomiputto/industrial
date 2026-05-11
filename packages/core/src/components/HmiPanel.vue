<script setup lang="ts">
defineProps<{
  /** Use surface-0 (darker) vs surface-1 (default) */
  deep?: boolean
}>()
</script>

<template>
  <div :class="['hmi-panel', { 'hmi-panel--deep': deep }]">
    <slot />
  </div>
</template>

<style scoped>
.hmi-panel {
  background: var(--hmi-surface-1);
  border: 1px solid var(--hmi-border);
  border-radius: var(--hmi-r-3);
  padding: var(--hmi-s-5);
}

.hmi-panel--deep {
  background: var(--hmi-surface-0);
}
</style>
