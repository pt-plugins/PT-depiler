import { ISiteMetadata, ETorrentStatus } from '../../types';

export const siteMetadata: ISiteMetadata = {
  name: 'BYRBT',
  schema: 'NexusPHP',
  description: '著名教育网PT站点（仅支持ipv6访问与下载），有10大类资源，资源更新快，保种好。',
  url: 'https://bt.byr.cn/',
  tags: ['教育网', '影视', '综合'],
  collaborator: ['Rhilip'],
  search: {
    categories: [
      {
        name: '类型',
        key: 'cat',
        options: [
          { value: 408, name: '电影' },
          { value: 401, name: '剧集' },
          { value: 404, name: '动漫' },
          { value: 402, name: '音乐' },
          { value: 405, name: '综艺' },
          { value: 403, name: '游戏' },
          { value: 406, name: '软件' },
          { value: 407, name: '资料' },
          { value: 409, name: '体育' },
          { value: 410, name: '纪录' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      status: {
        // 似乎只有一个 已完成能够了解，下载进度等不能明确
        selector: ['img[src="pic/finished.png"]'],
        attr: 'src',
        filters: [
          (query: string) => {
            if (query === 'pic/finished.png') {
              return ETorrentStatus.completed;
            }
            return ETorrentStatus.unknown;
          }
        ]
      }
    }
  }
};
