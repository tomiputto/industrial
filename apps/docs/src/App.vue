<script setup lang="ts">
import { ref } from 'vue'
import {
  HmiButton,
  HmiIconButton,
  HmiTabSwitch,
  HmiBadge,
  HmiStatusMark,
  HmiGauge,
  HmiLevelBar,
  HmiSegBar,
  HmiPanel,
  type TabOption,
} from '@sandvik/core'

const activeMode = ref('drilling')
const modeTabs: TabOption[] = [
  { value: 'drilling', label: 'Drilling' },
  { value: 'finishing', label: 'Finishing' },
]

// Interactive gauge demo
const speedValue = ref(8.5)
const pressureValue = ref(82)
const rpmValue = ref(42)
const flowValue = ref(79)

// Level bar demo
const drillingPower = ref(78)
const feedPressure = ref(42)
const flowRate = ref(64)
</script>

<template>
  <main id="main" class="page">

    <!-- ═══ MASTHEAD ═══ -->
    <header class="masthead">
      <div>
        <span class="eyebrow">Foundation · v0.2 · WCAG 2.2 AA · Vue 3</span>
        <h1>Industrial HMI<br />Design System</h1>
        <p>
          A foundation for high-contrast, touch-first operator interfaces for heavy mobile equipment.
          Built for legibility in low light, gloves, and fast glances.
          <strong>v0.2</strong> applies WCAG 2.2 AA remediation.
        </p>
      </div>
      <div class="meta">
        DARK THEME &nbsp;<span class="dot">●</span><br />
        ACCENT BLUE &nbsp;<span class="dot">●</span><br />
        ACCENT ORANGE &nbsp;<span class="dot dot--orange">●</span><br />
        TOUCH · 1024×768
      </div>
    </header>

    <!-- ═══ 01 COLOR ═══ -->
    <section id="color">
      <div class="section-head">
        <div class="section-label">01 · Color</div>
        <h2>Color tokens <span class="sub">surfaces, ink, brand accents, semantic</span></h2>
      </div>
      <div class="section-body">

        <div class="stack">

          <div>
            <div class="t-label">Surfaces — deep neutrals for cab displays</div>
            <div class="ramp">
              <div class="ramp-step" style="background:#07090b"><span class="ramp-key">bg</span><div>#07090B</div></div>
              <div class="ramp-step" style="background:#0e1216"><span class="ramp-key">surface/0</span><div>#0E1216</div></div>
              <div class="ramp-step" style="background:#161b20"><span class="ramp-key">surface/1</span><div>#161B20</div></div>
              <div class="ramp-step" style="background:#1f262d"><span class="ramp-key">surface/2</span><div>#1F262D</div></div>
              <div class="ramp-step" style="background:#2a323a"><span class="ramp-key">surface/3</span><div>#2A323A</div></div>
            </div>
          </div>

          <div>
            <div class="t-label">Ink — text on dark</div>
            <div class="ramp">
              <div class="ramp-step" style="background:#f1f4f7;color:#0e1216"><span class="ramp-key" style="opacity:.6">ink/1</span><div>#F1F4F7</div></div>
              <div class="ramp-step" style="background:#c4cdd5;color:#0e1216"><span class="ramp-key" style="opacity:.6">ink/2</span><div>#C4CDD5</div></div>
              <div class="ramp-step" style="background:#8d97a1;color:#0e1216"><span class="ramp-key" style="opacity:.6">ink/3</span><div>#8D97A1</div></div>
              <div class="ramp-step" style="background:#5e6770"><span class="ramp-key">ink/4</span><div>#5E6770</div></div>
              <div class="ramp-step" style="background:#3d454d"><span class="ramp-key">ink/5</span><div>#3D454D</div></div>
            </div>
          </div>

          <div class="grid cols-2">
            <div>
              <div class="t-label">Accent — Blue</div>
              <div class="ramp">
                <div class="ramp-step" style="background:#cfe6fb;color:#0d5897"><span class="ramp-key" style="opacity:.6">blue/100</span><div>#CFE6FB</div></div>
                <div class="ramp-step" style="background:#6bb5ee;color:#0d5897"><span class="ramp-key" style="opacity:.6">blue/300</span><div>#6BB5EE</div></div>
                <div class="ramp-step" style="background:#1f8fe6"><span class="ramp-key">blue/500</span><div>#1F8FE6</div></div>
                <div class="ramp-step" style="background:#1474c4"><span class="ramp-key">blue/600</span><div>#1474C4</div></div>
                <div class="ramp-step" style="background:#0d5897"><span class="ramp-key">blue/700</span><div>#0D5897</div></div>
              </div>
            </div>
            <div>
              <div class="t-label">Accent — Orange</div>
              <div class="ramp">
                <div class="ramp-step" style="background:#ffd6b8;color:#993c0a"><span class="ramp-key" style="opacity:.6">orange/100</span><div>#FFD6B8</div></div>
                <div class="ramp-step" style="background:#ff9a5a;color:#993c0a"><span class="ramp-key" style="opacity:.6">orange/300</span><div>#FF9A5A</div></div>
                <div class="ramp-step" style="background:#f26a1a"><span class="ramp-key">orange/500</span><div>#F26A1A</div></div>
                <div class="ramp-step" style="background:#cc5210"><span class="ramp-key">orange/600</span><div>#CC5210</div></div>
                <div class="ramp-step" style="background:#993c0a"><span class="ramp-key">orange/700</span><div>#993C0A</div></div>
              </div>
            </div>
          </div>

          <div>
            <div class="t-label">Semantic</div>
            <div class="grid cols-4">
              <div class="swatch"><div class="swatch-chip" style="background:#3aa66b"></div><div class="swatch-meta"><div class="swatch-name">ok</div><div class="swatch-hex">#3AA66B</div></div></div>
              <div class="swatch"><div class="swatch-chip" style="background:#e8a93a"></div><div class="swatch-meta"><div class="swatch-name">warn</div><div class="swatch-hex">#E8A93A</div></div></div>
              <div class="swatch"><div class="swatch-chip" style="background:#d83a3a"></div><div class="swatch-meta"><div class="swatch-name">danger</div><div class="swatch-hex">#D83A3A</div></div></div>
              <div class="swatch"><div class="swatch-chip" style="background:#1f8fe6"></div><div class="swatch-meta"><div class="swatch-name">info</div><div class="swatch-hex">#1F8FE6</div></div></div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══ 02 TYPE ═══ -->
    <section id="type">
      <div class="section-head">
        <div class="section-label">02 · Type</div>
        <h2>Typography <span class="sub">Manrope · JetBrains Mono</span></h2>
      </div>
      <div class="section-body">
        <div class="type-row"><div class="type-tag">display</div><div class="type-spec">56 / 700 / -2.5%</div><div class="t-display">8.5 km/h</div></div>
        <div class="type-row"><div class="type-tag">h1</div><div class="type-spec">36 / 700 / -2%</div><div class="t-h1">Drill cycle complete</div></div>
        <div class="type-row"><div class="type-tag">h2</div><div class="type-spec">24 / 600 / -1%</div><div class="t-h2">Stinger locking</div></div>
        <div class="type-row"><div class="type-tag">h3</div><div class="type-spec">18 / 600</div><div class="t-h3">Hole details</div></div>
        <div class="type-row"><div class="type-tag">body</div><div class="type-spec">16 / 500</div><div class="t-body">Standard reading copy for in-cab dialog content.</div></div>
        <div class="type-row"><div class="type-tag">body / sm</div><div class="type-spec">14 / 500</div><div class="t-body-sm">Secondary copy — descriptions, hints.</div></div>
        <div class="type-row"><div class="type-tag">label</div><div class="type-spec">12 / 600 / UC</div><div class="t-label">Automation level</div></div>
        <div class="type-row"><div class="type-tag">mono</div><div class="type-spec">13 / 500 / tab</div><div class="t-mono">+14.0°  ·  53.10 m  ·  RPM 1230  ·  82 °C</div></div>
        <div class="type-row"><div class="type-tag">numeric / hero</div><div class="type-spec">tabular nums</div><div><span class="t-num" style="font-size:64px">82</span><span class="t-label" style="margin-left:10px;vertical-align:14px">bar</span></div></div>
      </div>
    </section>

    <!-- ═══ 03 SPACING & RADIUS ═══ -->
    <section id="space">
      <div class="section-head">
        <div class="section-label">03 · Spacing &amp; radius</div>
        <h2>Spatial tokens <span class="sub">4px base · generous touch padding</span></h2>
      </div>
      <div class="section-body">
        <div class="t-label" style="margin-bottom:12px">Spacing scale</div>
        <div class="grid cols-4" style="margin-bottom:32px">
          <div class="space-card" v-for="s in [{k:'s/1',px:4},{k:'s/2',px:8},{k:'s/3',px:12},{k:'s/4',px:16},{k:'s/5',px:24},{k:'s/6',px:32},{k:'s/7',px:48},{k:'s/8',px:64}]" :key="s.k">
            <div class="space-bar" :style="{ width: s.px + 'px' }"></div>
            <div class="space-label"><span class="space-key">{{ s.k }}</span><span>{{ s.px }} px</span></div>
          </div>
        </div>

        <div class="t-label" style="margin-bottom:12px">Radius</div>
        <div class="grid cols-5">
          <div class="radius-card" v-for="r in [{k:'r/1',px:'3px'},{k:'r/2',px:'6px'},{k:'r/3',px:'10px'},{k:'r/4',px:'14px'},{k:'r/pill',px:'999px'}]" :key="r.k">
            <div class="radius-demo" :style="{ borderRadius: r.px }"></div>
            <div class="radius-label"><span class="space-key">{{ r.k }}</span><span>{{ r.px }}</span></div>
          </div>
        </div>
        <p class="note" style="margin-top:24px">Minimum touch target: 56×56 px · Hit padding: ≥ 12 px around any interactive icon</p>
      </div>
    </section>

    <!-- ═══ 04 BUTTONS ═══ -->
    <section id="buttons">
      <div class="section-head">
        <div class="section-label">04 · Buttons</div>
        <h2>Buttons &amp; controls <span class="sub">56 px touch height minimum</span></h2>
      </div>
      <div class="section-body">
        <div class="grid cols-2" style="gap:32px">

          <HmiPanel>
            <div class="t-label" style="margin-bottom:18px">Primary <span class="contrast-note">4.86:1 ✓</span></div>
            <div class="row">
              <HmiButton variant="primary">Start Drilling</HmiButton>
              <HmiButton variant="primary" :disabled="true">Start Drilling</HmiButton>
            </div>
            <p class="note" style="margin-top:14px">Dominant action. One per screen. Disabled = explicit palette + dash glyph, focusable.</p>
          </HmiPanel>

          <HmiPanel>
            <div class="t-label" style="margin-bottom:18px">Caution <span class="contrast-note">5.45:1 ✓</span></div>
            <div class="row">
              <HmiButton variant="caution">Emergency Stop</HmiButton>
              <HmiButton variant="caution" :disabled="true">Emergency Stop</HmiButton>
            </div>
            <p class="note" style="margin-top:14px">Reserve for halting / overriding active operations.</p>
          </HmiPanel>

          <HmiPanel>
            <div class="t-label" style="margin-bottom:18px">Secondary</div>
            <div class="row">
              <HmiButton variant="secondary">Cancel</HmiButton>
              <HmiButton variant="secondary">Open menu</HmiButton>
            </div>
          </HmiPanel>

          <HmiPanel>
            <div class="t-label" style="margin-bottom:18px">Ghost &amp; icon</div>
            <div class="row">
              <HmiButton variant="ghost">View details</HmiButton>
              <HmiIconButton label="Open settings">
                <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </HmiIconButton>
              <HmiIconButton label="Switch layout">
                <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </HmiIconButton>
              <HmiIconButton label="View alerts">
                <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </HmiIconButton>
            </div>
          </HmiPanel>

        </div>
      </div>
    </section>

    <!-- ═══ 05 TAB SWITCHER ═══ -->
    <section id="tabs">
      <div class="section-head">
        <div class="section-label">05 · Tab switcher</div>
        <h2>Mode switch <span class="sub">large dual-tab for primary mode changes</span></h2>
      </div>
      <div class="section-body">
        <HmiPanel>
          <HmiTabSwitch
            v-model="activeMode"
            :options="modeTabs"
            aria-label="Operating mode"
          >
            <template #drilling>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false">
                <path d="M3 12h10l3-4 3 8 3-4"/>
              </svg>
            </template>
          </HmiTabSwitch>
          <p class="note" style="margin-top:18px">
            Roving <code class="code">tabindex</code> with ← → / Home / End keyboard model.
            <code class="code">aria-controls</code> wires each tab to its panel.
            Active: <strong>{{ activeMode }}</strong>
          </p>
        </HmiPanel>
      </div>
    </section>

    <!-- ═══ 06 STATUS ═══ -->
    <section id="status">
      <div class="section-head">
        <div class="section-label">06 · Status</div>
        <h2>Status &amp; badges <span class="sub">filled icons for hard states · pill badges for context</span></h2>
      </div>
      <div class="section-body">
        <div class="grid cols-2" style="gap:32px">

          <HmiPanel>
            <div class="t-label" style="margin-bottom:18px">Hard states (filled, in-context)</div>
            <div class="status-row">
              <HmiStatusMark variant="allow" />
              <HmiStatusMark variant="deny" />
              <HmiStatusMark variant="ok" />
              <HmiStatusMark variant="warning" />
              <HmiStatusMark variant="fault" />
            </div>
            <p class="note" style="margin-top:18px">Used in overlays, sensor pickers, and lockout dialogs.</p>
          </HmiPanel>

          <HmiPanel>
            <div class="t-label" style="margin-bottom:18px">Pill badges</div>
            <div class="badges">
              <HmiBadge variant="ok" message="Hydraulics nominal" />
              <HmiBadge variant="warn" message="Oil temp rising" />
              <HmiBadge variant="fault" message="Lockout engaged" />
              <HmiBadge variant="info" message="Auto-coupling" />
            </div>
            <p class="note" style="margin-top:18px">Inline notifications, summary headers, and toast positions.</p>
          </HmiPanel>

        </div>
      </div>
    </section>

    <!-- ═══ 07 GAUGES ═══ -->
    <section id="gauges">
      <div class="section-head">
        <div class="section-label">07 · Gauges</div>
        <h2>Gauges &amp; level indicators <span class="sub">half-arc, full-circle, segmented bars</span></h2>
      </div>
      <div class="section-body">

        <div class="grid cols-3" style="gap:20px;margin-bottom:24px">
          <HmiGauge type="half" :value="speedValue" :max="15" unit="km/h" label="Speed" :red-zone="0.10" />
          <HmiGauge type="half" :value="0.62" :max="1" label="Half-arc · fuel" :red-zone="0.14">
            <template #center>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--hmi-ink-2)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" style="margin:0 auto">
                <path d="M3 22V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v18"/><path d="M3 22h11"/>
                <path d="M14 9h2a2 2 0 0 1 2 2v7a2 2 0 0 0 4 0v-9l-3-3"/>
              </svg>
            </template>
          </HmiGauge>
          <HmiGauge type="full" :value="pressureValue" :max="150" unit="bar" label="Full-circle · pressure" :red-zone="0.16" />
        </div>

        <div class="grid cols-3" style="gap:20px;margin-bottom:32px">
          <HmiGauge type="full" :value="rpmValue" :max="100" unit="rpm" label="Full-circle · rpm" :red-zone="0.16" />
          <HmiGauge type="full" :value="flowValue" :max="150" unit="bar" label="Full-circle · flow" :red-zone="0.16" />
          <HmiGauge type="full" :value="28" :max="150" unit="bar" label="Full-circle · low" :red-zone="0.16" />
        </div>

        <!-- Interactive slider demo -->
        <HmiPanel style="margin-bottom:24px">
          <div class="t-label" style="margin-bottom:12px">Interactive controls</div>
          <div class="stack" style="gap:12px">
            <label class="slider-row">
              <span class="slider-label">Speed ({{ speedValue }} km/h)</span>
              <input type="range" v-model.number="speedValue" :min="0" :max="15" :step="0.1" class="slider" />
            </label>
            <label class="slider-row">
              <span class="slider-label">Pressure ({{ pressureValue }} bar)</span>
              <input type="range" v-model.number="pressureValue" :min="0" :max="150" class="slider" />
            </label>
            <label class="slider-row">
              <span class="slider-label">RPM ({{ rpmValue }})</span>
              <input type="range" v-model.number="rpmValue" :min="0" :max="100" class="slider" />
            </label>
          </div>
        </HmiPanel>

        <div class="t-label" style="margin-bottom:12px">Level indicators</div>
        <HmiPanel>
          <HmiSegBar
            :value="68"
            :max="100"
            unit="%"
            label="Vibration level"
            :segments="20"
            :critical-above="0.05"
            style="margin-bottom:18px"
          >
            <template #icon>
              <svg style="width:28px;height:28px;color:var(--hmi-ink-2);margin-right:6px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" focusable="false">
                <path d="M3 12c4-5 7 5 11 0s7 0 7 0"/>
              </svg>
            </template>
          </HmiSegBar>

          <HmiLevelBar label="Drilling power" :value="drillingPower" unit="%" style="margin-bottom:14px" />
          <HmiLevelBar label="Feed pressure" :value="feedPressure" :max="20" unit="bar" style="margin-bottom:14px" />
          <HmiLevelBar label="Flow rate" :value="flowRate" :max="25" unit="l/min" />
        </HmiPanel>

      </div>
    </section>

  </main>
