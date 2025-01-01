const prettierConfig = require('./.prettierrc.js');

module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint/eslint-plugin'],

  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],

  root: true,
  env: {
    node: true,
    jest: true,
  },

  ignorePatterns: ['.eslintrc.js'],

  rules: {
    //? Code Format
    'prettier/prettier': ['error', prettierConfig],

    //? General

    // Disallows explicit type declarations for variables or parameters initialized to a number, string, or boolean
    '@typescript-eslint/no-inferrable-types': 'error',

    // Disallow the use of variables before they are defined
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',

    // Disallow unused variables
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',

    // Warn usage of the any type
    '@typescript-eslint/no-explicit-any': 'warn',

    // Allow any typed values in template expressions.
    '@typescript-eslint/restrict-template-expressions': 'off',

    // Disallow dot notation
    'dot-notation': 'off',
    '@typescript-eslint/dot-notation': 'error',

    // Prevents conditionals where the type is always truthy or always falsy
    // '@typescript-eslint/no-unnecessary-condition': 'error',

    //? Naming Convention
    '@typescript-eslint/naming-convention': [
      'error',

      // Enforce that all variables are either in camelCase or UPPER_CASE
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },

      // boolean variables
      {
        selector: ['variable'],
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
      },

      // Enforce that variable and function names are in camelCase/PascalCase
      {
        selector: ['function', 'method'],
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
      },

      // Enforce that class and interface names are in PascalCase
      {
        selector: ['class', 'interface'],
        format: ['PascalCase'],
      },

      // Require that Abstract Class names be prefixed with Abstract
      {
        selector: ['class'],
        modifiers: ['abstract'],
        format: ['PascalCase'],
        prefix: ['Abstract'],
      },

      // Prefer identifying each enums member format as upper case
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
    ],

    //? Class/ Interface/ Enum

    // Require a consistent member declaration order
    '@typescript-eslint/member-ordering': [
      'error',
      {
        classes: ['signature', 'field', 'constructor', 'method'],
      },
    ],

    // Require explicit accessibility modifiers on class properties and methods
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'no-public',
          methods: 'no-public',
          properties: 'no-public',
          parameterProperties: 'explicit',
        },
      },
    ],

    // Consistent with type definition either [interface/ type]
    '@typescript-eslint/consistent-type-definitions': 'error',

    // Prefer initializing each enums member value
    // '@typescript-eslint/prefer-enum-initializers': 'error',

    // Disallow unnecessary constructors
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',

    //? Functions/ Methods

    // Require explicit return types on functions and class methods
    '@typescript-eslint/explicit-function-return-type': 'error',

    // Requires any function or method that returns a Promise to be marked async
    '@typescript-eslint/promise-function-async': 'error',

    // Disallow async functions which have no await expression
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
  },
};
