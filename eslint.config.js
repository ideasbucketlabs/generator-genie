import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import pluginPlaywright from 'eslint-plugin-playwright'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}']
    },

    {
        name: 'app/files-to-ignore',
        ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
    },

    ...pluginVue.configs['flat/essential'],
    ...vueTsEslintConfig(),
    {
        rules: {
            'vue/multi-word-component-names': 0,
            'vue/max-len': [
                'error',
                {
                    code: 120,
                    template: 8000,
                    tabWidth: 4,
                    comments: 200,
                    ignorePattern: '',
                    ignoreComments: true,
                    ignoreTrailingComments: true,
                    ignoreUrls: false,
                    ignoreStrings: false,
                    ignoreTemplateLiterals: false,
                    ignoreRegExpLiterals: false,
                    ignoreHTMLAttributeValues: false,
                    ignoreHTMLTextContents: false
                }
            ]
        }
    },
    {
        ...pluginVitest.configs.recommended,
        files: ['src/**/__tests__/*']
    },

    {
        ...pluginPlaywright.configs['flat/recommended'],
        files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}']
    },
    skipFormatting
]
