const path = require('path');
const packageInfo = require('./package.json');
const git = require('git-rev-sync');
const webpack = require('webpack');

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

module.exports = {
  pages: {
    options: {
      template: 'public/options.html',
      entry: './src/options/main.ts',
      title: "PTPP Next",
    },
    offscreen: {
      template: 'public/offscreen.html',
      entry: './src/offscreen/main.ts',
    }
  },

  productionSourceMap: !IS_PROD, // https://cli.vuejs.org/config/#productionsourcemap
  lintOnSave: !IS_PROD, // https://cli.vuejs.org/config/#lintonsave

  // https://cli.vuejs.org/config/#pluginoptions
  pluginOptions: {
    browserExtension: {
      modesToZip: false,
      componentOptions: {
        background: {
          entry: 'src/background/background.ts',
        },
        contentScripts: {
          entries: {
            'content-script': ['src/content-scripts/content-script.ts'],
          },
        },
      },
      manifestTransformer: (manifest) => {
        // rewrite version to add Build number (simple from git count)
        const build_number = git.count() % 65535;
        manifest.version = `${packageInfo.version}.${build_number}`;

        if (!IS_PROD) {
          manifest.description += ' (Development Mode)';
        }

        // Add git detail in manifest when build
        manifest.git = {
          short: git.short(),
          date: git.date(),
          count: git.count(),
          branch: git.branch()
        }

        return manifest;
      },
    },
    i18n: {
      localeDir: './shared/locales', // start from './src'
      enableLegacy: false,
      compositionOnly: true,
      runtimeOnly: IS_PROD,
      fullInstall: true,
    },
  },

  configureWebpack: {
    devtool: 'cheap-module-source-map',
    performance: {
      hints: false,
    },
    resolve: {
      fallback: {
        buffer: require.resolve('buffer/'),
        url: false,
        path: require.resolve('path-browserify'),
        http: false,
        https: false,
        querystring: false,
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },

  chainWebpack: (config) => {
    // @see https://github.com/adambullmer/vue-cli-plugin-browser-extension/issues/106
    // config.plugins.delete('provide-webextension-polyfill');
    // config.module.rules.delete('provide-webextension-polyfill');

    // @see https://github.com/intlify/vue-cli-plugin-i18n/issues/204
    config.module
      .rule('i18n-resource')
      .include.clear()
      .add(path.resolve(__dirname, './src/shared/locales'))
      .end();

    // Change image build for vue-cli
    // 1. add support for .ico assert
    // 2. change site and downloader icons to sub-folder
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|avif|ico)(\?.*)?$/)
      .set('type', 'asset/resource')
      .set('generator', {
        filename: (pathData) => {
          if (pathData.filename.includes('packages/site/src/icons')) {
            return 'img/site/[name][ext]';
          } else if (pathData.filename.includes('packages/downloader/src/icons')) {
            return 'img/downloader/[name][ext]';
          } else {
            return 'img/[name][ext]';
          }
        },
      })
  },
};
