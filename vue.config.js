const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  pages: {
    options: {
      template: 'public/browser-extension.html',
      entry: './src/options/main.ts',
      title: 'Options'
    }
  },

  productionSourceMap: !IS_PROD, // https://cli.vuejs.org/config/#productionsourcemap
  lintOnSave: !IS_PROD, // https://cli.vuejs.org/config/#lintonsave

  // https://cli.vuejs.org/config/#pluginoptions
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.ts'
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-scripts/content-script.ts'
            ]
          }
        }
      },
      manifestTransformer: (manifest) => {
        if (!IS_PROD) {
          manifest.content_security_policy = "script-src 'self' 'unsafe-eval' http://localhost:8098; object-src 'self'"
        }

        return manifest
      }
    }
  },

  configureWebpack: {
    optimization: {
      // 将第三方库和主程序分离
      // 参考配置：https://yi-jy.com/2018/06/09/webpack-split-chunks/
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
          // 第三方库
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: 'vendors'
          },
          // 公用模块
          default: {
            minSize: 0,
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            name: 'utils'
          }
        }
      }
    }
  },

  chainWebpack: config => {
    // @see https://github.com/adambullmer/vue-cli-plugin-browser-extension/issues/106
    config.plugins.delete('provide-webextension-polyfill')
    config.module.rules.delete('provide-webextension-polyfill')
  }
}
