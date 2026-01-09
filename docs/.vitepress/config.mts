import { defineConfig } from 'vitepress'
import path from 'path'

export default defineConfig({
  title: "Leve UI Kit",
  description: "Sistema de design Leve para aplicações Vue.js + Bootstrap.",
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Componentes', link: '/components/l-sidebar' }
    ],

    sidebar: [
      {
        text: 'Início',
        collapsed: false,
        items: [
          { text: 'Index', link: 'index' },
          { text: 'Guide', link: 'guide' },
        ]
      },
      {
        text: 'Layout Principal',
        collapsed: false,
        items: [
          { text: 'LOffcanvas', link: '/components/layout/l-offcanvas' },
          { text: 'LNavigation', link: '/components/layout/l-navigation' },
          { text: 'LFooter', link: '/components/layout/l-footer' }
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