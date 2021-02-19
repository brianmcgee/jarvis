const path = require('path')

module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    'storybook-css-modules-preset',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
      },
    },
  ],
  babel: {
    plugins: ['@babel/plugin-proposal-class-properties'],
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.resolve(__dirname, '../components'),
      '@/styles': path.resolve(__dirname, '../components'),
      '@/lib': path.resolve(__dirname, '../lib'),
    }
    return config
  },
}
