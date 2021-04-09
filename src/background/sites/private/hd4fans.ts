import { SiteMetadata } from '@/shared/interfaces/sites'

export const siteMetadata: SiteMetadata = {
  name: 'HD4FANS',
  baseModule: 'NexusPHP',
  url: 'https://pt.hd4fans.org',
  description: '', // TODO 简介缺失待补
  tags: ['影视', '兽组'],
  collaborator: ['lilungpo', 'tongyifan'],
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 401, name: '电影' },
          { value: 404, name: '纪录片' },
          { value: 405, name: '动漫' },
          { value: 402, name: '电视剧' },
          { value: 403, name: '综艺' },
          { value: 406, name: 'MV' },
          { value: 407, name: '体育' },
          { value: 409, name: '其它' },
          { value: 408, name: '音轨' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      progress: {
        selector: ["div[class='progressarea'] > div"],
        attr: 'style',
        filters: [
          (q: string) => (q.match(/(\d+(?:\.\d+)?)%/) || [0, 0])[1]
        ]
      }
    }
  }
}
