import tailwindForm from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import colors from 'tailwindcss/colors'
import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./index.html', 'public/404.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    future: {
        hoverOnlyWhenSupported: true
    },
    theme: {
        extend: {
            colors: {
                primary: {
                    '50': colors.blue['50'],
                    '100': colors.blue['100'],
                    '200': colors.blue['200'],
                    '300': colors.blue['300'],
                    '400': colors.blue['400'],
                    '500': colors.blue['500'],
                    '600': colors.blue['600'],
                    '700': colors.blue['700'],
                    '800': colors.blue['800'],
                    '900': colors.blue['900'],
                    '950': colors.blue['950']
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
     
    plugins: [tailwindForm, typography]
}

export default config
