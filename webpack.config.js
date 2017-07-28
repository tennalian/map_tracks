'use strict';
const path = require('path');
const webpack = require('webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpackCleanupPlugin = require('webpack-cleanup-plugin');
const merge = require('webpack-merge');

const rel = process.env.CONFIG == 'rel';

const common = {
  context: path.resolve(__dirname, 'src'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[hash].js',
    publicPath: '/'
  },

  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: extractTextPlugin.extract('style-loader', ['css-loader?importLoaders=1', 'postcss-loader', 'less-loader'])
      },{
          test: /.(jpe?g|gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
            loader: 'url-loader?limit=1000000&name=[name].[ext]'
        },{
          test: /\.js$/,
          loader: 'babel?presets[]=es2015',
          exclude: /node_modules/
        },{
          test: /\.html$/,
          loader: 'raw'
        }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      'L': 'leaflet',
      'window.L': 'leaflet',
    }),
    new extractTextPlugin('[name].[hash].css'),
      new htmlWebpackPlugin({
      template: 'index.ejs',
      // favicon: './favicon.ico',
      baseUrl: '/',
      inject: true
    })
  ],

  devServer: {
    port: 5000,
    contentBase: path.resolve(__dirname, 'dist'),
    stats: 'minimal',
    historyApiFallback: true,
    hot: true
  }
};

if (rel) {
  console.log('Development environment disabled.');

  module.exports = merge.smart(common, {
    entry: {
      index: ['./index.js']
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpackCleanupPlugin()
    ],
    devtool: 'cheap-module-eval-source-map'
  })
} else {
  console.log('Development environment enabled.');

  module.exports = merge.smart(common, {
    entry: {
      index: ['./index.js','webpack-dev-server/client?http://localhost:5000/']
    },
    devtool: 'source-map'
  })
}
