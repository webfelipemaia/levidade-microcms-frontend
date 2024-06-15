const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: process.env.VUE_APP_PORT || 8000,
    proxy: 'http://localhosts:8000'
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/styles/_template.scss";`
      }
    }
  }
})
