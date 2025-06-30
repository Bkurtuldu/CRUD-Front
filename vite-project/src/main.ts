import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)
app.use(router).use(createPinia()).mount('#app')
