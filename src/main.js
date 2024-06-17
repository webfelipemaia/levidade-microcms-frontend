import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import axios from 'axios'
import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/lightfair.css'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "@/assets/styles/_template.scss"


window.axios = axios
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = 'http://localhost:4000';

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(VueHighlightJS)
app.mount('#app')
