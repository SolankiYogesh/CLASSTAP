import {fixupPluginRules} from '@eslint/compat'
import eslint from '@eslint/js'
import airbnb from 'eslint-config-airbnb-base'
import eslintConfigPrettier from 'eslint-config-prettier'
import deprecation from 'eslint-plugin-deprecation'
import es from 'eslint-plugin-es'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactNative from 'eslint-plugin-react-native'
// enable below plugin when only required like you want to vite exports (react-refresh) // written by yogesh
// import reactRefresh from 'eslint-plugin-react-refresh'
import sortImports from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import path from 'path'
import tseslint from 'typescript-eslint'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  {
    ignores: [
      'commitlint.config.mjs',
      'eslint.config.mjs',
      'babel.config.js',
      'metro.config.js',
    ]
  },
  ...tseslint.config(
    {
      languageOptions: {
        globals: globals.browser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        parserOptions: {
          project: path.join(__dirname, 'tsconfig.json'),
          tsconfigRootDir: __dirname,
          ecmaVersion: 'latest',
          sourceType: 'module'
        }
      }
    },
    {
      plugins: {
        'react-native': fixupPluginRules(reactNative),
        'react-hooks': fixupPluginRules(reactHooks),
        'simple-import-sort': sortImports,
        airbnb: fixupPluginRules(airbnb),
        'jsx-a11y': fixupPluginRules(jsxA11y),
        deprecation: fixupPluginRules(deprecation),
        es: fixupPluginRules(es)
      }
    },
    // enable below plugin when only required like you want to vite exports (react-refresh) // written by yogesh
    // reactRefresh.configs.recommended,
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    eslintPluginPrettierRecommended,
    importPlugin.flatConfigs.recommended,
    eslintConfigPrettier,
    eslintPluginPrettierRecommended,
    {
      rules: {
        // enable below plugin when only required like you want to vite exports (react-refresh) // written by yogesh
        // 'react-refresh/only-export-components': 'error',
        ...jsxA11y.configs.recommended.rules,
        '@typescript-eslint/no-explicit-any': 'off',
        'react/display-name': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-magic-numbers': 'off',
        '@typescript-eslint/explicit-function-return': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'no-async-promise-executor': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/return-await': 'off',
        '@typescript-eslint/prefer-promise-reject-errors': 'off',
        '@typescript-eslint/max-params': 'off',
        'no-case-declarations': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true
          }
        ],

        '@typescript-eslint/no-extraneous-class': 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        '@typescript-eslint/prefer-enum-initializers': 'error',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/array-type': ['error', {default: 'array-simple'}],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase']
          },
          {
            selector: ['typeLike', 'enumMember'],
            format: ['PascalCase']
          },
          {
            selector: ['parameter', 'method'],
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'allow'
          }
        ],
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            fixStyle: 'separate-type-imports'
          }
        ],
        '@typescript-eslint/consistent-type-exports': [
          'error',
          {
            fixMixedExportsWithInlineTypeSpecifier: false
          }
        ],
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            functions: true,
            classes: true,
            variables: false,
            allowNamedExports: false
          }
        ],
        'jsx-a11y/alt-text': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'sort-vars': 'error',
        'react/prop-types': 'error',
        'react/no-array-index-key': 'error',
        'import/no-named-as-default': 'off',
        'react-native/split-platform-components': 'off',
        'jsx-a11y/no-autofocus': 'off',
        eqeqeq: 'error',
        'no-console': 'error',
        semi: [2, 'never'],
        'no-multiple-empty-lines': [
          'error',
          {
            max: 2,
            maxEOF: 1
          }
        ],
        'prettier/prettier': 'off',
        'react/function-component-definition': [
          2,
          {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function'
          }
        ],
        'comma-dangle': [
          'error',
          {
            arrays: 'never',
            objects: 'never',
            imports: 'never',
            exports: 'never',
            functions: 'ignore'
          }
        ],
        'default-param-last': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/class-literal-property-style': 'error',
        // ESLint core rules
        'es/no-nullish-coalescing-operators': 'off',
        'es/no-optional-chaining': 'off',
        'prefer-destructuring': [
          'error',
          {
            array: true,
            object: true
          }
        ],
        'jsx-a11y/label-has-associated-control': 'off',
        'react/require-default-props': 'off',
        'react/jsx-no-constructed-context-values': 'error',
        'react-native/no-unused-styles': 'error',
        'no-restricted-syntax': 'off',
        curly: 'error',
        'prefer-regex-literals': 'off',
        'react-native/no-inline-styles': 2,
        'react-native/no-color-literals': 2,
        'react-native/no-single-element-style-arrays': 2,
        'react-native/sort-styles': 'error',

        'import/no-unresolved': 'error'
      },

      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx']
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: [
              './tsconfig.json',
              './packages/mobile/tsconfig.json',
              './packages/web/tsconfig.json',
              './packages/shared/tsconfig.json'
            ]
          }
        },
        react: {
          version: '18.3.1'
        }
      }
    }
  )
]
