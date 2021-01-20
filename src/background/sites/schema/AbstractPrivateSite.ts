// 适用于PT站点
import { UserInfo } from '@/shared/interfaces/sites'
import { AxiosResponse } from 'axios'
import { BittorrentSite } from '@/background/sites/schema/AbstractBittorrentSite'

export abstract class PrivateSite extends BittorrentSite {
  // noinspection JSUnusedGlobalSymbols
  /**
   * 获得当前站点最新的用户信息用于更新
   */
  abstract getUserInfo(): Promise<UserInfo> ;

  abstract ping (): Promise<boolean> ;

  /**
   * 这是一个比较通用的检查是否登录方法，如果不行请考虑覆写扩展
   * @param {AxiosResponse} res
   */
  protected loggedCheck (res: AxiosResponse): boolean {
    const request = res.request as XMLHttpRequest
    if (/login|verify|checkpoint|returnto/ig.test(request.responseURL)) {
      return false // 检查最终的URL看是不是需要登陆
    } else if (res.headers.refresh && /\d+; url=.+(login|verify|checkpoint|returnto).+/ig.test(res.headers.refresh)) {
      return false // 检查responseHeader有没有重定向
    } else {
      const responseText = request.responseText
      if (typeof responseText === 'undefined') {
        return false // 检查最终的Text，如果什么都没有也可能说明需要登陆
      } else if (responseText.length < 800 && /login|not authorized/.test(responseText)) {
        return false // 对Text进行检查，断言 “过短，且中间出现login等字段“ 说明可能需要登陆
      }
    }
    return true
  }
}
