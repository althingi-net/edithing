module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'react-app',
        'react-app/jest',
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'overrides': [{
        'env': {
            'node': true
        },
        'files': [
            '.eslintrc.{js,cjs}'
        ],
        'parserOptions': {
            'sourceType': 'script'
        },
    }, {
        'extends': [
            'plugin:@typescript-eslint/recommended',
        ],
        'plugins': [
            '@typescript-eslint',
        ],
        'files': ['src/**/*.ts?(x)'],
        'parser': '@typescript-eslint/parser',
        'parserOptions': {
            'ecmaVersion': 'latest',
            'sourceType': 'module',
            'project': './tsconfig.json',
            'tsconfigRootDir': __dirname,
        },
        'rules': {
            '@typescript-eslint/no-unnecessary-condition': ['error', {
                'allowConstantLoopConditions': true
            }],
        },
    }],
    'plugins': [
        'react'
    ],
    'rules': {
        'indent': [
            'error',
            4
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
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
    }
};
