<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { HmiGauge } from '@sandvik/core'

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

// ── Gauge values ──
const fuelRatio  = ref(0.56)  // 0..1
const speedValue = ref(8.5)
const speedMax   = 15

// ── Engine segments ──
const engineSegments = 18
const engineLoad = ref(10) // filled segments

// ── Stats ──
const stats = ref([
  { label: 'Hydraulic pressure', value: 8,  unit: 'bar', trend: 0 },
  { label: 'Coolant temp',       value: 82, unit: '°C',  trend: 1 },
  { label: 'Transmission temp',  value: 76, unit: '°C',  trend: 1 },
  { label: 'Intake temp',        value: 32, unit: '°C',  trend: -1 },
])

</script>

<template>
  <div class="tr-outer" aria-label="Tramming view, diesel mode" role="region">
    <div class="hmi">

      <!-- ══ TOP BAR ══ -->
      <header class="topbar">
        <div class="topbar__left">
          <div class="op-card" aria-label="Active operator">
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
          <span class="top-pill" aria-label="Parking brake engaged">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="9"/>
              <path d="M9 17V7h4.2a2.8 2.8 0 0 1 0 5.6H9" stroke-linejoin="round"/>
            </svg>
          </span>
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

      <!-- ══ MAIN ══ -->
      <section class="main" aria-label="Main gauges">

        <!-- LEFT: fuel -->
        <div class="gauge-block">
          <HmiGauge
            type="full"
            :value="fuelRatio"
            :max="1"
            label="Fuel"
            unit=""
            :red-zone="0.09"
          >
            <template #center>
              <svg
                width="40" height="40" viewBox="0 0 24 24"
                fill="none" stroke="var(--hmi-ink-1)" stroke-width="1.6"
                stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true" focusable="false"
              >
                <path d="M3 22V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v18"/>
                <path d="M3 22h11"/>
                <path d="M14 9h2a2 2 0 0 1 2 2v7a2 2 0 0 0 4 0v-9l-3-3"/>
              </svg>
            </template>
          </HmiGauge>
        </div>

        <!-- CENTER: direction + engine bar -->
        <div class="center-col">
          <div class="direction-card" aria-label="Drive direction: forward, parking brake engaged">
            <!-- brake indicator -->
            <span class="brake-ind" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <circle cx="12" cy="12" r="9"/>
                <line x1="5" y1="5" x2="19" y2="19" stroke-linecap="round"/>
              </svg>
            </span>
            <!-- direction chevron -->
            <div class="dir-pill" aria-hidden="true">
              <span class="dir-arrow">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="16,4 16,20 4,12"/></svg>
              </span>
              <span class="dir-chev">
                <svg width="36" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="4,4 14,4 22,12 14,20 4,20 12,12"/>
                </svg>
              </span>
              <span class="dir-arrow" style="visibility:hidden">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="8,4 8,20 20,12"/></svg>
              </span>
            </div>
          </div>

          <div class="engine-bar" aria-label="Engine load 60 percent">
            <span class="engine-bar__ico" aria-hidden="true">
              <svg width="34" height="28" viewBox="0 0 40 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 18V12h4l3-4h8l3 4h4l4 3v3l-4 3h-4l-3 4h-8l-3-4H4z"/>
                <circle cx="14" cy="15" r="1.2" fill="currentColor"/>
              </svg>
            </span>
            <div class="engine-bar__segs">
              <span
                v-for="i in engineSegments"
                :key="i"
                :class="['engine-seg', i === 1 ? 'engine-seg--crit' : i <= engineLoad ? 'engine-seg--on' : '']"
              />
            </div>
          </div>
        </div>

        <!-- RIGHT: speed + RPM -->
        <div class="gauge-block">
          <HmiGauge
            type="full"
            :value="speedValue"
            :max="speedMax"
            label="Speed"
            unit="km/h"
            :red-zone="0.11"
          />
          <div class="rpm-readout" aria-label="Engine 1230 rpm">
            <div class="rpm-readout__n">1230</div>
            <div class="rpm-readout__u">RPM</div>
          </div>
        </div>

      </section>

      <!-- ══ BOTTOM ══ -->
      <footer class="bottom">

        <!-- vehicle silhouette -->
        <div class="vehicle-card" aria-label="Vehicle status: parking brakes engaged on both axles at 80 bar">
          <svg class="vehicle-svg" viewBox="0 0 540 186" aria-hidden="true">
            <defs>
              <pattern id="stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="#1a2026"/>
                <line x1="0" y1="0" x2="0" y2="8" stroke="#252d34" stroke-width="3"/>
              </pattern>
            </defs>
            <!-- rear cabin -->
            <rect x="20"  y="48" width="170" height="56" rx="6" fill="url(#stripes)" stroke="#3a444d" stroke-width="1"/>
            <rect x="32"  y="56" width="40"  height="16" rx="2" fill="#0e1216" stroke="#3a444d" stroke-width="1"/>
            <rect x="80"  y="56" width="100" height="10" rx="2" fill="#0e1216" stroke="#3a444d" stroke-width="1"/>
            <rect x="80"  y="72" width="100" height="6"  rx="1" fill="#0e1216" stroke="#3a444d" stroke-width="1"/>
            <rect x="80"  y="84" width="100" height="6"  rx="1" fill="#0e1216" stroke="#3a444d" stroke-width="1"/>
            <!-- articulation joint -->
            <rect x="190" y="64" width="40" height="32" fill="url(#stripes)" stroke="#3a444d" stroke-width="1"/>
            <line x1="210" y1="48" x2="210" y2="112" stroke="#5e6770" stroke-width="2" stroke-dasharray="4 3"/>
            <!-- front boom carrier -->
            <rect x="230" y="36" width="180" height="68" rx="6" fill="url(#stripes)" stroke="#3a444d" stroke-width="1"/>
            <!-- drill boom -->
            <rect x="350" y="20" width="160" height="36" rx="10" fill="#0e1216" stroke="#3a444d" stroke-width="1.5"/>
            <circle cx="510" cy="38" r="6" fill="#1f262d" stroke="#3a444d"/>
            <rect x="420" y="56" width="80" height="14" rx="3" fill="#0e1216" stroke="#3a444d"/>
            <!-- wheels: rear -->
            <circle cx="110" cy="120" r="26" fill="#0a0d10" stroke="#3a444d" stroke-width="2"/>
            <circle cx="110" cy="120" r="18" fill="#161b20" stroke="#4a555f" stroke-width="1.5"/>
            <!-- wheels: front -->
            <circle cx="300" cy="120" r="26" fill="#0a0d10" stroke="#3a444d" stroke-width="2"/>
            <circle cx="300" cy="120" r="18" fill="#161b20" stroke="#4a555f" stroke-width="1.5"/>
            <!-- P brake glyphs -->
            <circle cx="110" cy="120" r="14" fill="none" stroke="#f1f4f7" stroke-width="2"/>
            <text x="110" y="126" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="700" font-size="16" fill="#f1f4f7">P</text>
            <circle cx="300" cy="120" r="14" fill="none" stroke="#f1f4f7" stroke-width="2"/>
            <text x="300" y="126" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="700" font-size="16" fill="#f1f4f7">P</text>
            <!-- light marker -->
            <rect x="40" y="40" width="14" height="8" rx="1" fill="#1f262d" stroke="#3a444d"/>
            <!-- axle labels — centred on wheel x coordinates -->
            <text x="110" y="170" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="700" font-size="20" fill="#f1f4f7" font-variant-numeric="tabular-nums">80</text>
            <text x="136" y="170" text-anchor="start"  font-family="Manrope, sans-serif" font-weight="500" font-size="13" fill="#8d97a1" letter-spacing="1">bar</text>
            <text x="300" y="170" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="700" font-size="20" fill="#f1f4f7" font-variant-numeric="tabular-nums">80</text>
            <text x="326" y="170" text-anchor="start"  font-family="Manrope, sans-serif" font-weight="500" font-size="13" fill="#8d97a1" letter-spacing="1">bar</text>
          </svg>
        </div>

        <!-- stats grid -->
        <div class="stats-card">
          <div class="stats-grid">
            <!-- hydraulic pressure -->
            <div class="stat" v-for="s in stats" :key="s.label" :aria-label="`${s.label}: ${s.value} ${s.unit}`">
              <span class="stat__ic" aria-hidden="true">
                <svg v-if="s.label === 'Hydraulic pressure'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 3c-3 4-6 7-6 11a6 6 0 0 0 12 0c0-4-3-7-6-11z"/>
                  <path d="M18 8v6M18 14l-2-2M18 14l2-2"/>
                </svg>
                <svg v-else-if="s.label === 'Coolant temp'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0z"/>
                  <line x1="12" y1="9" x2="12" y2="14"/>
                </svg>
                <svg v-else-if="s.label === 'Transmission temp'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="5" y="3" width="6" height="18" rx="1"/>
                  <line x1="5" y1="8"  x2="11" y2="8"/>
                  <line x1="5" y1="13" x2="11" y2="13"/>
                  <line x1="5" y1="18" x2="11" y2="18"/>
                  <path d="M16 14V5a2 2 0 1 1 4 0v9a3.2 3.2 0 1 1-4 0z"/>
                </svg>
                <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 14V5a2 2 0 1 1 4 0v9a3.2 3.2 0 1 1-4 0z"/>
                  <line x1="16" y1="9" x2="16" y2="14"/>
                  <line x1="3" y1="9" x2="11" y2="9"/>
                  <polyline points="8 5 11 9 8 13"/>
                </svg>
              </span>
              <span class="stat__val">{{ s.value }}<span class="stat__unit">{{ s.unit }}</span></span>
              <span
                :class="['stat__trend', s.trend > 0 ? 'stat__trend--up' : s.trend < 0 ? 'stat__trend--dn' : '']"
                :aria-label="s.trend > 0 ? 'rising' : s.trend < 0 ? 'falling' : 'stable'"
              >
                <svg v-if="s.trend > 0" width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="7" y1="18" x2="7" y2="4"/><polyline points="2 9 7 4 12 9"/>
                </svg>
                <svg v-else-if="s.trend < 0" width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="7" y1="2" x2="7" y2="16"/><polyline points="2 11 7 16 12 11"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

      </footer>
    </div>
  </div>
