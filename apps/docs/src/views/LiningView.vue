<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { HmiGauge, HmiButton } from '@sandvik/core'

// ── Live clock ──
const clockTime = ref('')
const clockDate = ref('')
function updateClock() {
  const now = new Date()
  clockTime.value = now.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })
  clockDate.value = `${now.getDate()}.${now.getMonth() + 1}.`
}
let clockTimer: ReturnType<typeof setInterval>
onMounted(() => { updateClock(); clockTimer = setInterval(updateClock, 10000) })
onUnmounted(() => clearInterval(clockTimer))

// Angle readouts
const tiltLateral     = ref(+7.2)   // ° lateral
const tiltLongitudinal = ref(-14.0) // ° longitudinal

// Position
const positionM = ref(-0.7) // metres from tunnel centre

// Right sidebar gauges — driven by drilling power
const drillingPower      = ref(78)
const percussionPressure = computed(() => Math.round(1.50 * drillingPower.value))
const feedPressure       = computed(() => Math.round(1.45 * drillingPower.value + 5))
const flushPressure      = computed(() => Math.round(1.40 * drillingPower.value + 10))
const feedBar            = ref(8.4)
const flushLMin          = ref(15.8)

// Depth track (0–1)
const depthRatio = ref(0.42)

// Target depth
const targetDepth = ref(0)

// Active bottom-bar tool (0-indexed)
const activeTool = ref(2)

const bottomTools = [
  { label: 'Manual hold', icon: 'hand' },
  { label: 'Feed down',   icon: 'arrow-down' },
  { label: 'Feed up',     icon: 'arrow-up' },
  { label: 'Flush',       icon: 'flush' },
  { label: 'Rotation',    icon: 'rotation' },
]

// Tunnel viz: equipment rotation driven by lateral tilt
const equipRotation = computed(() => -35 + tiltLateral.value * 0.8)

// Scale label positions (SVG x coords for the horizontal scale)
const scaleMarks = [
  { x: 60,  label: '-1.5 m' },
  { x: 220, label: '-0.7 m', active: true },
  { x: 390, label: '0 m' },
  { x: 560, label: '+1.5 m' },
]
</script>

