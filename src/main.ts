import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import './assets/app.css'

const app = createApp(App)

app.use(createPinia())

const ua = window.navigator.userAgent
const iOSSafari = /^(?=.*(iPhone|iPad|iPod))(?=.*AppleWebKit)(?!.*(criOS|fxiOS|opiOS|chrome|android)).*/i.test(ua)

app.provide('isMac', window.navigator.userAgent.includes('Macintosh'))
app.provide('isMobile', /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent))
app.provide('isIOSSafari', iOSSafari)

app.mount('#app')