</template>

<style>
/* ── Page chrome ── */
.page {
  max-width: 1480px;
  margin: 0 auto;
  padding: 56px 48px 96px;
}

.masthead {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--hmi-s-6);
  padding-bottom: var(--hmi-s-6);
  border-bottom: 1px solid var(--hmi-border);
  margin-bottom: var(--hmi-s-7);
}
.masthead h1 {
  font-size: 44px;
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 var(--hmi-s-3);
}
.eyebrow {
  font-family: var(--hmi-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--hmi-ink-3);
  margin-bottom: var(--hmi-s-3);
  display: block;
}
.masthead p {
  margin: 0;
  max-width: 580px;
  color: var(--hmi-ink-3);
  font-size: 15px;
}
.meta {
  text-align: right;
  font-family: var(--hmi-mono);
  font-size: 11px;
  color: var(--hmi-ink-4);
  letter-spacing: 0.08em;
  line-height: 1.8;
}
.dot       { color: var(--hmi-blue-500); }
.dot--orange { color: var(--hmi-orange-500); }

/* ── Section layout ── */
section {
  padding: var(--hmi-s-7) 0;
  border-bottom: 1px solid var(--hmi-border-soft);
}
section:last-of-type { border-bottom: none; }
.section-head {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--hmi-s-6);
  margin-bottom: var(--hmi-s-6);
  align-items: baseline;
}
.section-label {
  font-family: var(--hmi-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--hmi-ink-3);
}
.section-head h2 {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--hmi-ink-1);
}
.sub {
  color: var(--hmi-ink-3);
  font-weight: 400;
  margin-left: 10px;
  font-size: 14px;
  letter-spacing: 0;
}
.section-body { padding-left: 244px; }

