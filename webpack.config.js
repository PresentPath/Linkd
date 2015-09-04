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
    loaders: [
      // Transpile JSX and ES6 into ES5 into dist
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      // Load index.html into dist
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },

  devtool: "#source-map"
};