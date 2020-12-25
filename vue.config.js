module.exports = {
  pages: {
    options: {
      template: 'public/browser-extension.html',
      entry: './src/options/main.ts',
      title: 'Options'
    }
  },
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
        if (process.env.NODE_ENV === 'development') {
          manifest.content_security_policy = "script-src 'self' 'unsafe-eval' http://localhost:8098; object-src 'self'"
        }

        return manifest
      }
    }
  },
  chainWebpack: (config) => {
    // adambullmer/vue-cli-plugin-browser-extension 的默认webextension-polyfill处理方法和
    // webextension-polyfill-ts 存在冲突，会导致browser对象失效（为空）
    // 为了提供ts支持，参照 https://github.com/adambullmer/vue-cli-plugin-browser-extension#browser-polyfills 移除内置支持方法
    config.plugins.delete('provide-webextension-polyfill')
    config.module.rules.delete('provide-webextension-polyfill')
  }
}
