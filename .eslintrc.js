module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    'es6': true,
    'node': true,
    'googleappsscript/googleappsscript': true
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:import/recommended'],
  globals: {
    OAuth1: true,
    OAuth2: true,
    FirebaseApp: true
  },
  settings: {},
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  plugins: ['prettier', 'googleappsscript', 'import'],
  rules: {
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true
      }
    ],
    'no-nested-ternary': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-console': 'off'
  }
}
