module.exports = {
    plugins: {
        'postcss-import': {},
        tailwindcss: {},
        'postcss-font-magician': {
            variants: {
                Inter: {
                    300: [],
                    400: [],
                    600: [],
                    700: [],
                },
                Futura: {
                    700: [],
                },
                foundries: ['google'],
            },
        },
        'postcss-nested': {},
        'postcss-preset-env': {
            autoprefixer: {
                add: true, grid: false
            },
            features: {
                'nesting-rules': true,
            },
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
        }
    },
}