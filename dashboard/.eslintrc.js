module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    // 'plugin:vue/essential',
    // '@vue/standard',
    'plugin:vue/recommended',
    'airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': 0,
    'strict': 0,
    'import/extensions': [
      'off',
      'never'
    ],
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'vue/max-attributes-per-line': 0,
    'no-implicit-coercion': [
      'off',
      {
        'boolean': false,
        'number': false,
        'string': true,
        'allow': []
      }
    ],
    'no-unused-vars': [
      1,
      {
        'vars': 'local',
        'args': 'none'
      }
    ],
    'no-param-reassign': 0,
    'no-new': 0,
    'default-case': 0
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: '2017',
    sourceType: 'module',
  }
}
