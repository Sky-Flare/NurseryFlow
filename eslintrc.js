/* eslint-env node */
module.exports = {
    extends: ['@daryl-software/eslint-config/vue3', 'plugin:tailwindcss/recommended'],
    parserOptions: {
        project: './tsconfig.json',
    },
    ignorePatterns: ['/src/generated/**/*', '/components.d.ts', '/dating.graphql', '/.prettierrc.js'],
    rules: {
        'no-unused-expressions': ['error'],
        // https://github.com/vuejs/eslint-plugin-vue/pull/2244
        'vue/no-setup-props-destructure': ['off'],
        'vue/require-toggle-inside-transition': ['off'],
        'tailwindcss/no-custom-classname': ['off'],
    },
};
