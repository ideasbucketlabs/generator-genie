import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import './assets/app.css'

const app = createApp(App)

app.use(createPinia())

function isMobile(userAgent: string): boolean {
    return !!(
        userAgent.match(/Android/i) ||
        userAgent.match(/webOS/i) ||
        userAgent.match(/iPhone/i) ||
        userAgent.match(/iPad/i) ||
        userAgent.match(/iPod/i) ||
        userAgent.match(/BlackBerry/i) ||
        userAgent.match(/Windows Phone/i)
    )
}

app.provide('isMac', window.navigator.userAgent.includes('Macintosh'))
app.provide('isMobile', isMobile(window.navigator.userAgent))

app.mount('#app')