<template>
  <div class="ln-outer" role="region" aria-label="Lining view">
    <div class="hmi">

      <!-- ══ TOP BAR ══ -->
      <header class="topbar">
        <div class="topbar__left">
          <div class="op-card">
            <span class="op-card__lab">Operator</span>
            <span class="op-card__val op-card__val--muted">— —</span>
          </div>
        </div>
        <button class="menu-btn" aria-label="Open app grid">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">
            <rect x="3"  y="3"  width="6" height="6"/>
            <rect x="15" y="3"  width="6" height="6"/>
            <rect x="3"  y="15" width="6" height="6"/>
            <rect x="15" y="15" width="6" height="6"/>
          </svg>
        </button>
        <div class="topbar__right">
          <span class="top-pill top-pill--bell" aria-label="0 active alerts">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
            </svg>
          </span>
          <div class="clock" aria-live="polite" aria-label="Current time">
            <div class="clock__time">{{ clockTime }}</div>
            <div class="clock__date">{{ clockDate }}</div>
          </div>
        </div>
      </header>

      <!-- ══ CONTENT ══ -->
      <div class="content">

        <!-- LEFT: tunnel visualization -->
        <section class="viz-panel" aria-label="Tunnel visualization">

          <!-- Angle readouts -->
          <div class="angles" aria-label="Tilt angles">
            <div class="angle-item">
              <!-- lateral tilt icon -->
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false">
                <rect x="8" y="10" width="16" height="12" rx="2" transform="rotate(-10 16 16)"/>
                <line x1="16" y1="6" x2="16" y2="4"/>
                <line x1="16" y1="28" x2="16" y2="26"/>
              </svg>
              <span class="angle-val">{{ tiltLateral >= 0 ? '+' : '' }}{{ tiltLateral.toFixed(1) }}°</span>
            </div>
            <div class="angle-item">
              <!-- longitudinal tilt icon -->
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false">
                <rect x="7" y="11" width="18" height="11" rx="2" transform="rotate(-20 16 16)"/>
                <line x1="8" y1="8" x2="24" y2="24" stroke-dasharray="2 2"/>
              </svg>
              <span class="angle-val">{{ tiltLongitudinal >= 0 ? '+' : '' }}{{ tiltLongitudinal.toFixed(1) }}°</span>
            </div>
          </div>

          <!-- Tunnel SVG -->
          <div class="tunnel-wrap">
            <svg
              class="tunnel-svg"
              viewBox="0 0 700 480"
              aria-label="Drill position in tunnel cross-section"
              role="img"
            >
              <!-- tunnel cross-section arch -->
              <path
                d="M 70,460 L 70,240 A 280,240 0 0 1 630,240 L 630,460"
                fill="none"
                stroke="#3a444d"
                stroke-width="2"
              />

              <!-- vertical centre dotted line -->
              <line x1="350" y1="100" x2="350" y2="400" stroke="#3a444d" stroke-width="1.5" stroke-dasharray="5 5"/>

              <!-- drill rig — orange rectangle rotated by tilt -->
              <g :transform="`rotate(${equipRotation}, 350, 260)`">
                <!-- outer frame -->
                <rect x="255" y="155" width="190" height="210" rx="6" fill="#c04a10" stroke="#7a2a04" stroke-width="2"/>
                <!-- inner structural panels -->
                <rect x="267" y="167" width="166" height="186" rx="3" fill="#a03a08"/>
                <!-- vertical struts -->
                <line v-for="i in 5" :key="i" :x1="272 + i*28" y1="172" :x2="272 + i*28" y2="348" stroke="#7a2a04" stroke-width="2"/>
                <!-- horizontal brace -->
                <rect x="263" y="246" width="174" height="8" fill="#8a3006" rx="1"/>
                <!-- side arm left -->
                <rect x="220" y="230" width="40" height="14" rx="3" fill="#b04010"/>
                <!-- side arm right -->
                <rect x="440" y="230" width="40" height="14" rx="3" fill="#b04010"/>
              </g>

              <!-- position indicator line (blue, from centre to scale) -->
              <line
                :x1="350 + (positionM / 1.5) * 280"
                y1="300"
                :x2="350 + (positionM / 1.5) * 280"
                y2="420"
                stroke="#1f8fe6"
                stroke-width="2.5"
              />

              <!-- status circles on drill rig corners (after rotation so they appear fixed) -->
              <!-- top-left: allow (blue) -->
              <g :transform="`rotate(${equipRotation}, 350, 260)`">
                <circle cx="270" cy="175" r="28" fill="none" stroke="#fff" stroke-width="3"/>
                <circle cx="270" cy="175" r="24" fill="#e3f2fd" stroke="#1565c0" stroke-width="4"/>
                <!-- top-right: deny (red) -->
                <circle cx="430" cy="175" r="28" fill="none" stroke="#fff" stroke-width="3"/>
                <circle cx="430" cy="175" r="24" fill="#ffebee" stroke="#c62828" stroke-width="4"/>
                <line x1="413" y1="158" x2="447" y2="192" stroke="#c62828" stroke-width="3.5" stroke-linecap="round"/>
                <!-- bottom-left: deny (red) -->
                <circle cx="270" cy="345" r="28" fill="none" stroke="#fff" stroke-width="3"/>
                <circle cx="270" cy="345" r="24" fill="#ffebee" stroke="#c62828" stroke-width="4"/>
                <line x1="253" y1="328" x2="287" y2="362" stroke="#c62828" stroke-width="3.5" stroke-linecap="round"/>
                <!-- bottom-right: allow (blue) -->
                <circle cx="430" cy="345" r="28" fill="none" stroke="#fff" stroke-width="3"/>
                <circle cx="430" cy="345" r="24" fill="#e3f2fd" stroke="#1565c0" stroke-width="4"/>
              </g>

              <!-- horizontal scale line -->
              <line x1="60" y1="426" x2="640" y2="426" stroke="#5e6770" stroke-width="1.5"/>
              <line x1="60"  y1="418" x2="60"  y2="434" stroke="#5e6770" stroke-width="1.5"/>
              <line x1="350" y1="418" x2="350" y2="434" stroke="#5e6770" stroke-width="1.5"/>
              <line x1="640" y1="418" x2="640" y2="434" stroke="#5e6770" stroke-width="1.5"/>
              <line x1="205" y1="420" x2="205" y2="432" stroke="#5e6770" stroke-width="1"/>
              <line x1="495" y1="420" x2="495" y2="432" stroke="#5e6770" stroke-width="1"/>

              <!-- scale labels -->
              <text x="60"  y="452" text-anchor="middle" font-family="Manrope,sans-serif" font-size="18" fill="#8d97a1">-1.5 m</text>
              <text x="350" y="452" text-anchor="middle" font-family="Manrope,sans-serif" font-size="18" fill="#8d97a1">0 m</text>
              <text x="640" y="452" text-anchor="middle" font-family="Manrope,sans-serif" font-size="18" fill="#8d97a1">+1.5 m</text>

              <!-- active position badge -->
              <rect
                :x="350 + (positionM / 1.5) * 280 - 46"
                y="436"
                width="92"
                height="32"
                rx="4"
                fill="#2a323a"
                stroke="#4a555f"
                stroke-width="1"
              />
              <text
                :x="350 + (positionM / 1.5) * 280"
                y="458"
                text-anchor="middle"
                font-family="Manrope,sans-serif"
                font-size="18"
                font-weight="700"
                fill="#f1f4f7"
              >{{ positionM >= 0 ? '+' : '' }}{{ positionM.toFixed(1) }} m</text>
            </svg>
          </div>
          <!-- ══ BOTTOM TOOLBAR ══ -->
          <footer class="toolbar" aria-label="Drill controls">
            <div class="toolbar__tools">
              <button
                v-for="(tool, i) in bottomTools"
                :key="tool.label"
                :class="['tool-btn', { 'tool-btn--active': activeTool === i }]"
                :aria-label="tool.label"
                :aria-pressed="activeTool === i"
                @click="activeTool = i"
              >
                <!-- hand -->
                <svg v-if="tool.icon === 'hand'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8H10a8 8 0 0 1-7.93-7H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1"/>
                </svg>
                <!-- arrow-down -->
                <svg v-else-if="tool.icon === 'arrow-down'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                  <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                </svg>
                <!-- arrow-up -->
                <svg v-else-if="tool.icon === 'arrow-up'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                  <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                </svg>
                <!-- flush -->
                <svg v-else-if="tool.icon === 'flush'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                  <path d="M5 8h14M5 12h14M5 16h14"/>
                  <polyline points="19 6 22 12 19 18"/>
                </svg>
                <!-- rotation -->
                <svg v-else-if="tool.icon === 'rotation'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false">
                  <circle cx="12" cy="12" r="8"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>
              </button>
            </div>

            <div class="toolbar__depth">
              <label class="depth-label" for="targetDepth">Target depth</label>
              <input
                id="targetDepth"
                v-model.number="targetDepth"
                type="number"
                class="depth-input"
                min="0"
                step="0.1"
                aria-label="Target depth in metres"
              />
              <span class="depth-unit">m</span>
            </div>

            <HmiButton variant="primary" @click="() => {}">Start Drilling</HmiButton>
          </footer>
        </section>

        <!-- CENTER: vertical depth track -->
        <div class="depth-track" aria-label="Penetration depth indicator">
          <div class="depth-track__rail">
            <div class="depth-track__fill" :style="{ height: `${depthRatio * 100}%` }"/>
            <div class="depth-track__thumb" :style="{ top: `${depthRatio * 100}%` }"/>
            <div class="depth-track__marker"/>
          </div>
        </div>

        <!-- RIGHT: sidebar gauges + levels -->
        <aside class="sidebar" aria-label="Pressure and flow readouts">
          <div class="sidebar__header">
            <span class="sidebar__title">Contour</span>
            <span class="sidebar__sub">Waste</span>
          </div>

          <!-- Gauge 1: percussion 82 bar + 42 RPM -->
          <div class="gauge-wrap">
            <HmiGauge
              type="full"
              :value="percussionPressure"
              :max="150"
              unit="bar"
              label="Percussion pressure"
              :red-zone="0.18"
              :warn-zone="{ from: 100/150, to: 125/150 }"
            />
            <div class="gauge-sub" aria-label="42 RPM">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              <span class="gauge-sub__val">42</span>
              <span class="gauge-sub__unit">RPM</span>
            </div>
          </div>

          <!-- Gauge 2: feed 79 bar -->
          <div class="gauge-wrap">
            <HmiGauge
              type="full"
              :value="feedPressure"
              :max="150"
              unit="bar"
              label="Feed pressure"
              :red-zone="0.18"
            />
            <div class="gauge-sub" aria-label="Feed">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>
          </div>

          <!-- Gauge 3: flush 79 bar -->
          <div class="gauge-wrap">
            <HmiGauge
              type="full"
              :value="flushPressure"
              :max="150"
              unit="bar"
              label="Flush pressure"
              :red-zone="0.18"
            />
            <div class="gauge-sub" aria-label="Flush">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z"/>
              </svg>
            </div>
          </div>

          <!-- Drilling power -->
          <div class="level-row" :aria-label="`Drilling power ${drillingPower} percent`">
            <span class="level-row__label">Drilling power</span>
            <div class="level-row__track">
              <div class="level-row__fill" :style="{ width: `${drillingPower}%` }"/>
              <div class="level-row__needle" :style="{ left: `${drillingPower}%` }"/>
              <input
                type="range"
                class="level-row__range"
                v-model.number="drillingPower"
                min="0" max="100" step="1"
                aria-label="Drilling power"
              />
            </div>
            <span class="level-row__val">{{ drillingPower }}<span class="level-row__unit">%</span></span>
          </div>

          <!-- Feed bar -->
          <div class="level-row" aria-label="Feed 8.4 bar">
            <svg width="20" height="14" viewBox="0 0 24 14" fill="none" stroke="var(--hmi-ink-2)" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false">
              <path d="M2 7 Q6 2 12 7 Q18 12 22 7"/>
            </svg>
            <div class="level-row__track">
              <div class="level-row__fill" :style="{ width: `${(feedBar / 20) * 100}%` }"/>
            </div>
            <span class="level-row__val">{{ feedBar }}<span class="level-row__unit">bar</span></span>
          </div>

          <!-- Flush l/min -->
          <div class="level-row" aria-label="Flush 15.8 litres per minute">
            <svg width="20" height="14" viewBox="0 0 24 14" fill="none" stroke="var(--hmi-ink-2)" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false">
              <line x1="2" y1="4"  x2="22" y2="4"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            <div class="level-row__track level-row__track--orange">
              <div class="level-row__fill level-row__fill--orange" :style="{ width: `${(flushLMin / 30) * 100}%` }"/>
            </div>
            <span class="level-row__val">{{ flushLMin }}<span class="level-row__unit">l/min</span></span>
          </div>
        </aside>
      </div>

    </div>
  </div>
