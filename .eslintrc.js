module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2023,
    sourceType: 'module',
    extraFileExtensions: ['.json'],
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended', // base recommended JS config
    'plugin:@typescript-eslint/recommended', // base config for TS
    'plugin:@cspell/recommended', // spelling
    'plugin:prettier/recommended', // code formatting rules
    'plugin:eslint-comments/recommended', // rules for ESLint comments
    'plugin:import/typescript', // import/export syntax
    'plugin:import/errors', // import/export syntax
    'plugin:import/warnings', // import/export syntax
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // enables rules for type checking
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // General
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/only-throw-error': 'error',
    '@typescript-eslint/return-await': ['warn', 'in-try-catch'],

    'prefer-arrow-callback': 'error', // we prefer to use arrow functions as callbacks
    'no-void': ['error', { allowAsStatement: true }], // we allow to use "void" to mark promises we don't wait for
    'eslint-comments/require-description': ['error', { ignore: ['eslint-enable'] }], // eslint-comments require description except eslint-enable
    'no-underscore-dangle': ['off'], // we regulate an use of an underscore by other rules
    'quote-props': ['error', 'consistent-as-needed'], // object properties should not use quotes unless necessary
    quotes: ['error', 'single', { avoidEscape: true }], // use single quotes for strings
    curly: ['error', 'all'], // we always use {} in control statements
    'no-console': 'warn', // warning on use of console.log() to call attention to unintentional use

    // Imports
    'no-duplicate-imports': 'error', // imports from the same source must be in one record
    'import/no-cycle': ['error', { maxDepth: Infinity }], // we must avoid cycle imports
    'import/no-extraneous-dependencies': ['error'], // imported external modules must be declared in package.json,

    // TypeScript
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-shadow': 'error', // Vars with the same name in different scopes are not allowed
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }], // Names of unused vars can start only from an underscore
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }], // Unused expressions only allowed for short circuit / ternary
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true, ignoreProperties: true }], // do not set types for boolean, number, string, unless in fn params or obj properties

    // Spell checker
    '@cspell/spellchecker': 'warn',

    // Formatting
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: ['return', 'if', 'throw'] },
      { blankLine: 'always', prev: 'if', next: '*' },
      { blankLine: 'always', prev: 'const', next: '*' },
      { blankLine: 'any', prev: 'const', next: ['const', 'let'] },
      {
        blankLine: 'always',
        prev: 'multiline-const',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'multiline-const',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'export',
      },
      {
        blankLine: 'always',
        prev: 'export',
        next: '*',
      },
    ],

    // Naming convention
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        modifiers: ['global'],
        types: ['number', 'string'],
        format: ['UPPER_CASE'],
      },
      {
        selector: 'variable',
        modifiers: ['exported'],
        format: ['strictCamelCase', 'UPPER_CASE'],
        filter: {
          match: false,
          regex: '^$',
        },
      },
      {
        selector: 'variable',
        modifiers: ['destructured'],
        format: ['strictCamelCase'],
        filter: {
          match: false,
          regex: '^(secureTextEntry|testID)',
        },
      },
      {
        selector: 'variable',
        types: ['function'],
        format: ['strictCamelCase'],
      },
      {
        selector: 'function',
        format: ['strictCamelCase'],
      },
      {
        selector: 'enum',
        format: ['StrictPascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        selector: 'parameter',
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['StrictPascalCase'],
        prefix: ['is', 'has', 'show', 'with', 'use', 'should'],
        filter: {
          match: false,
          regex: '^visible|enabled|disabled',
        },
      },
      {
        selector: 'interface',
        format: ['StrictPascalCase'],
      },
    ],
  },
};