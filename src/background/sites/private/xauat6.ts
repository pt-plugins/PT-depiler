/**
 * FIXME 这个站离线很久了，没法测试
 * Rhilip, 2021.04.11
 */
import { SiteMetadata } from '@/shared/interfaces/sites'

export const siteMetadata: SiteMetadata = {
  name: '溪涧草堂PT',
  description: '以热播电影，热播剧集，热播综艺为主，纪录，动漫，GTV，资料等资源为辅，多方面地为用户提供丰富的资源下载',
  url: 'http://pt.xauat6.edu.cn/',
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
          { value: 403, name: '纪录' },
          { value: 404, name: '资料' },
          { value: 405, name: '综艺' },
          { value: 406, name: 'MV' },
          { value: 407, name: '音乐' },
          { value: 408, name: '动漫' },
          { value: 409, name: '软件' },
          { value: 410, name: '体育' },
          { value: 421, name: '游戏' },
          { value: 424, name: '游戏视频' },
          { value: 422, name: '其他' }
        ],
        cross: { mode: 'append' }
      }
    ]
  }
}
