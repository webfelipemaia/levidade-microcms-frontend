import { defineConfig } from 'vitepress'
import path from 'path'

export default defineConfig({
  title: "Leve UI Kit",
  description: "Sistema de design Leve para aplicações Vue.js + Bootstrap.",
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Componentes', link: '/components/app-sidebar' }
    ],

    sidebar: [
      {
        text: 'Layout Principal',
        collapsed: false,
        items: [
          { text: 'AppSidebar (Menu)', link: '/components/app-sidebar' },
          { text: 'AppNavigation (Topo)', link: '/components/app-navigation' },
          { text: 'AppFooter (Rodapé)', link: '/components/app-footer' }
        ]
      },
      {
        text: 'Guia de Estilo',
        items: [
          { text: 'Cores e Bootstrap', link: '/guide/styles' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/webfelipemaia/levidade-microcms-frontend' }
    ]
  },

  // Isso aqui é CRUCIAL para o VitePress entender o seu projeto Vue
  vite: {
    resolve: {
      alias: {
        // Resolve o '@' para a pasta 'src' do seu projeto real
        '@': path.resolve(__dirname, '../../src'),
        // Garante que o Vue usado seja a versão completa com compilador de templates
        'vue$': 'vue/dist/vue.esm-bundler.js'
      }
    }
  }
})