/* ── Grid ── */
.grid { display: grid; gap: var(--hmi-s-4); }
.cols-2 { grid-template-columns: repeat(2, 1fr); }
.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(4, 1fr); }
.cols-5 { grid-template-columns: repeat(5, 1fr); }

/* ── Utilities ── */
.stack { display: flex; flex-direction: column; gap: var(--hmi-s-4); }
.row   { display: flex; gap: var(--hmi-s-4); align-items: center; flex-wrap: wrap; }
.note  { font-family: var(--hmi-mono); font-size: 11px; color: var(--hmi-ink-4); letter-spacing: 0.04em; }
.code  { font-family: var(--hmi-mono); color: var(--hmi-ink-2); }
.contrast-note { color: var(--hmi-ink-1); font-weight: 500; text-transform: none; letter-spacing: 0; }

/* ── Color swatches ── */
.swatch {
  background: var(--hmi-surface-1);
  border: 1px solid var(--hmi-border);
  border-radius: var(--hmi-r-3);
  overflow: hidden;
}
.swatch-chip { height: 92px; border-bottom: 1px solid var(--hmi-border-soft); }
.swatch-meta { padding: 10px 12px; font-family: var(--hmi-mono); font-size: 11px; line-height: 1.6; }
.swatch-name { color: var(--hmi-ink-1); }
.swatch-hex  { color: var(--hmi-ink-4); }

