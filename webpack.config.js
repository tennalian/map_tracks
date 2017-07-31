'use strict';
const path = require('path');
const webpack = require('webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpackCleanupPlugin = require('webpack-cleanup-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const merge = require('webpack-merge');

const ENV = process.env.NODE_ENV || 'development';

const common = {
  context: path.resolve(__dirname, 'src'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[hash].js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.less'],
    modules: [
      'node_modules'
    ],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader?' + JSON.stringify({
              presets: [
                ['es2015', {'modules': false}]
              ],
              plugins: ['transform-react-jsx']
            })
          }
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
      }
    ]
  },


  plugins: ([
    new extractTextPlugin('[name].[hash].css'),
    new webpack.ProvidePlugin({
      'L': 'leaflet',
      'window.L': 'leaflet',
      '$': 'jquery'
    }),
    new htmlWebpackPlugin({
      template: 'index.ejs',
      baseUrl: '/',
      inject: true
    }),
    new ProgressBarPlugin({ clear: false }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    })
  ]).concat(ENV==='production' ? [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpackCleanupPlugin()
  ] : []),

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
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    open: false,
    noInfo: true,
    inline: true
  };
  common.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
} else {
  common.entry =  {
    index: ['index.js']
  }
}

module.exports = common;
