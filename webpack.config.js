var path = require('path');
var config = {
  entry: path.resolve(__dirname, 'app/index.jsx'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.html$/, loader: 'file?name=[name].[ext]'},
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel', query: {presets: ['react', 'es2015']}}
    ]
  }
};

module.exports = config;
