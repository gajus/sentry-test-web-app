/* eslint-disable import/no-commonjs, import/unambiguous */

const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const AssetsManifestPlugin = require('webpack-assets-manifest');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.js$/,
      },
    ],
  },
  output: {
    chunkFilename: '[name].[contenthash].js',
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [
      '*',
      '.js',
    ],
  },
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    mangleExports: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: false,
        extractComments: false,
        parallel: false,
        sourceMap: true,
        terserOptions: {
          mangle: false,
          output: {
            comments: false,
          },
        },
      }),
    ],
    usedExports: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new AssetsManifestPlugin(),
  ],
};
