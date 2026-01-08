// docs/.vitepress/theme/index.mts
import DefaultTheme from 'vitepress/theme'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'

// Importe o CSS do seu projeto para a documentação ficar igual ao app
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 1. Configurar Pinia (necessário para o authStore que seus componentes usam)
    const pinia = createPinia()
    app.use(pinia)

    // 2. Configurar um Router básico (necessário para os <router-link> não quebrarem)
    const router = createRouter({
      history: createMemoryHistory(),
      routes: []
    })
    app.use(router)
  }
}