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
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ["es2015"]
          }
        }],
      }, {
        test: /\.less$/,
        exclude: /node_modules/,
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader?importLoaders=1' },
            { loader: 'postcss-loader' },
            { loader: 'less-loader' }
          ]
        })
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        use: [
          { loader: 'url-loader' }
        ]
      }, {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              'css': 'vue-style-loader!css-loader'
            }
          }
      }
    ]
  },

  plugins: ([
    new webpackCleanupPlugin(),
    new extractTextPlugin('[name].[hash].css'),
    new webpack.ProvidePlugin({
      'L': 'leaflet',
      'window.L': 'leaflet',
      '_': 'lodash',
      'moment': 'moment',
      '$': 'jquery',
      'window.jQuery': 'jquery'
    }),
    new htmlWebpackPlugin({
      template: 'index.ejs',
      baseUrl: (TARGET === 'ghbuild') ? '/map_tracks' : '/',
      inject: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        ENV_NAME: JSON.stringify(ENV)
      }
    }),
    new ProgressBarPlugin({ clear: false })
  ]),

  stats: { colors: true }
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
    new webpack.NoEmitOnErrorsPlugin()
  );
  common.devtool = 'cheap-module-eval-source-map';
} else {
  common.entry = {
    index: ['./index.js']
  };
  common.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
  common.devtool = 'source-map';
}

if (TARGET === 'ghbuild') {
  common.output.publicPath = '/map_tracks/dist';
}

module.exports = common;

