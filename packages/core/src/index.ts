import type { App } from 'vue'

export { default as HmiButton } from './components/HmiButton.vue'
export { default as HmiIconButton } from './components/HmiIconButton.vue'
export { default as HmiTabSwitch } from './components/HmiTabSwitch.vue'
export { default as HmiBadge } from './components/HmiBadge.vue'
export { default as HmiStatusMark } from './components/HmiStatusMark.vue'
export { default as HmiGauge } from './components/HmiGauge.vue'
export { default as HmiLevelBar } from './components/HmiLevelBar.vue'
export { default as HmiSegBar } from './components/HmiSegBar.vue'
export { default as HmiPanel } from './components/HmiPanel.vue'

export type { ButtonVariant } from './components/HmiButton.vue'
export type { BadgeVariant } from './components/HmiBadge.vue'
export type { StatusMarkVariant } from './components/HmiStatusMark.vue'
export type { GaugeType } from './components/HmiGauge.vue'
export type { TabOption } from './components/HmiTabSwitch.vue'

import HmiButton from './components/HmiButton.vue'
import HmiIconButton from './components/HmiIconButton.vue'
import HmiTabSwitch from './components/HmiTabSwitch.vue'
import HmiBadge from './components/HmiBadge.vue'
import HmiStatusMark from './components/HmiStatusMark.vue'
import HmiGauge from './components/HmiGauge.vue'
import HmiLevelBar from './components/HmiLevelBar.vue'
import HmiSegBar from './components/HmiSegBar.vue'
import HmiPanel from './components/HmiPanel.vue'

/** Install all Sandvik HMI components globally */
export function install(app: App) {
  app.component('HmiButton', HmiButton)
  app.component('HmiIconButton', HmiIconButton)
  app.component('HmiTabSwitch', HmiTabSwitch)
  app.component('HmiBadge', HmiBadge)
  app.component('HmiStatusMark', HmiStatusMark)
  app.component('HmiGauge', HmiGauge)
  app.component('HmiLevelBar', HmiLevelBar)
  app.component('HmiSegBar', HmiSegBar)
  app.component('HmiPanel', HmiPanel)
}

export default { install }
