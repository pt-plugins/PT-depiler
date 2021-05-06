/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import { SiteMetadata } from '@/shared/interfaces/sites';

export const siteMetadata: SiteMetadata = {
  name: 'DiscFan',
  url: 'https://discfan.net/',
  tags: ['影视', '港片'],
  schema: 'NexusPHP',
  formerHosts: [
    'pt.gztown.net'
  ],
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 401, name: '中国大陆' },
          { value: 404, name: '中国香港特别行政区' },
          { value: 405, name: '中国台湾省' },
          { value: 402, name: '泰国' },
          { value: 403, name: '日本' },
          { value: 406, name: '韩国' },
          { value: 410, name: '世界' },
          { value: 411, name: '剧集' },
          { value: 414, name: '音乐' },
          { value: 413, name: '记录' },
          { value: 416, name: '综艺' },
          { value: 417, name: '体育' }
        ],
        cross: { mode: 'append' }
      }
    ]
  }
};
