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
                    '50': 'oklch(97.51% 0.0126 244.25)',
                    '100': 'oklch(94.74% 0.0255 244.42)',
                    '200': 'oklch(89.1% 0.0563 239.49)',
                    '300': 'oklch(80.79% 0.1042 238.4)',
                    '400': 'oklch(72.19% 0.1489 241.1)',
                    '500': 'oklch(67.93% 0.1596 243.69)',
                    '600': 'oklch(55.53% 0.1538 249.24)',
                    '700': 'oklch(47.32% 0.1305 249.42)',
                    '800': 'oklch(42.06% 0.1089 247.87)',
                    '900': 'oklch(37.29% 0.0915 247.83)',
                    '950': 'oklch(27.96% 0.0688 250.18)'
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
                    '50': colors.rose['50'],
                    '100': colors.rose['100'],
                    '200': colors.rose['200'],
                    '300': colors.rose['300'],
                    '400': colors.rose['400'],
                    '500': colors.rose['500'],
                    '600': colors.rose['600'],
                    '700': colors.rose['700'],
                    '800': colors.rose['800'],
                    '900': colors.rose['900'],
                    '950': colors.rose['950']
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
