const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [],
  framework: '@storybook/html',
  core: {
    disableTelemetry: true
  },
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'js-cockpit': path.resolve(__dirname, '../src/main/js-cockpit.ts')
    }

    return config
  }
}
