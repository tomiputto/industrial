<script setup lang="ts">
import { computed } from 'vue'

export type GaugeType = 'half' | 'full'

const props = withDefaults(defineProps<{
  /** 'half' = half-arc, 'full' = full-circle */
  type?: GaugeType
  value: number
  min?: number
  max: number
  unit?: string
  label: string
  /** Fraction of arc (from end) shown in orange. Default 0.14 */
  redZone?: number
  /** Show needle indicator */
  showNeedle?: boolean
}>(), {
  type: 'full',
  min: 0,
  unit: '',
  redZone: 0.14,
  showNeedle: true,
})

// ── colours (match prototype) ──
const C = {
  track:    '#5e6770',
  blue:     '#1f8fe6',
  orange:   '#f26a1a',
  inkMute:  '#5e6770',
}

const ratio = computed(() => {
  const r = (props.value - props.min) / (props.max - props.min)
  return Math.max(0, Math.min(1, r))
})

// ─────────────────────── half arc ───────────────────────
interface Seg { x1: number; y1: number; x2: number; y2: number; color: string }

const halfSegs = computed<Seg[]>(() => {
  const cx = 120, cy = 130, r = 96
  const startAngle = 180, endAngle = 360
  const ticks = 50
  const redZone = props.redZone
  const segs: Seg[] = []

  for (let i = 0; i < ticks; i++) {
    const t = i / (ticks - 1)
    const ang = startAngle + t * (endAngle - startAngle)
    const rad = ang * Math.PI / 180
    const inner = r - 12
    const outer = i === Math.round((1 - redZone) * ticks - 1) ? r + 4 : r
    const x1 = cx + Math.cos(rad) * inner
    const y1 = cy + Math.sin(rad) * inner
    const x2 = cx + Math.cos(rad) * outer
    const y2 = cy + Math.sin(rad) * outer
    const redEnd = Math.round(redZone * ticks)
    const redStart = Math.round((1 - redZone) * ticks)
    const color = (i < redEnd || i >= redStart) ? C.orange : C.track
    segs.push({ x1, y1, x2, y2, color })
  }
  return segs
})

const halfArc = computed(() => {
  const cx = 120, cy = 130, r = 96
  const startAngle = 180, endAngle = 360
  const arcR = r - 22
  const arcEndAng = startAngle + ratio.value * (endAngle - startAngle)
  const largeArc = arcEndAng - startAngle > 180 ? 1 : 0
  const ax1 = cx + Math.cos(startAngle * Math.PI / 180) * arcR
  const ay1 = cy + Math.sin(startAngle * Math.PI / 180) * arcR
  const ax2 = cx + Math.cos(arcEndAng * Math.PI / 180) * arcR
  const ay2 = cy + Math.sin(arcEndAng * Math.PI / 180) * arcR
  return { d: `M ${ax1} ${ay1} A ${arcR} ${arcR} 0 ${largeArc} 1 ${ax2} ${ay2}`, endAng: arcEndAng }
})

const halfNeedle = computed(() => {
  const cx = 120, cy = 130, r = 96
  const { endAng } = halfArc.value
  const nAng = endAng * Math.PI / 180
  const nx = cx + Math.cos(nAng) * (r - 8)
  const ny = cy + Math.sin(nAng) * (r - 8)
  const inx = cx + Math.cos(nAng) * (r - 28)
  const iny = cy + Math.sin(nAng) * (r - 28)
  const perp = nAng + Math.PI / 2
  const w = 8
  return {
    points: `${nx},${ny} ${inx + Math.cos(perp) * w},${iny + Math.sin(perp) * w} ${inx - Math.cos(perp) * w},${iny - Math.sin(perp) * w}`
  }
})

// ─────────────────────── full circle ───────────────────────
const fullSegs = computed<Seg[]>(() => {
  const cx = 100, cy = 100, r = 76
  const startAngle = 135, sweep = 270
  const ticks = 48
  const redStart = Math.round((1 - props.redZone) * ticks)
  const segs: Seg[] = []
  for (let i = 0; i < ticks; i++) {
    const t = i / (ticks - 1)
    const ang = startAngle + t * sweep
    const rad = ang * Math.PI / 180
    const inner = r - 9
    const x1 = cx + Math.cos(rad) * inner
    const y1 = cy + Math.sin(rad) * inner
    const x2 = cx + Math.cos(rad) * r
    const y2 = cy + Math.sin(rad) * r
    segs.push({ x1, y1, x2, y2, color: i >= redStart ? C.orange : C.track })
  }
  return segs
})

const fullArc = computed(() => {
  const cx = 100, cy = 100, r = 76
  const startAngle = 135, sweep = 270
  const arcR = r - 17
  const endAng = startAngle + ratio.value * sweep
  const ax1 = cx + Math.cos(startAngle * Math.PI / 180) * arcR
  const ay1 = cy + Math.sin(startAngle * Math.PI / 180) * arcR
  const ax2 = cx + Math.cos(endAng * Math.PI / 180) * arcR
  const ay2 = cy + Math.sin(endAng * Math.PI / 180) * arcR
  const largeArc = ratio.value * sweep > 180 ? 1 : 0
  return { d: `M ${ax1} ${ay1} A ${arcR} ${arcR} 0 ${largeArc} 1 ${ax2} ${ay2}`, endAng }
})

