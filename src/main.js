import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import aclPlugin from './plugins/acl'
import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/lightfair.css'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "@/assets/styles/_template.scss"
import { useSettingStore } from '@/stores/settingStore'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(aclPlugin)
app.use(VueHighlightJS)

const settingsStore = useSettingStore()
settingsStore.initialize().catch(console.error)
app.mount('#app')
