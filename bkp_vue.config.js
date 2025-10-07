const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: process.env.VUE_APP_PORT || 8000,
    proxy: 'http://localhost:8000'
  },
  css: {
    loaderOptions: {
      sass: {
        // Adiciona o Dart Sass como a implementação
        implementation: require('sass'),
        // additionalData: `@import "@/assets/styles/_template.scss";` // Importar um arquivo SCSS global
      }
    }
  },
  configureWebpack: {
    // Flags para a árvore de dependências
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm-bundler.js'
      }
    },
    // Flag global para a otimização da árvore
    plugins: [
      // __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false' 
      // Desabilitando detalhes de erro durante o modo de produção
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
    ]
  }
});
