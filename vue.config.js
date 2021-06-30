const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const packageInfo = require('./package.json');

module.exports = {
  pages: {
    options: {
      template: 'public/options.html',
      entry: './src/options/main.ts',
      title: packageInfo.archiverName
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
          manifest.description += ' (Development Mode)';
          manifest.content_security_policy = "script-src 'self' 'unsafe-eval' http://localhost:8098; object-src 'self'";
        }

        return manifest;
      }
    },
    i18n: {
      localeDir: './shared/locales', // start from './src'
      enableLegacy: false,
      compositionOnly: true,
      runtimeOnly: true,
      fullInstall: true
    }
  },

  chainWebpack: config => {
    // @see https://github.com/adambullmer/vue-cli-plugin-browser-extension/issues/106
    config.plugins.delete('provide-webextension-polyfill');
    config.module.rules.delete('provide-webextension-polyfill');
  }
};
