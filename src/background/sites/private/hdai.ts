/**
 * Edit From: https://github.com/IndeedSi/PT-Plugin-Plus/commit/2265c40783b1eb1f5bc28db478f4ba909a5e655f
 */
import { searchFilter, SiteMetadata } from '@/shared/interfaces/sites';
import NexusPHP from '@/background/sites/schema/NexusPHP';
import { AxiosRequestConfig } from 'axios';
import { isEmpty } from 'lodash-es';

const categoriesMap = {
  1: '电影Movies',
  2: '电视剧TV Series',
  3: '综艺TV Shows',
  4: '纪录片Documentaries',
  5: '动漫Animations',
  6: '音乐视频Music Videos',
  7: '体育Sports',
  8: '音乐Music',
  9: '电子书Ebook',
  10: '软件Software',
  11: '游戏Game',
  12: '资料Education',
  13: '旅游Travel',
  14: '美食Food',
  15: '其他Misc'
};

export const siteMetadata: SiteMetadata = {
  name: 'HDAI',
  timezoneOffset: '+0800',
  schema: 'NexusPHP',
  url: 'https://www.hd.ai/',
  tags: ['影视'],
  collaborator: ['indeedsi'],
  search: {
    requestConfig: {
      method: 'POST',
      url: '/Torrents.tableList',
      responseType: 'json'
    }
  },
  selector: {
    search: {
      rows: { selector: 'data.items' },
      id: { selector: 'id', filters: [] }, // 同样需要覆盖掉NPHP默认的filters
      title: { selector: 'name' },
      subTitle: { selector: 'small_descr' },
      url: { selector: 'details', filters: [] },
      link: { selector: 'download', filters: [] },
      time: { selector: 'added' },
      size: { selector: 'size' },
      author: {
        selector: '_owner',
        filters: [
          (query: string) => /<a/.test(query) ? (query.match(/>(.+?)</) || ['', ''])[1] : query
        ]
      },
      category: {
        selector: 'category',
        // elementProcess: [],  // 这里不需要，因为JSON返回不调用 elementProcess，直接进入 filters 处理
        filters: [
          // @ts-ignore
          (query: string) => categoriesMap[query]
        ]
      },
      seeders: { selector: 'seeders' },
      leechers: { selector: 'leechers' },
      completed: { selector: 'times_completed' },
      comments: { selector: 'comments' }
    }
  }
};

export default class hdai extends NexusPHP {
  // FIXME 此处仅处理了 keywords，对于其他信息未作处理（因为未为该站添加 category 信息
  protected async transformSearchFilter (filter: searchFilter): Promise<AxiosRequestConfig> {
    const config: AxiosRequestConfig = {};

    const searchParams: any = {};
    if (filter.keywords) {
      searchParams.keyword = filter.keywords;
    }

    // 将其转到 config.params 中
    const params = new URLSearchParams([['page', '1'], ['limit', '100']]);
    if (!isEmpty(searchParams)) {
      params.set('searchParams', JSON.stringify(searchParams));
    }
    config.data = params;

    return config;
  }
}
