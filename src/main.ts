import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
//@ts-ignore
import { createVuetify } from 'vuetify'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify({
})

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
