var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var PRODUCTION = (process.env.NODE_ENV === 'production')


module.exports = {
  entry: './src/js/main.js',
  output: {
    path: './dist',
    filename: PRODUCTION ? 'bundle.min.js' : 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    inline: true,
    contentBase: './dist'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },
  plugins: PRODUCTION ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new ExtractTextPlugin('main.min.css', {
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ] : [
   new ExtractTextPlugin('main.css', {
     allChunks: true
   })
  ]
};