</template>

<style scoped>
.tr-outer {
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
  grid-template-rows: 56px 1fr 220px;
  overflow: hidden;
  flex-shrink: 0;
}

/* ── Top bar ── */
.topbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 6px 10px;
  gap: 12px;
  background: var(--hmi-surface-1);
  border-bottom: 1px solid var(--hmi-border-soft);
}
.topbar__left { display: flex; align-items: center; gap: 10px; }
.topbar__right { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }

.op-card {
  width: 156px;
  height: 44px;
  padding: 4px 10px;
  background: var(--hmi-surface-2);
  border: 1px solid var(--hmi-surface-4);
  border-radius: var(--hmi-r-2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.1;
}
.op-card__lab {
  font-family: var(--hmi-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--hmi-ink-3);
  text-transform: uppercase;
}
.op-card__val { font-size: 14px; color: var(--hmi-ink-1); font-weight: 600; margin-top: 2px; }
.op-card__val--muted { color: var(--hmi-ink-4); }

.menu-btn {
  width: 64px;
  height: 44px;
  background: var(--hmi-surface-2);
  border: 1px solid var(--hmi-surface-4);
  color: var(--hmi-ink-1);
  border-radius: var(--hmi-r-2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.top-pill {
  width: 44px;
  height: 44px;
  border-radius: var(--hmi-r-2);
  background: var(--hmi-surface-0);
  border: 1px solid var(--hmi-border-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--hmi-blue-300);
}
.top-pill--bell { color: var(--hmi-ink-2); }

.clock { text-align: right; font-family: var(--hmi-mono); line-height: 1; padding-left: 4px; }
.clock__time {
  font-size: 22px;
  font-weight: 700;
  color: var(--hmi-ink-1);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}
.clock__date { font-size: 11px; color: var(--hmi-ink-3); margin-top: 4px; letter-spacing: 0.05em; }

/* ── Main ── */
.main {
  padding: 56px 14px 0;
  display: grid;
  grid-template-columns: 1fr 240px 1fr;
  gap: 12px;
  align-items: start;
}

.gauge-block {
  position: relative;
  text-align: center;
}

/* Override HmiGauge card styling for the HMI view */
.gauge-block :deep(.hmi-gauge-card) {
  background: transparent;
  border: none;
  padding: 0;
}
.gauge-block :deep(.hmi-gauge-card__title) { display: none; }
.gauge-block :deep(.hmi-gauge__value--full) { font-size: 48px; }
.gauge-block :deep(.hmi-gauge__unit) { font-size: 13px; letter-spacing: 0.1em; }

.rpm-readout {
  text-align: center;
  margin-top: -56px;
}
.rpm-readout__n {
  font-size: 36px;
  font-weight: 800;
  color: var(--hmi-ink-1);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.rpm-readout__u {
  font-family: var(--hmi-mono);
  font-size: 13px;
  color: var(--hmi-ink-3);
  letter-spacing: 0.08em;
  margin-top: 2px;
}

/* ── Center column ── */
.center-col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
  padding-top: 22px;
}

.direction-card {
  background: var(--hmi-surface-0);
  border: 1px solid var(--hmi-border-soft);
  border-radius: var(--hmi-r-3);
  padding: 12px;
  height: 132px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.brake-ind {
  position: absolute;
  top: 10px; right: 10px;
  width: 32px; height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--hmi-ink-2);
}
.dir-pill { display: flex; align-items: center; }
.dir-arrow {
  width: 38px; height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--hmi-ink-4);
}
.dir-chev {
  width: 78px; height: 56px;
  background: var(--hmi-blue-500);
  clip-path: polygon(0 50%, 18% 0, 82% 0, 100% 50%, 82% 100%, 18% 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.engine-bar {
  background: var(--hmi-surface-0);
  border: 1px solid var(--hmi-border-soft);
  border-radius: var(--hmi-r-3);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
}
.engine-bar__ico { width: 34px; height: 30px; color: var(--hmi-ink-1); flex-shrink: 0; }
.engine-bar__segs { display: flex; gap: 2px; flex: 1; }
.engine-seg {
  flex: 1;
  height: 18px;
  background: #586168;
  border-radius: 1px;
}
.engine-seg--on   { background: var(--hmi-ink-1); }
.engine-seg--crit { background: var(--hmi-orange-500); }

/* ── Bottom ── */
.bottom {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 6px;
  padding: 6px 8px 8px;
}

.vehicle-card,
.stats-card {
  background: var(--hmi-surface-0);
  border: 1px solid var(--hmi-border-soft);
  border-radius: var(--hmi-r-3);
  padding: 14px 18px;
}

.vehicle-svg {
  width: 100%;
  height: 150px;
  display: block;
}

.stats-grid {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
  height: 100%;
}
.stat {
  display: grid;
  grid-template-columns: 36px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 0 4px;
}
.stat__ic { color: var(--hmi-ink-1); display: inline-flex; align-items: center; justify-content: center; }
.stat__val {
  font-size: 22px;
  font-weight: 700;
  color: var(--hmi-ink-1);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}
.stat__unit {
  font-family: var(--hmi-mono);
  font-size: 12px;
  color: var(--hmi-ink-3);
  font-weight: 500;
  margin-left: 4px;
  letter-spacing: 0.06em;
}
.stat__trend { width: 18px; height: 24px; display: inline-flex; align-items: center; justify-content: center; color: var(--hmi-ink-1); }
</style>
