import { SiteMetadata } from '@/shared/interfaces/sites';
import { ETorrentStatus } from '@/shared/interfaces/enum';
import NexusPHP from '../schema/NexusPHP';
import { findThenParseSizeString } from '@/shared/utils/filter';

const levelMap = {
  0: '堕落者(Peasant)',
  1: '天使(Angel)',
  2: '大天使(Power Angel)',
  3: '权天使(Elite Angel)',
  4: '能天使(Crazy Angel)',
  5: '力天使(Insane Angel)',
  6: '主天使(Veteran Angel)',
  7: '座天使(Extreme Angel)',
  8: '智天使(Ultimate Angel)',
  9: '炽天使(Master Angel)',
  10: '壕(VIP)',
  11: '隐天使(Retiree)',
  12: '射种天使(Uploader)',
  13: '论坛版主(Forum Moderator)',
  14: '总版主(Moderator)',
  15: '管理员(Administrator)',
  16: '守护天使(Sysop)',
  17: '市长(Mayor)'
};

export const siteMetadata: SiteMetadata = {
  name: 'HDCity',
  schema: 'NexusPHP',
  url: 'https://hdcity.city/',
  tags: ['综合', '影视'],
  legacyUrl: [
    'https://hdcity.leniter.org/',
    'https://hdcity.work/',
    'http://hdcity4.leniter.org/' // IPv4
  ],
  collaborator: 'waldens',
  search: {
    requestConfig: {
      url: '/pt',
      params: {
        v: 'legacyinv' // 强行设置统一的返回界面样式，方便后面解析
      }
    },
    keywordsParam: 'iwannaseethis',
    categories: [
      {
        name: '分类',
        key: 'cat',
        options: [
          { value: 401, name: 'Movies/电影' },
          { value: 402, name: 'Series/剧集' },
          { value: 404, name: 'Doc/档案记录' },
          { value: 405, name: 'Anim/动漫' },
          { value: 403, name: 'Shows/节目' },
          { value: 406, name: 'MV/音乐视频' },
          { value: 407, name: 'Sports/体育' },
          { value: 408, name: 'Audio/音频' },
          { value: 727, name: 'XXX/家长指引' },
          { value: 728, name: 'Edu/文档/教材' },
          { value: 729, name: 'Soft/软件' },
          { value: 409, name: 'Other/其他' }
        ]
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: 'div.text > table, div.text_alt > table, div.tr_review > table, div.tr_inpro > table' },
      title: { selector: "span[style='color:#777']" },
      subTitle: { selector: 'a.torname' },
      id: { selector: ['a[href^=download]'], attr: 'href' },
      link: { selector: ['a[href^=download]'], attr: 'href' },
      url: { selector: ['a.torname'], attr: 'href' },
      time: { selector: ['td:nth-child(8)'] },
      size: {
        selector: ["nobr:contains('B')"],
        filters: [findThenParseSizeString]
      },
      seeders: { selector: ["a[href*='#seeders'] font"] },
      leechers: {
        selector: ["a[href*='#leechers']"],
        elementProcess: [
          (element: HTMLElement) => element.childNodes[1].textContent || 0
        ]
      },
      completed: {
        selector: ["a[href^='viewsnatches']:first"],
        elementProcess: [
          (element: HTMLElement) => element.childNodes[1].textContent || 0
        ]
      },
      progress: {
        selector: ['div.pbo div.pbc.sd, div.pbo div.pbc.ns, .pbo div.pbc.dl'],
        elementProcess: [
          (element: HTMLElement) => {
            if (element.classList.contains('sd') || element.classList.contains('ns')) {
              return 100;
            } else if (element.classList.contains('dl')) {
              const queryMatch = (element.getAttribute('style') || '').match(/width:([ \d.]+)%/);
              return (queryMatch && queryMatch.length >= 2) ? parseFloat(queryMatch[1]) : 0;
            } else {
              return 0;
            }
          }
        ]
      },
      status: {
        selector: ['div.pbo div.pbc.sd', 'div.pbo div.pbc.ns', '.pbo div.pbc.dl'],
        elementProcess: [
          (element: HTMLElement) => {
            if (element.classList.contains('sd')) {
              return ETorrentStatus.seeding;
            } else if (element.classList.contains('ns')) {
              return ETorrentStatus.completed;
            } else if (element.classList.contains('dl')) {
              return ETorrentStatus.inactive;
            } else {
              return ETorrentStatus.unknown;
            }
          }
        ]
      }
    },
    userInfo: {
      id: {
        selector: ["div.text:contains('ID'):first"],
        attr: null, // 覆盖掉NPHP默认的属性，使得我们能获取文本
        filters: [
          (query: string) => {
            const queryMatch = query.match(/\d+/);
            return (queryMatch && queryMatch.length >= 1) ? parseInt(queryMatch[0]) : 0;
          }
        ]
      },
      name: {
        selector: ["a[href*='userdetails'] > strong:first"]
      },
      uploaded: {
        selector: ["div.text:contains('上传量')", "div.text:contains('上傳量')", "div.text:contains('Uploaded')"]
      },
      downloaded: {
        selector: ["div.text:contains('下载量')", "div.text:contains('下載量')", "div.text:contains('Downloaded')"]
      },
      levelName: {
        selector: "img[src*='/pic/class/']",
        attr: 'src',
        filters: [
          (query: string) => {
            const queryMatch = query.match(/\/pic\/class\/(\d+).gif/)!;
            /**
             * 注意虽然我们前面在定义 levelMap 使用 number 作为键值，但由于 JS 的特性，
             * 使用对应数值字面量，同样也能访问到我们需要的等级信息
             */
            // @ts-ignore
            return levelMap[queryMatch[1]];
          }
        ]
      },
      bonus: {
        selector: ["div.text:contains('魅力值')", "div.text:contains('Karma'):contains('Points')"]
      },
      messageCount: {
        selector: ["li > a[href='messages']"]
      },
      joinTime: {
        selector: ["div.text:contains('加入日期')", "div.text:contains('Join'):contains('date')"],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(?:加入日期|Join date)\s+(.*)\s\(/);
            return (queryMatch && queryMatch.length >= 2) ? queryMatch[1] : 0;
          }
        ]
      }
    }
  }
};

export default class hdcity extends NexusPHP {
  // FIXME 这会导致第一次请求时出现两次 /userdetails 页面请求，不过问题不大2333
  protected async getUserIdFromSite (): Promise<number> {
    const userDetailDocument = await this.requestUserDetailsPage(null);
    const userId = this.getFieldData(userDetailDocument, this.config.selector?.userInfo?.id!);
    return parseInt(userId);
  }

  protected async requestUserDetailsPage (userId: number | null): Promise<Document> {
    const { data: userDetailDocument } = await this.request<Document>({
      url: '/userdetails',
      // params: { id: userId },  // 该站点请求自己信息时可以不带入用户id
      responseType: 'document',
      checkLogin: true
    });
    return userDetailDocument;
  }

  protected async requestUserSeedingPage (userId: number, type: string = 'seeding'): Promise<string | null> {
    const { data } = await this.request<string>({
      url: '/getusertorrentlistajax',
      params: { userid: userId, type }
    });
    return data || null;
  }
}