</template>

<style scoped>
.ln-outer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 57px);
  background: #000;
  padding: 24px;
}

.hmi {
  width: 1024px;
  height: 768px;
  background: var(--hmi-bg);
  display: grid;
  grid-template-rows: 56px 1fr;
  overflow: hidden;
  flex-shrink: 0;
}

/* ── Top bar (same as TrDiesel) ── */
.topbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 6px 10px;
  gap: 12px;
  background: var(--hmi-surface-1);
  border-bottom: 1px solid var(--hmi-border-soft);
}
.topbar__left  { display: flex; align-items: center; }
.topbar__right { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }

.op-card {
  width: 156px; height: 44px;
  padding: 4px 10px;
  background: var(--hmi-surface-2);
  border: 1px solid var(--hmi-surface-4);
  border-radius: var(--hmi-r-2);
  display: flex; flex-direction: column; justify-content: center;
  line-height: 1.1;
}
.op-card__lab { font-family: var(--hmi-mono); font-size: 10px; letter-spacing: 0.12em; color: var(--hmi-ink-3); text-transform: uppercase; }
.op-card__val { font-size: 14px; color: var(--hmi-ink-1); font-weight: 600; margin-top: 2px; }
.op-card__val--muted { color: var(--hmi-ink-4); }

.menu-btn {
  width: 64px; height: 44px;
  background: var(--hmi-surface-2);
  border: 1px solid var(--hmi-surface-4);
  color: var(--hmi-ink-1);
  border-radius: var(--hmi-r-2);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.top-pill--bell {
  width: 44px; height: 44px;
  border-radius: var(--hmi-r-2);
  background: var(--hmi-surface-0);
  border: 1px solid var(--hmi-border-soft);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--hmi-ink-2);
}
.clock { text-align: right; font-family: var(--hmi-mono); line-height: 1; padding-left: 4px; }
.clock__time { font-size: 22px; font-weight: 700; color: var(--hmi-ink-1); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.clock__date { font-size: 11px; color: var(--hmi-ink-3); margin-top: 4px; letter-spacing: 0.05em; }

/* ── Content ── */
.content {
  display: grid;
  grid-template-columns: 1fr 22px 266px;
  overflow: hidden;
}

/* ── Viz panel ── */
.viz-panel {
  display: flex;
  flex-direction: column;
  padding: 12px 12px 0;
  border-right: 1px solid var(--hmi-border-soft);
}

.angles {
  display: flex;
  gap: 48px;
  justify-content: center;
  margin-bottom: 4px;
  padding-top: 20px;
}
.angle-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--hmi-ink-1);
}
.angle-val {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--hmi-ink-1);
}

