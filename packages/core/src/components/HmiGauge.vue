<script setup lang="ts">
import { computed } from 'vue'

export type GaugeType = 'half' | 'full'

const props = withDefaults(defineProps<{
  /**
   * 'half' = wide-arc (200°→340°, 140° sweep) — for speed/fuel style readouts
   * 'full' = full-circle (135°→405°, 270° sweep)
   */
  type?: GaugeType
  value: number
  min?: number
  max: number
  unit?: string
  label: string
  /** Fraction of arc (from high end) shown in orange. Default 0.14 */
  redZone?: number
  /** Number of ticks at the LOW end shown in orange (for fuel empty). Default 0 */
  redZoneLow?: number
  showNeedle?: boolean
  /** Scale labels: array of { t: 0..1, text: string } */
  scaleLabels?: { t: number; text: string }[]
  /** Yellow warning zone: { from: 0..1, to: 0..1 } */
  warnZone?: { from: number; to: number }
}>(), {
  type: 'full',
  min: 0,
  unit: '',
  redZone: 0.14,
  redZoneLow: 0,
  showNeedle: true,
})

const C = {
  track:   '#586168',
  blue:    '#1f8fe6',
  orange:  '#f26a1a',
  yellow:  '#f0b429',
  inkMute: '#f1f4f7',
}

const ratio = computed(() => {
  const r = (props.value - props.min) / (props.max - props.min)
  return Math.max(0, Math.min(1, r))
})

// ─────────────────────── WIDE ARC (half) ───────────────────────
// viewBox 320×220, cx=160, cy=178, r=130, sweep 200°→340°

interface Seg { x1: number; y1: number; x2: number; y2: number; color: string; wide: boolean }

const HALF = { cx: 160, cy: 178, r: 130, startAngle: 200, endAngle: 340, ticks: 56 }

const halfSegs = computed<Seg[]>(() => {
  const { cx, cy, r, startAngle, endAngle, ticks } = HALF
  const sweep = endAngle - startAngle
  const fillIdx = Math.round(ratio.value * (ticks - 1))
  const redHigh = ticks - Math.round(props.redZone * ticks)
  const redLow  = Math.round(props.redZoneLow * ticks)

  return Array.from({ length: ticks }, (_, i) => {
    const t = i / (ticks - 1)
    const ang = startAngle + t * sweep
    const rad = ang * Math.PI / 180
    const inner = r - 14
    const outer = r
    const color = (i < redLow || i >= redHigh) ? C.orange : C.track
    return {
      x1: cx + Math.cos(rad) * inner,
      y1: cy + Math.sin(rad) * inner,
      x2: cx + Math.cos(rad) * outer,
      y2: cy + Math.sin(rad) * outer,
      color,
      wide: i === fillIdx,
    }
  })
})

const halfArc = computed(() => {
  const { cx, cy, r, startAngle, endAngle } = HALF
  const sweep = endAngle - startAngle
  const arcR = r - 30
  const arcEndAng = startAngle + ratio.value * sweep
  const large = (arcEndAng - startAngle) > 180 ? 1 : 0
  const ax1 = cx + Math.cos(startAngle * Math.PI / 180) * arcR
  const ay1 = cy + Math.sin(startAngle * Math.PI / 180) * arcR
  const ax2 = cx + Math.cos(arcEndAng * Math.PI / 180) * arcR
  const ay2 = cy + Math.sin(arcEndAng * Math.PI / 180) * arcR
  return { d: `M ${ax1} ${ay1} A ${arcR} ${arcR} 0 ${large} 1 ${ax2} ${ay2}`, endAng: arcEndAng }
})

const halfNeedle = computed(() => {
  const { cx, cy, r } = HALF
  const { endAng } = halfArc.value
  const nAng = endAng * Math.PI / 180
  const tipX  = cx + Math.cos(nAng) * (r - 6)
  const tipY  = cy + Math.sin(nAng) * (r - 6)
  const baseR = r - 26
  const bCX   = cx + Math.cos(nAng) * baseR
  const bCY   = cy + Math.sin(nAng) * baseR
  const perp  = nAng + Math.PI / 2
  const w = 11
  return {
    points: `${tipX},${tipY} ${bCX + Math.cos(perp) * w},${bCY + Math.sin(perp) * w} ${bCX - Math.cos(perp) * w},${bCY - Math.sin(perp) * w}`
  }
})

const halfScaleLabels = computed(() => {
  if (props.scaleLabels) return props.scaleLabels.map(({ t, text }) => {
    const { cx, cy, r, startAngle, endAngle } = HALF
    const ang = (startAngle + t * (endAngle - startAngle)) * Math.PI / 180
    const lr = r + 22
    return { x: cx + Math.cos(ang) * lr, y: cy + Math.sin(ang) * lr, text }
  })
  // auto-generate from min/max
  const { cx, cy, r, startAngle, endAngle } = HALF
  const sweep = endAngle - startAngle
  return [0, 0.25, 0.5, 0.75, 1].map(t => {
    const ang = (startAngle + t * sweep) * Math.PI / 180
    const lr = r + 22
    const val = Math.round(props.min + t * (props.max - props.min))
    return { x: cx + Math.cos(ang) * lr, y: cy + Math.sin(ang) * lr, text: String(val) }
  })
})