const fullNeedle = computed(() => {
  const cx = 100, cy = 100, r = 76
  const nAng = fullArc.value.endAng * Math.PI / 180
  const nx = cx + Math.cos(nAng) * (r - 4)
  const ny = cy + Math.sin(nAng) * (r - 4)
  const inx = cx + Math.cos(nAng) * (r - 22)
  const iny = cy + Math.sin(nAng) * (r - 22)
  const perp = nAng + Math.PI / 2
  const w = 6
  return {
    points: `${nx},${ny} ${inx + Math.cos(perp) * w},${iny + Math.sin(perp) * w} ${inx - Math.cos(perp) * w},${iny - Math.sin(perp) * w}`
  }
})

// Scale labels for full gauge
const fullScaleLabels = computed(() => {
  const cx = 100, cy = 100, r = 76
  const startAngle = 135, sweep = 270
  const count = 7
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1)
    const ang = (startAngle + t * sweep) * Math.PI / 180
    const lr = r + 14
    const val = Math.round(props.min + t * (props.max - props.min))
    return { x: cx + Math.cos(ang) * lr, y: cy + Math.sin(ang) * lr, txt: String(val) }
  })
})

const ariaValueText = computed(() =>
  `${props.value} ${props.unit || ''}`.trim()
)
</script>

<template>
  <div
    class="hmi-gauge-card"
    role="meter"
    :aria-label="label"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="value"
    :aria-valuetext="ariaValueText"
  >
    <div class="hmi-gauge-card__title">{{ label }}</div>

    <!-- ── Half arc ── -->
    <template v-if="type === 'half'">
      <div class="hmi-gauge-half-wrap">
        <svg
          class="hmi-gauge-svg"
          viewBox="0 0 240 160"
          aria-hidden="true"
          focusable="false"
        >
          <line
            v-for="(seg, i) in halfSegs"
            :key="i"
            :x1="seg.x1" :y1="seg.y1"
            :x2="seg.x2" :y2="seg.y2"
            :stroke="seg.color"
            stroke-width="3"
            stroke-linecap="butt"
          />
          <path
            v-if="ratio > 0"
            :d="halfArc.d"
            :stroke="C.blue"
            stroke-width="7"
            fill="none"
            stroke-linecap="round"
          />
          <polygon
            v-if="showNeedle && ratio > 0"
            :points="halfNeedle.points"
            :fill="C.blue"
          />
        </svg>
        <div class="hmi-gauge-half-wrap__center" aria-hidden="true">
          <slot name="center">
            <div class="hmi-gauge__value">{{ value }}</div>
            <div class="hmi-gauge__unit">{{ unit }}</div>
          </slot>
        </div>
      </div>
    </template>

    <!-- ── Full circle ── -->
    <template v-else>
      <div class="hmi-gauge-full-wrap">
        <svg
          class="hmi-gauge-svg"
          viewBox="0 0 200 200"
          aria-hidden="true"
          focusable="false"
        >
          <line
            v-for="(seg, i) in fullSegs"
            :key="i"
            :x1="seg.x1" :y1="seg.y1"
            :x2="seg.x2" :y2="seg.y2"
            :stroke="seg.color"
            stroke-width="2.5"
          />
          <path
            v-if="ratio > 0"
            :d="fullArc.d"
            :stroke="C.blue"
            stroke-width="6"
            fill="none"
            stroke-linecap="round"
          />
          <text
            v-for="lbl in fullScaleLabels"
            :key="lbl.txt"
            :x="lbl.x" :y="lbl.y"
            :fill="C.inkMute"
            font-size="10"
            font-family="Manrope, system-ui, sans-serif"
            text-anchor="middle"
            dominant-baseline="middle"
          >{{ lbl.txt }}</text>
          <polygon
            v-if="showNeedle && ratio > 0"
            :points="fullNeedle.points"
            :fill="C.blue"
          />
        </svg>
        <div class="hmi-gauge-full-wrap__center" aria-hidden="true">
          <slot name="center">
            <div class="hmi-gauge__value hmi-gauge__value--full">{{ value }}</div>
            <div class="hmi-gauge__unit">{{ unit }}</div>
          </slot>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.hmi-gauge-card {
  background: var(--hmi-surface-0);
  border: 1px solid var(--hmi-border);
  border-radius: var(--hmi-r-3);
  padding: var(--hmi-s-5);
  display: flex;
  flex-direction: column;
  gap: var(--hmi-s-3);
}

.hmi-gauge-card__title {
  font-family: var(--hmi-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--hmi-ink-3);
  text-transform: uppercase;
}

.hmi-gauge-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* ── Half arc ── */
.hmi-gauge-half-wrap {
  position: relative;
  text-align: center;
}
.hmi-gauge-half-wrap__center {
  position: absolute;
  left: 0; right: 0;
  bottom: 22%;
  text-align: center;
  pointer-events: none;
}

/* ── Full circle ── */
.hmi-gauge-full-wrap {
  position: relative;
  text-align: center;
}
.hmi-gauge-full-wrap__center {
  position: absolute;
  left: 0; right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* ── Shared readout ── */
.hmi-gauge__value {
  font-weight: 700;
  font-size: 44px;
  color: var(--hmi-ink-1);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.hmi-gauge__value--full {
  font-size: 32px;
  letter-spacing: -0.01em;
}
.hmi-gauge__unit {
  color: var(--hmi-ink-3);
  font-size: 13px;
  margin-top: 4px;
  font-family: var(--hmi-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
