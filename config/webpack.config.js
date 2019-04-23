const webpack = require('webpack');
const paths = require('./paths');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: paths.resolveRoot('dist'),
    filename: 'server.js',
  },
  externals: [nodeExternals()],
}
