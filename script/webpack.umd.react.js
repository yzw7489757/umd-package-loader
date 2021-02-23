const { resolve } = require('path');
const base = require('./webpack.base');

module.exports = [{
  ...base,

  mode: 'none',
  devtool: 'source-map',

  entry: {
    reactDemo: resolve(__dirname, '../appGrounds/react/index.tsx')
  },

  output: {
    // umdNamedDefine: true,
    library: "reactFooter",
    libraryTarget: 'umd',
    filename: '[name].js',
    path: resolve(__dirname, '../entry/lib'),
  },
}]
