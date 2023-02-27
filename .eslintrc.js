module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    // 1、接入 prettier 规则
    'prettier',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: false
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: [
    'vue',
    '@typescript-eslint',

    // 2、加入 prettier 的 eslint 插件
    'prettier'
  ],
  rules: {
    // 3、开启 prettier 自动修复功能
    'prettier/prettier': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'vue/multi-word-component-names': 'off'
    // "vue/vue-in-jsx-scope": 'off'
  }
};
