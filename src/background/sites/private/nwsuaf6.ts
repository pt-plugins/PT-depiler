import { SiteMetadata } from '@/shared/interfaces/sites';

export const siteMetadata: SiteMetadata = {
  name: '麦田PT',
  description: '西北农林科技大学ipv6资源分享平台',
  url: 'https://pt.nwsuaf6.edu.cn/',
  tags: ['教育网', '影视', '综合'],
  schema: 'NexusPHP',
  collaborator: 'Rhilip',
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 401, name: '电影' },
          { value: 402, name: '剧集' },
          { value: 403, name: '综艺' },
          { value: 405, name: '动漫' },
          { value: 414, name: '音乐' },
          { value: 407, name: '体育' },
          { value: 404, name: '纪录片' },
          { value: 406, name: 'MV' },
          { value: 408, name: '软件' },
          { value: 410, name: 'PC游戏' },
          { value: 411, name: '学习' },
          { value: 423, name: '原创' },
          { value: 409, name: '其他' }
        ],
        cross: { mode: 'append' }
      }
    ]
  }
};
