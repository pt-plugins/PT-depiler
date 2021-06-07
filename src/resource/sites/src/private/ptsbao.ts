/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import { SiteMetadata } from '@/shared/interfaces/sites';

export const siteMetadata: SiteMetadata = {
  name: '烧包',
  timezoneOffset: '+0800',
  schema: 'NexusPHP',
  url: 'https://ptsbao.club/',
  description: '烧包 - 扬帆远航 风雨同路',
  tags: ['影视', '综合'],
  collaborator: ['laizony', 'ted423'],
  selector: {
    userInfo: {
      messageCount: {
        selector: ["td[style*='background: indigo'] a[href*='messages.php']"]
      },
      levelName: {
        selector: ["td.rowhead:contains('等级') + td b b"],
        attr: null // 覆写掉NPHP基类的 attr: 'title' 属性，这样就可以让后续读 innerText 而不是 attr
      }
    }
  }
};
