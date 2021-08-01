import { ISearchFilter, ISiteMetadata, ITorrent } from '../../types';
import PrivateSite from '../schema/AbstractPrivateSite';
import { AxiosRequestConfig } from 'axios';
import urlencode from 'urlencode';

export const siteMetadata: ISiteMetadata = {
  name: '六维空间',
  description: '东北大学ipv6资源分享平台',
  timezoneOffset: '+0800',
  url: 'http://bt.neu6.edu.cn/',
  tags: ['教育网', '综合'],
  collaborator: ['xfl03', 'Rhilip'],
  search: {
    selectors: {
      rows: { selector: 'table.dt tr:gt(0):not(:has( > td:eq(1):contains("0 Bytes")))' }, // 先用一种较为简单的方法排除掉非种子文件
      id: {
        selector: 'td:eq(2) a[href*="thread-"]',
        attr: 'href',
        filters: [
          (query:string) => {
            const queryMatch = query.match(/thread-(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          }
        ]
      },
      title: { selector: 'td:eq(2) a[href*="thread-"]' },
      url: { selector: 'td:eq(2) a[href*="thread-"]', attr: 'href' },
      // link: {}   // 种子链接得从 details 页面抓，走 getTorrentDownloadLink 方法
      time: { selector: 'td.by > em > span' },
      size: { selector: '> td:nth-child(2)' },
      author: { selector: 'td.by > cite > a' },
      category: {
        selector: '> td:nth-child(5) > a',
        attr: 'href',
        filters: [
          (query:string) => {
            const queryMatch = query.match(/forum-(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          }
        ]
      },
      seeders: {
        selector: ' > td:nth-child(1) > img',
        case: { // 情况均为伪造数据，不代表真实情况
          'img[href*="signal_0.png"]': 0,
          'img[href*="signal_1.png"]': 10,
          'img[href*="signal_2.png"]': 50,
          'img[href*="signal_3.png"]': 100,
          'img[href*="signal_4.png"]': 200
        }
      },
      leechers: { text: 0 }, // 没必要构造
      completed: { text: 0 }, // 没必要构造
      comments: { text: 0 }, // 没必要构造
      tags: [
        { name: '50%', selector: 'img[src*="dl50.gif"]' },
        { name: 'Free', selector: 'img[src*="free.gif"]' }
      ]
    }
  },
  userInfo: {
    process: [
      {
        requestConfig: { url: '/forum.php' },
        fields: ['id', 'name']
      },
      {
        requestConfig: {
          url: '/home.php',
          params: {
            mod: 'space',
            do: 'profile'
          }
        },
        assertion: { id: 'uid' },
        fields: ['uploaded', 'downloaded', 'levelName', 'bonus', 'joinTime']
      }
    ],
    selectors: {
      // page: '/forum.php'
      id: {
        selector: ".vwmy a[href*='home.php']:first",
        attr: 'href',
        filters: [{ name: 'querystring', args: ['uid'] }]
      },
      name: {
        selector: ".vwmy a[href*='home.php']:first"
      },
      //  page: '/home.php?mod=space&uid=$user.id$&do=profile',
      uploaded: {
        selector: "li:contains('上传')",
        filters: [{ name: 'parseSize' }]
      },
      downloaded: {
        selector: "li:contains('下载')",
        filters: [{ name: 'parseSize' }]
      },
      levelName: {
        selector: "li:contains('用户组')",
        filters: [(query: string) => query.replace(/用户组 +/, '')]
      },
      bonus: {
        selector: "li:contains('积分')",
        filters: [{ name: 'parseNumber' }]
      },
      joinTime: {
        selector: "li:contains('注册时间')",
        filters: [
          (query: string) => query.replace('注册时间', ''),
          { name: 'parseTime' }
        ]
      }
    }
  }
};

const nonTorrentCategory = [
  129, // 互助教程
  29, // 互助问答
  33, // 悬赏求种
  358, // 悬赏档案馆
  /**
   * 试种区理应当作无法使用的区域
   */
  41, // 新手试种
  156, // 电影剧场试种区
  155, // 电视剧集试种区
  153, // 综艺娱乐试种区
  152, // 体育天地试种区
  154, // 高清MV试种区
  162, // 音乐地带试种区
  147, // 纪录写实试种区
  148, // 卡通动漫试种区
  149, // 游戏天下试种区
  151, // 资料文档试种区
  150, // 软件快跑试种区
  146, // 其他资源试种区

  79, // 互动交流
  96, // 大话体育
  125, // 漫版讨论区
  169, // 软件交流区
  163, // 游戏讨论活动区
  173, // 周年站庆专版
  7, // 六维视界
  4, // 开心灌水
  139, // 爆楼纪念堂
  43, // 有奖活动
  175, // 讨论交流
  136, // 邀请直通
  444, // 官方邀请
  445, // 个人邀请
  38, // 申请事务
  121, // 普通事务档案馆
  131, // 发展建议
  122, // 发展建议档案馆
  39, // 站务公告
  119, // 普通公告档案馆
  31, // 站内投诉
  143, // 站内投诉档案馆
  87, // 播种菜地
  123, // 保种园地
  113, // 美工设计
  135, // 历史故事
  187 // 升级BUG汇报板块
];

export default class neu6 extends PrivateSite {
  protected override async transformSearchFilter (filter: ISearchFilter): Promise<AxiosRequestConfig> {
    const baseConfig: AxiosRequestConfig = {
      url: '/search.php',
      responseType: 'document',
      params: {},
      headers: {}
    };

    // 请求并获取 formhash
    const { data: formDocument } = await this.request<Document>(baseConfig);
    const formhash = this.getFieldData(formDocument, {
      selector: 'input[name="formhash"]',
      attr: 'value'
    });

    // 设置搜索参数
    baseConfig.method = 'post';
    baseConfig.params.mod = 'forum';

    // 因为此处使用 GBK 编码，所以我们不能使用 new URLSearchParams() 来让axios自动构造，所以只能 hack 相关信息
    baseConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    const postData: any = {
      formhash,
      srchuname: '',
      srchfilter: 'all',
      srchfrom: 0,
      before: '',
      orderby: 'lastpost',
      ascdesc: 'desc',
      'srchfid[]': 'all', // 搜索全部板块，具体是不是种子，我们在后面种子构建中进一步筛选
      searchsubmit: 'yes'
    };

    if (filter.keywords) {
      postData.srchtxt = filter.keywords;
    }

    // 要将其转为gbk编码
    baseConfig.data = urlencode.stringify(postData, { charset: 'gbk' });

    return baseConfig;
  }

  protected override async transformSearchPage (doc: Document): Promise<ITorrent[]> {
    const torrents = await super.transformSearchPage(doc);

    return torrents.filter(t => !nonTorrentCategory.includes(t.category! as number));
  }

  /**
   * 6v这里有两种情况，如果用户等级为up以上，则直接返回种子信息，
   * 反之则会进入提示页面，需要在提示页面进一步获取种子链接
   * 但是我们又不能在此处获取种子的metadata，所以只能根据页面是否存在 下载浮云 提示来判断具体情况
   *
   * @ref: https://github.com/tongyifan/Reseed-backend/blob/db8b25fd336f820a7469d588a9bbd8185d7e17b9/scripts/6v.py#L46-L67
   * @param torrent
   */
  override async getTorrentDownloadLink (torrent: ITorrent): Promise<string> {
    const { data: DetailPage, config: RequestConfig } = await this.request<Document>({
      url: torrent.url,
      responseType: this.config.detail?.type || 'document'
    });

    let downloadLink = this.getFieldData(DetailPage, {
      selector: 'p.attnm > a[href*="forum.php?mod=attachment"]:contains(".torrent")',
      attr: 'href'
    });

    // 检查是不是需要下载浮云
    if (/下载积分.+?浮云/.test(DetailPage.documentElement.outerHTML)) {
      const { data: attachmentPage } = await this.request<Document>({
        url: downloadLink,
        responseType: 'document'
      });
      downloadLink = this.getFieldData(attachmentPage, {
        selector: 'p.alert_btnleft > a[href*="forum.php?mod=attachment"]',
        attr: 'href'
      });
    }

    return this.fixLink(downloadLink, RequestConfig);
  }
}
