import './assets/main.css'
import './assets/ui.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { lucideDirective } from './directives/lucide'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('lucide', lucideDirective)

app.mount('#app')