.tunnel-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tunnel-svg {
  width: 100%;
  height: 100%;
  max-height: 480px;
}

/* ── Depth track ── */
.depth-track {
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 12px 0;
  background: var(--hmi-surface-0);
  border-right: 1px solid var(--hmi-border-soft);
}
.depth-track__rail {
  width: 10px;
  background: var(--hmi-surface-3);
  border-radius: 5px;
  position: relative;
  flex: 1;
  margin: 8px 6px;
}
.depth-track__fill {
  position: absolute;
  top: 0; left: 0; right: 0;
  background: var(--hmi-blue-600);
  border-radius: 5px;
  transition: height 0.3s;
}
.depth-track__thumb {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px; height: 24px;
  background: var(--hmi-ink-1);
  border-radius: 3px;
  transition: top 0.3s;
}
.depth-track__marker {
  position: absolute;
  bottom: 20%;
  left: -4px; right: -4px;
  height: 4px;
  background: var(--hmi-orange-500);
  border-radius: 2px;
}

/* ── Right sidebar ── */
.sidebar {
  background: var(--hmi-surface-0);
  display: flex;
  flex-direction: column;
  padding: 10px 10px 6px;
  gap: 4px;
  overflow: hidden;
}
.sidebar__header {
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
  border-bottom: 1px solid var(--hmi-border-soft);
  padding-bottom: 6px;
}
.sidebar__title { font-size: 14px; font-weight: 600; color: var(--hmi-ink-1); }
.sidebar__sub   { font-size: 12px; color: var(--hmi-ink-3); margin-top: 1px; }