// ─────────────────────── FULL CIRCLE ───────────────────────
// viewBox 200×200, cx=100, cy=100, r=76, sweep 135°→405° (270°)

const FULL = { cx: 100, cy: 100, r: 76, startAngle: 135, sweep: 270, ticks: 48 }

const fullSegs = computed<{ x1: number; y1: number; x2: number; y2: number; color: string }[]>(() => {
  const { cx, cy, r, startAngle, sweep, ticks } = FULL
  const redStart = Math.round((1 - props.redZone) * ticks)
  const warnFrom = props.warnZone ? Math.round(props.warnZone.from * ticks) : -1
  const warnTo   = props.warnZone ? Math.round(props.warnZone.to   * ticks) : -1
  return Array.from({ length: ticks }, (_, i) => {
    const t = i / (ticks - 1)
    const ang = startAngle + t * sweep
    const rad = ang * Math.PI / 180
    const inner = r - 9
    const color = i >= redStart
      ? C.orange
      : (i >= warnFrom && i < warnTo ? C.yellow : C.track)
    return {
      x1: cx + Math.cos(rad) * inner,
      y1: cy + Math.sin(rad) * inner,
      x2: cx + Math.cos(rad) * r,
      y2: cy + Math.sin(rad) * r,
      color,
    }
  })
})

const fullArc = computed(() => {
  const { cx, cy, r, startAngle, sweep } = FULL
  const arcR = r - 17
  const endAng = startAngle + ratio.value * sweep
  const ax1 = cx + Math.cos(startAngle * Math.PI / 180) * arcR
  const ay1 = cy + Math.sin(startAngle * Math.PI / 180) * arcR
  const ax2 = cx + Math.cos(endAng * Math.PI / 180) * arcR
  const ay2 = cy + Math.sin(endAng * Math.PI / 180) * arcR
  const large = ratio.value * sweep > 180 ? 1 : 0
  return { d: `M ${ax1} ${ay1} A ${arcR} ${arcR} 0 ${large} 1 ${ax2} ${ay2}`, endAng }
})

const fullNeedle = computed(() => {
  const { cx, cy, r } = FULL
  const nAng = fullArc.value.endAng * Math.PI / 180
  const tipR = r - 2    // at outer edge
  const baseR = r - 16  // short, near tick area
  const tipX = cx + Math.cos(nAng) * tipR
  const tipY = cy + Math.sin(nAng) * tipR
  const bCX  = cx + Math.cos(nAng) * baseR
  const bCY  = cy + Math.sin(nAng) * baseR
  const perp = nAng + Math.PI / 2
  const w = 5
  return {
    points: `${tipX},${tipY} ${bCX + Math.cos(perp) * w},${bCY + Math.sin(perp) * w} ${bCX - Math.cos(perp) * w},${bCY - Math.sin(perp) * w}`
  }
})

const fullScaleLabels = computed(() => {
  const { cx, cy, r, startAngle, sweep } = FULL
  const lr = r + 14
  if (props.scaleLabels) {
    return props.scaleLabels.map(({ t, text }) => {
      const ang = (startAngle + t * sweep) * Math.PI / 180
      return { x: cx + Math.cos(ang) * lr, y: cy + Math.sin(ang) * lr, txt: text }
    })
  }
  const count = 7
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1)
    const ang = (startAngle + t * sweep) * Math.PI / 180
    const val = Math.round(props.min + t * (props.max - props.min))
    return { x: cx + Math.cos(ang) * lr, y: cy + Math.sin(ang) * lr, txt: String(val) }
  })
})

const ariaValueText = computed(() => `${props.value} ${props.unit}`.trim())
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

    <!-- ── Wide-arc (half) ── -->
    <template v-if="type === 'half'">
      <div class="hmi-gauge-half-wrap">
        <svg
          class="hmi-gauge-svg hmi-gauge-svg--half"
          viewBox="0 0 320 220"
          aria-hidden="true"
          focusable="false"
        >
          <line
            v-for="(seg, i) in halfSegs"
            :key="i"
            :x1="seg.x1" :y1="seg.y1"
            :x2="seg.x2" :y2="seg.y2"
            :stroke="seg.color"
            :stroke-width="seg.wide ? '5' : '3.4'"
            stroke-linecap="butt"
          />
          <path
            v-if="ratio > 0"
            :d="halfArc.d"
            :stroke="C.blue"
            stroke-width="8"
            fill="none"
            stroke-linecap="round"
          />
          <polygon
            v-if="showNeedle && ratio > 0"
            :points="halfNeedle.points"
            :fill="C.blue"
          />
          <text
            v-for="lbl in halfScaleLabels"
            :key="lbl.text"
            :x="lbl.x" :y="lbl.y"
            :fill="C.inkMute"
            font-size="16"
            font-weight="600"
            font-family="Manrope, system-ui, sans-serif"
            text-anchor="middle"
            dominant-baseline="middle"
          >{{ lbl.text }}</text>
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
            font-size="13"
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

/* ── Wide-arc (half) ── */
.hmi-gauge-half-wrap {
  position: relative;
  text-align: center;
}
.hmi-gauge-svg--half {
  max-height: 160px;
}
.hmi-gauge-half-wrap__center {
  position: absolute;
  left: 0; right: 0;
  bottom: 8%;
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
