const path = require('path')

const tailwindConfigPath = path.resolve(__dirname, 'tailwind.config.js')

module.exports = {
    plugins: {
        'postcss-import': {},
        tailwindcss: {
            config: tailwindConfigPath,
        },
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
        'postcss-custom-properties': {},
        'postcss-flexbugs-fixes': {},
        'postcss-preset-env': {
            autoprefixer: {
                add: true,
                grid: false,
                flexbox: 'no-2009',
            },
            stage: 3,
            features: {
                'nesting-rules': true,
                'custom-properties': false,
            },
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
        },
    },
}
