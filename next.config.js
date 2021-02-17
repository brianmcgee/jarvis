module.exports = {
    webpack(config, options) {

        config.module.rules.push(
            {
                test: /\.graphql$/,
                exclude: /node_modules/,
                use: [options.defaultLoaders.babel, {loader: 'graphql-let/loader'}],
            }, {
                test: /\.graphqls$/,
                exclude: /node_modules/,
                use: ['graphql-let/schema/loader'],
            }, {
                test: /\.ya?ml$/,
                use: 'js-yaml-loader',
            }
        )

        return config
    },
}