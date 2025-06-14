module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/typescript/recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        // add custom rules here
    },
}; 