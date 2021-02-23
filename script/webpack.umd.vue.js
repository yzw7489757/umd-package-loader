const { resolve } = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const base = require('./webpack.base');

const umdConfig = {
  ...base,

  mode: 'none',

  devtool: 'source-map',
}

module.exports = [{
  ...umdConfig,
  externals: {
    ...umdConfig.externals,
    vue: {
      root: 'Vue',
      commonjs2: 'vue',
      commonjs: 'vue',
      amd: 'vue',
    },
    vuex: {
      root: 'Vuex',
      commonjs2: 'vuex',
      commonjs: 'vuex',
      amd: 'vuex',
    },
  },
  plugins: [
    ...umdConfig.plugins,
    new VueLoaderPlugin()
  ],
  entry: {
    vueDemo: resolve(__dirname, '../appGrounds/vue/index.ts'),
  },
  module: {
    rules: [
      ...umdConfig.module.rules,
      
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              cacheBusting: true,
              transformToRequire: {
                video: ['src', 'poster'],
                source: 'src',
                img: 'src',
                image: 'xlink:href',
              },
            },
          },
        ],
      },
    ]
  },

  output: {
    library: "vueFooter",
    libraryTarget: 'umd',
    filename: '[name].js',
    path: resolve(__dirname, '../entry/lib'),
  },
}]
