import { SiteMetadata } from '@/shared/interfaces/sites'

export const siteMetadata: SiteMetadata = {
  name: '百川PT',
  description: '校内10兆高速下载，优质高清资源共享！',
  url: 'https://www.hitpt.com/',
  tags: ['教育网', '影视', '综合'],
  schema: 'NexusPHP',
  host: 'www.hitpt.com',
  formerHosts: [
    'pt.ghtt.net'
  ],
  collaborator: 'tongyifan',
  search: {
    categories: [
      {
        name: '分区',
        key: '#changePath',
        options: [
          { name: '影视', value: '/torrents.php' },
          { name: '综合', value: '/music.php' /* 太NB了 */ }
        ]
      },
      {
        name: '影视分类',
        key: 'cat',
        options: [
          { value: 401, name: '高清电影' },
          { value: 402, name: '高清剧集' },
          { value: 403, name: '抢鲜或标清' },
          { value: 405, name: '动漫' },
          { value: 407, name: '体育' },
          { value: 413, name: '纪录片' },
          { value: 416, name: '综艺' },
          { value: 415, name: 'MV' }
        ]
      },
      {
        name: '综合分类',
        key: 'cat',
        notes: '请先在“分类”中选择综合，才能使用该分类',
        options: [
          { value: 411, name: '电子文档' },
          { value: 406, name: '音乐' },
          { value: 408, name: '工程软件' },
          { value: 404, name: '教学视频' },
          { value: 410, name: '游戏' },
          { value: 409, name: '其他' }
        ]
      }
    ]
  }
}
