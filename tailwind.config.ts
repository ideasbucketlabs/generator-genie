import tailwindForm from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import colors from 'tailwindcss/colors'
import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    '50': colors.indigo['50'],
                    '100': colors.indigo['100'],
                    '200': colors.indigo['200'],
                    '300': colors.indigo['300'],
                    '400': colors.indigo['400'],
                    '500': colors.indigo['500'],
                    '600': colors.indigo['600'],
                    '700': colors.indigo['700'],
                    '800': colors.indigo['800'],
                    '900': colors.indigo['900'],
                    '950': colors.indigo['950']
                }
            },
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
