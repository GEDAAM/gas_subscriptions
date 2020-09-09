module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    'googleappsscript/googleappsscript': true
  },
  extends: [
    'eslint/recommended',
    'prettier',
    'plugin:import/recommended',
  ],
  globals: {
    'OAuth1': true,
    'OAuth2': true,
    'FirebaseApp': true
  },
  settings: {},
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'prettier',
    'googleappsscript',
    'import'
  ],
  rules: {
    'prettier/prettier': ['error', {}, {
      'usePrettierrc': true
     }],
    'import/prefer-default-export': 'error',
    'no-nested-ternary': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-console': 'off'
  }
}