const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

module.exports = {
  pages: {
    options: {
      template: 'public/browser-extension.html',
      entry: './src/options/main.ts',
      title: 'Options'
    }
  },

  transpileDependencies: [
    'vuetify'
  ],

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
          manifest.content_security_policy = "script-src 'self' 'unsafe-eval' http://localhost:8098; object-src 'self'";
        }

        return manifest;
      }
    }
  },

  chainWebpack: config => {
    // @see https://github.com/adambullmer/vue-cli-plugin-browser-extension/issues/106
    config.plugins.delete('provide-webextension-polyfill');
    config.module.rules.delete('provide-webextension-polyfill');
  }
};