.ramp {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  border-radius: var(--hmi-r-3);
  overflow: hidden;
}
.ramp-step {
  padding: 14px 12px 16px;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-family: var(--hmi-mono);
  font-size: 10.5px;
  line-height: 1.5;
  color: #f1f4f7;
}
.ramp-key { opacity: .55; }

/* ── Type scale ── */
.type-row {
  display: grid;
  grid-template-columns: 200px 160px 1fr;
  gap: var(--hmi-s-5);
  padding: var(--hmi-s-4) 0;
  border-top: 1px solid var(--hmi-border-soft);
  align-items: baseline;
}
.type-row:first-child { border-top: none; }
.type-tag { font-family: var(--hmi-mono); font-size: 11px; letter-spacing: 0.1em; color: var(--hmi-ink-3); text-transform: uppercase; }
.type-spec { font-family: var(--hmi-mono); font-size: 11px; color: var(--hmi-ink-4); }

.t-display { font-size: 56px; font-weight: 700; letter-spacing: -0.025em; line-height: 1.02; }
.t-h1      { font-size: 36px; font-weight: 700; letter-spacing: -0.02em;  line-height: 1.1; }
.t-h2      { font-size: 24px; font-weight: 600; letter-spacing: -0.01em;  line-height: 1.2; }
.t-h3      { font-size: 18px; font-weight: 600; line-height: 1.3; }
.t-body    { font-size: 16px; font-weight: 500; line-height: 1.4; }
.t-body-sm { font-size: 14px; font-weight: 500; line-height: 1.45; color: var(--hmi-ink-2); }
.t-label   { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--hmi-ink-3); }
.t-mono    { font-family: var(--hmi-mono); font-size: 13px; color: var(--hmi-ink-2); }
.t-num     { font-variant-numeric: tabular-nums; font-weight: 700; letter-spacing: -0.01em; }

