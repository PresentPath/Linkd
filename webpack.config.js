var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // Compile source modules into single output file
  context: __dirname + '/client/src',
  entry: {
    javascript: './js/components/App.js',
    html: './index.html'
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/client/dist'
  },

  module: {
    // Transform resource files into new source files
    loaders: [
      // Transpile JSX and ES6 into ES5
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      // Load index.html
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      // Compile CSS from SCSS
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  },

  devtool: "#source-map"
};