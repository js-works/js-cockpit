const path = require('path');
//const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  //addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/web-components',
  core: {
    builder: 'webpack5',
    disableTelemetry: true
  },
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'js-cockpit': path.resolve(__dirname, '../src/main/js-cockpit.ts')
    };

    config.module.rules = config.module.rules.filter(
      (it) =>
        it.test.toString().indexOf('.css') === -1 &&
        it.test.toString().indexOf('svg') === -1
    );

    config.module.rules.push({
      test: /\.ts$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, '../tsconfig.json')
          }
        }
      ],
      exclude: /node_modules/
    });

    config.module.rules.push({
      test: /\.css$/,
      use: ['raw-loader']
    });

    /*
    config.module.rules.push({
      test: /\.scss$/,
      use: ['raw-loader', 'sass-loader']
    });
    */

    config.module.rules.push({
      test: /\.svg$/,
      use: {
        loader: 'svg-url-loader',
        options: {
          encoding: 'base64'
        }
      }
    });

    return config;
  }
};