/* ── Spacing ── */
.space-card { background: var(--hmi-surface-1); border: 1px solid var(--hmi-border); border-radius: var(--hmi-r-3); padding: var(--hmi-s-4); }
.space-bar  { background: var(--hmi-blue-500); height: 8px; border-radius: 2px; }
.space-label { display: flex; justify-content: space-between; font-family: var(--hmi-mono); font-size: 11px; color: var(--hmi-ink-3); margin-top: var(--hmi-s-3); }
.space-key { color: var(--hmi-ink-1); }

/* ── Radius ── */
.radius-card  { background: var(--hmi-surface-1); border: 1px solid var(--hmi-border); border-radius: var(--hmi-r-3); padding: var(--hmi-s-4); display: flex; flex-direction: column; align-items: center; gap: var(--hmi-s-3); }
.radius-demo  { width: 100%; height: 56px; background: var(--hmi-surface-3); border: 1px solid var(--hmi-surface-4); }
.radius-label { font-family: var(--hmi-mono); font-size: 11px; color: var(--hmi-ink-3); display: flex; gap: 10px; }

/* ── Status row ── */
.status-row { display: flex; gap: var(--hmi-s-5); align-items: center; flex-wrap: wrap; }

/* ── Badges ── */
.badges { display: flex; flex-wrap: wrap; gap: var(--hmi-s-4); }

/* ── Slider demo ── */
.slider-row { display: flex; align-items: center; gap: var(--hmi-s-4); }
.slider-label { font-family: var(--hmi-mono); font-size: 12px; color: var(--hmi-ink-3); min-width: 180px; }
.slider {
  flex: 1;
  accent-color: var(--hmi-blue-500);
  height: 6px;
  cursor: pointer;
}
</style>
