module.exports = {
    root: true,
    env: {
      node: true,
      'vue/setup-compiler-macros': true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
    ],
    parserOptions: {
      ecmaVersion: 2020,
      babelOptions: {
        presets: ['@babel/preset-typescript'],
      },
    },
    rules: {
      // Adicione ou ajuste regras conforme necessário
    },
  };
  