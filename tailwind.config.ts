import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindForm from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            sans: ['Roboto', ...defaultTheme.fontFamily.sans],
            system: defaultTheme.fontFamily.sans
        },
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'inherit' // add required value here
                    }
                }
            }
        }
    },
    // eslint-disable-next-line no-undef
    plugins: [tailwindForm, typography]
}

export default config
