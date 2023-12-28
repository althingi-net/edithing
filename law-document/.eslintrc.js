module.exports = {
    'env': {
        'node': true,
        'es2021': true
    },
    ignorePatterns: [
        'node_modules/',
        'dist/'
    ],
    'extends': [
        'eslint:recommended',
        'plugin:import/recommended',
    ],'overrides': [{
        // Config files
        'env': {
            'node': true
        },
        'files': [
            '.eslintrc.{js,cjs}',
            'jest.config.{js,cjs}'
        ],
        'parserOptions': {
            'sourceType': 'script'
        },
    }, {
        // Typescript
        'extends': [
            'plugin:import/typescript',
            'plugin:@typescript-eslint/eslint-recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
        ],
        'plugins': [
            '@typescript-eslint',
        ],
        'parser': '@typescript-eslint/parser',
        'parserOptions': {
            'ecmaVersion': 'latest',
            'sourceType': 'module',
            'project': './tsconfig.json',
            'tsconfigRootDir': __dirname,
        },
        'files': ['src/**/*.ts?(x)'],
        'rules': {
            // Package requirements
            'import/no-default-export': 'error',

            // Developer experience
            '@typescript-eslint/no-unnecessary-condition': ['error', {
                'allowConstantLoopConditions': true
            }],
            '@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true }],
            
            // Code quality
            'import/no-duplicates': 'error',
            'import/no-named-as-default': 'error',

            // TODO: Remove these rules
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
        },
    }, {
        // Tests
        'env': {
            'jest': true
        },
        'files': [
            '**/__tests__/**/*.[jt]s?(x)',
            '**/?(*.)+(spec|test).[tj]s?(x)'
        ],
        'parser': '@typescript-eslint/parser',
        'parserOptions': {
            'ecmaVersion': 'latest',
            'sourceType': 'module',
            'project': './tsconfig.json',
            'tsconfigRootDir': __dirname,
        },
        'plugins': [
            'jest',
        ],
        'extends': [
            'plugin:jest/recommended',
        ],
    }],
    'rules': {
        // Formatting
        'indent': [
            'error',
            4,
            { 'SwitchCase': 1, 'ignoredNodes': ['PropertyDefinition'] }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'object-curly-spacing': [
            'error',
            'always'
        ],
    },
};
