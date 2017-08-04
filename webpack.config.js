'use strict';
const path = require('path');
const webpack = require('webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpackCleanupPlugin = require('webpack-cleanup-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const merge = require('webpack-merge');

let TARGET = process.env.npm_lifecycle_event;
const ENV = (TARGET === 'start') ? 'development' : 'production';

const common = {
  context: path.resolve(__dirname, 'src'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[hash].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader'}
        ]
      },
      {
        test: /\.(less|css)$/,
        exclude: /node_modules/,
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader?importLoaders=1' },
            { loader: 'postcss-loader' },
            { loader: 'less-loader' }
          ]
        })
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        use: [
          { loader: 'url-loader' }
        ]
      },
      {
          test: /\.vue$/,
          loader: 'vue-loader',
      }
    ]
  },


  plugins: ([
    new extractTextPlugin('[name].[hash].css'),
    new webpack.ProvidePlugin({
      'L': 'leaflet',
      'window.L': 'leaflet',
      '_': 'lodash'
    }),
    new htmlWebpackPlugin({
      template: 'index.ejs',
      baseUrl: '/',
      inject: true
    }),
    new ProgressBarPlugin({ clear: false })
  ]),

  stats: { colors: true },

  devtool: (ENV !=='production') ? 'source-map' : 'cheap-module-eval-source-map',
};

if (ENV !== 'production') {
  common.entry =  {
    index: ['./index.js','webpack-dev-server/client?http://localhost:5000/']
  };
  common.devServer = {
    port: 5000,
    host: 'localhost',
    contentBase: path.resolve(__dirname, 'build'),
    historyApiFallback: true,
    open: false,
    noInfo: true,
    inline: true
  };
  common.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpackCleanupPlugin()
  );
} else {
  common.entry = {
    index: ['./index.js']
  };
}

module.exports = common;
