module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'error',
    'max-len': [
      'error',
      {
        ignorePattern: 'd="([\\s\\S]*?)"',
        code: 120,
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'vue/no-v-for-template-key': 'off',
    'vue/no-multiple-template-root': 'off',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        endOfLine: 'auto',
      },
    ],
  },
}