.gauge-wrap {
  flex: 1;
  min-height: 0;
}
.gauge-wrap :deep(.hmi-gauge-card) {
  background: transparent;
  border: none;
  padding: 0;
  gap: 0;
}
.gauge-wrap :deep(.hmi-gauge-card__title) { display: none; }
.gauge-wrap :deep(.hmi-gauge-svg)         { max-height: 190px; }
.gauge-wrap :deep(.hmi-gauge__value--full){ font-size: 32px; }
.gauge-wrap :deep(.hmi-gauge__unit)       { font-size: 11px; margin-top: 2px; }
.gauge-wrap :deep(.hmi-gauge-full-wrap__center) { top: 56%; }

.gauge-sub {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--hmi-ink-2);
  font-size: 13px;
  margin-top: -44px;
  height: 22px;
}
.gauge-sub__val  { font-weight: 700; font-size: 16px; color: var(--hmi-ink-1); font-variant-numeric: tabular-nums; }
.gauge-sub__unit { font-family: var(--hmi-mono); font-size: 11px; color: var(--hmi-ink-3); letter-spacing: 0.06em; }

/* level bars */
.level-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
  flex-shrink: 0;
}
.level-row__label {
  font-size: 11px;
  color: var(--hmi-ink-3);
  white-space: nowrap;
  min-width: 82px;
  font-family: var(--hmi-mono);
  letter-spacing: 0.03em;
}
.level-row__track {
  flex: 1;
  height: 7px;
  background: #586168;
  border-radius: 2px;
  position: relative;
  overflow: visible;
}
.level-row__fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  background: linear-gradient(90deg, var(--hmi-blue-600), var(--hmi-blue-300));
  border-radius: 2px;
}
.level-row__fill--orange {
  background: linear-gradient(90deg, var(--hmi-orange-600), var(--hmi-orange-300));
}
.level-row__track--orange { background: #586168; }
.level-row__needle {
  position: absolute;
  top: -5px; width: 2px; height: 17px;
  background: var(--hmi-blue-100);
  transform: translateX(-50%);
}
.level-row__range {
  position: absolute;
  inset: -10px 0;
  width: 100%;
  height: calc(100% + 20px);
  opacity: 0;
  cursor: pointer;
  margin: 0;
}
.level-row__val  { font-family: var(--hmi-mono); font-size: 13px; font-weight: 600; color: var(--hmi-ink-1); white-space: nowrap; min-width: 48px; text-align: right; }
.level-row__unit { font-size: 10px; color: var(--hmi-ink-3); margin-left: 2px; font-weight: 400; }

/* ── Bottom toolbar ── */
.toolbar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--hmi-surface-1);
  border-top: 1px solid var(--hmi-border-soft);
}
.toolbar__tools {
  display: flex;
  gap: 6px;
}
.tool-btn {
  width: 56px; height: 56px;
  background: var(--hmi-surface-2);
  border: 1px solid var(--hmi-surface-4);
  border-radius: var(--hmi-r-2);
  color: var(--hmi-ink-2);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.tool-btn:hover { background: var(--hmi-surface-3); color: var(--hmi-ink-1); }
.tool-btn--active {
  background: linear-gradient(180deg, var(--hmi-blue-600) 0%, #0f6aaf 100%);
  border-color: var(--hmi-blue-700);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18);
}
.tool-btn:focus-visible {
  outline: 2px solid var(--hmi-blue-300);
  outline-offset: 3px;
}

.toolbar__depth {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}
.depth-label {
  font-size: 15px;
  color: var(--hmi-ink-2);
  font-weight: 500;
}
.depth-input {
  width: 96px;
  height: 44px;
  background: var(--hmi-surface-2);
  border: 1px solid var(--hmi-surface-4);
  border-radius: var(--hmi-r-2);
  color: var(--hmi-ink-1);
  font-family: var(--hmi-font);
  font-size: 18px;
  font-weight: 600;
  text-align: left;
  font-variant-numeric: tabular-nums;
  padding: 0 8px 0 12px;
}
.depth-input:focus { outline: 2px solid var(--hmi-blue-300); outline-offset: 2px; }
.depth-unit { font-size: 15px; color: var(--hmi-ink-3); }
</style>
