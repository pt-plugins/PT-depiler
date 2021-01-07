import { BittorrentSite, PrivateSite } from '@/background/sites/schema/base'
import Container from '@/shared/class/container'

function getModuleNameSpaceFromContextList (arr: string[]) {
  return arr.map(key => {
    return key.replace('.ts', '').replace('./', '')
  })
}

class Sites extends Container {
  private readonly _supportSchema: string[];
  private readonly _supportSites: string[];

  constructor () {
    super()

    // 动态获得所有支持的站点和站点模板
    const SchemaContext = require.context('@/background/sites/schema/', false, /\.ts$/, 'weak')
    const SiteContext = require.context('@/background/sites/', false, /\.ts$/, 'weak')

    this._supportSchema = getModuleNameSpaceFromContextList(SchemaContext.keys()).filter(t => t !== 'base')
    this._supportSites = getModuleNameSpaceFromContextList(SiteContext.keys())
  }

  async dynamicImport (siteName: string) {
    return await import(
      /* webpackChunkName: "lib/sites/[request]" */
      /* webpackMode: "lazy" */
      `@/background/sites/${siteName}`) as {
      default: PrivateSite | BittorrentSite,
    }
  }

  isValidSchemaName (schemaName: string): boolean {
    return this._supportSchema.includes(schemaName)
  }

  isValidSiteName (siteName: string): boolean {
    return this._supportSites.includes(siteName)
  }

  async getSite (siteName: string): Promise<PrivateSite | BittorrentSite> {
    return await this.resolveObject<PrivateSite | BittorrentSite>(`site-${siteName}`, async () => {
      const module = await this.dynamicImport(siteName)
      return module.default
    })
  }
}

export default new Sites()
