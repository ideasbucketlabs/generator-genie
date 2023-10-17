import tailwindForm from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import colors from 'tailwindcss/colors'
import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./index.html', 'public/404.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
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
                },
                'primary-dark': {
                    '50': colors.gray['50'],
                    '100': colors.gray['100'],
                    '200': colors.gray['200'],
                    '300': colors.gray['300'],
                    '400': colors.gray['400'],
                    '500': colors.gray['500'],
                    '600': colors.gray['600'],
                    '700': colors.gray['700'],
                    '800': colors.gray['800'],
                    '900': colors.gray['900'],
                    '950': colors.gray['950']
                },
                error: {
                    '50': colors.red['50'],
                    '100': colors.red['100'],
                    '200': colors.red['200'],
                    '300': colors.red['300'],
                    '400': colors.red['400'],
                    '500': colors.red['500'],
                    '600': colors.red['600'],
                    '700': colors.red['700'],
                    '800': colors.red['800'],
                    '900': colors.red['900'],
                    '950': colors.red['950']
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
