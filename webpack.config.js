module.exports = {
  // Compile source modules into single output file
  context: __dirname + '/client/src',
  entry: {
    javascript: './js/main.js',
    html: './index.html'
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + 'client/dist'
  },

  module: {
    // Transpile JSX and ES6 into ES5
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader']
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  }
};