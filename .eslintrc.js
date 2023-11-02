const tslintRules = {
  'member-access': false,
  'ordered-imports': false,
  'quotemark': false,
  'no-var-keyword': false,
  'object-literal-sort-keys': false,
  'no-console': false,
  'arrow-parens': false,
  'max-line-length': false,
  'object-literal-key-quotes': false,
  'no-shadowed-variable': false,
  'only-arrow-functions': false,
  'no-var-requires': false,
  'semicolon': false,
  'interface-over-type-literal': false,
  'align': false
};

module.exports = {
  'root': true,
  'env': {
    'es6': true
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'parserOptions': {
      'ecmaFeatures': {
        'jsx': true
      }
    }
  },
  'plugins': [
    '@typescript-eslint',
    'import',
    'tslint',
    'unused-imports',
    '@typescript-eslint'
  ],
  'extends': [
    'eslint:recommended',
  ],
  'rules': {
    'no-constant-condition': 'off',
    'no-case-declarations': 'off',
    'no-prototype-builtins': 'off',
    'keyword-spacing': 'error',
    'no-undef': 0,
    'indent': 'off',
    'no-multi-spaces': ['error'],
    'arrow-spacing': ['error'],
    '@typescript-eslint/indent': ['error', 2, {
      'SwitchCase': 0
    }],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi',
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false,
      },
    }],
    'tslint/config': [1, {
      rules: tslintRules,
      rulesDirectory: ['node_modules/tslint/lib/rules' ]
    } ],
    'space-before-blocks': ['error'],
    'import/newline-after-import': ['error', { 'count': 1 } ],
    'import/no-duplicates': 1,
    'object-curly-spacing': ['error', 'always' ],
    quotes: [2, 'single'],
    'semi': [1, 'always' ],
    'comma-spacing': [2, { 'before': false, 'after': true } ],
    'space-infix-ops': ['error', { 'int32Hint': false } ],
    //'comma-dangle': ['error', 'never' ],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var', 'if'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }
    ],
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
    'lines-between-class-members': ['error', 'always'],
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'no-unused-vars': 0,
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'none', 'argsIgnorePattern': '^_' }
    ]
  }
};
