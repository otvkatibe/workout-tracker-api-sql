import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,
    prettierConfig,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2021
            }
        },
        plugins: {
            import: importPlugin,
            prettier: prettierPlugin
        },
        rules: {
            // Prettier integration
            'prettier/prettier': 'error',

            // Best practices
            'no-console': 'off',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-var': 'error',
            'prefer-const': 'error',
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],

            // Import rules
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'never'
                }
            ],
            'import/no-duplicates': 'error',
            'import/first': 'error',

            // ES6+
            'arrow-body-style': ['error', 'as-needed'],
            'prefer-arrow-callback': 'error',
            'prefer-template': 'error',
            'object-shorthand': 'error',

            // Async/Await
            'no-return-await': 'off',
            'require-await': 'off',

            // Error handling
            'no-throw-literal': 'error'
        }
    },
    {
        ignores: ['node_modules/**', 'dist/**', 'coverage/**']
    }
];
