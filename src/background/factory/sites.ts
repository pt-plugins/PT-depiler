import { SiteConfig, ISiteMetadata } from '@ptpp/sites/types';
import BittorrentSite from '@/resource/sites/src/schema/AbstractBittorrentSite';
import PrivateSite from '@/resource/sites/src/schema/AbstractPrivateSite';
import Container from '@ptpp/utils/class/container';

type supportModuleType = 'schema' | 'public' | 'private'
type siteName = `${supportModuleType}/${string}`

class Sites extends Container {
  private readonly _supportList: {
    [key in supportModuleType | 'all']: string[]
  } = { private: [], public: [], schema: [], all: [] };

  constructor () {
    super();

    /**
     * 使用 require.context 动态获取所有private, public, schema 方法
     * 注意，设置的mode是weak，意味着我们不能使用 context('moduleA') 的方法获取模块
     * 但这样也方便我们后续使用 Dynamic import 的相关特性来构造 webpackChunkName
     * @refs: https://github.com/webpack/webpack/issues/9184
     *
     */
    const context = require.context('@/resource/sites/src/', true, /\.ts$/, 'weak');
    context.keys().forEach(value => {
      const moduleName = value.replace(/^\.\//, '').replace(/\.ts$/, '');

      if (!moduleName.startsWith('schema/Abstract')) { // 'schema/Abstract' 不应该被任何形式的导入和引用，也不会被构造
        const [_type, site] = moduleName.split('/');
        this._supportList[_type as supportModuleType].push(site);
        this._supportList.all.push(moduleName);
      }
    });
  }

  // FIXME 对module进行限制
  async dynamicImport (module: string) {
    return await import(
      /* webpackInclude: /\.ts/ */
      /* webpackChunkName: "lib/sites/[request]" */
      /* webpackMode: "lazy" */
      /* webpackExports: ["default","siteMetadata"] */
      `@/resource/sites/src/${module}`) as {
      default?: PrivateSite | BittorrentSite,
      siteMetadata: ISiteMetadata
    };
  }

  // FIXME
  isSupport (moduleType: supportModuleType, siteName: string) : boolean {
    return this._supportList[moduleType].includes(siteName);
  }

  // FIXME userConfig should be typed
  async getSite (siteName: siteName, userConfig: Partial<SiteConfig> = {}): Promise<PrivateSite | BittorrentSite> {
    return await this.resolveObject<PrivateSite | BittorrentSite>(`site-${siteName}`, async () => {
      // FIXME 部分用户自定义的站点（此时在 js/site 目录中不存在对应模块），不能进行 dynamicImport 的情况，对此应该直接从 schema 中导入
      const module = await this.dynamicImport(siteName);
      let { siteMetadata: siteMetaData /* use as const */, default: SiteClass } = module;
      if (!siteMetaData.schema) {
        siteMetaData.schema = siteName.startsWith('private') ? 'AbstractPrivateSite' : 'AbstractBittorrentSite';
      }

      /**
       * 如果该模块没有导出 default class，那么我们认为我们需要从基类继承
       * 并覆写基类的的 siteMetaData 信息
       */
      if (!SiteClass) {
        const schemaModule = await this.dynamicImport(`schema/${siteMetaData.schema}`);
        SiteClass = schemaModule.default;
      }

      // @ts-ignore
      return new SiteClass(userConfig, siteMetaData);
    });
  }
}

// 单例模式
export default new Sites();
