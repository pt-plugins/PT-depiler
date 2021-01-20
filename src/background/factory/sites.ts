import { BittorrentSite } from '@/background/sites/schema/AbstractBittorrentSite'
import { PrivateSite } from '@/background/sites/schema/AbstractPrivateSite'
import Container from '@/shared/class/container'

type supportModuleType = 'schema' | 'public' | 'private'

class Sites extends Container {
  private readonly _supportList: {
    [key in supportModuleType | 'all']: string[]
  } = { private: [], public: [], schema: [], all: [] };

  constructor () {
    super()

    /**
     * 使用 require.context 动态获取所有private, public, schema 方法
     * 注意，设置的mode是weak，意味着我们不能使用 context('moduleA') 的方法获取模块
     * 但这样也方便我们后续使用 Dynamic import 的相关特性来构造 webpackChunkName
     * @refs: https://github.com/webpack/webpack/issues/9184
     *
     */
    const context = require.context('@/background/sites/', true, /\.ts$/, 'weak')
    context.keys().forEach(value => {
      const moduleName = value.replace(/^\.\//, '').replace(/\.ts$/, '')

      if (moduleName !== 'schema/Abstract') { // 'schema/Abstract' 不应该被任何形式的导入和引用，也不会被构造
        const [_type, site] = moduleName.split('/')
        this._supportList[_type as supportModuleType].push(site)
        this._supportList.all.push(moduleName)
      }
    })
  }

  // FIXME 对module进行限制
  async dynamicImport (module: string) {
    return await import(
      /* webpackInclude: /\.ts/ */
      /* webpackChunkName: "lib/sites/[request]" */
      /* webpackMode: "lazy" */
      /* webpackExports: ["default","siteMetadata"] */
      `@/background/sites/${module}`) as {
      default: PrivateSite | BittorrentSite,
    }
  }

  // FIXME
  isSupport (moduleType: supportModuleType, siteName: string) : boolean {
    return this._supportList[moduleType].includes(siteName)
  }

  // FIXME
  async getSite (siteName: string): Promise<PrivateSite | BittorrentSite> {
    return await this.resolveObject<PrivateSite | BittorrentSite>(`site-${siteName}`, async () => {
      const module = await this.dynamicImport(siteName)
      return module.default
    })
  }
}

export default new Sites()
