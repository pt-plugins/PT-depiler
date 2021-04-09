import { SiteMetadata } from '@/shared/interfaces/sites'

export const siteMetadata: SiteMetadata = {
  name: 'JoyHD',
  schema: 'NexusPHP',
  description: 'JoyHD成立於2013年，發佈藍光原碟，藍光DIY和原抓音樂。',
  url: 'https://www.joyhd.net',
  tags: ['影视', '综合'],
  collaborator: 'ylxb2016',
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { name: 'Movie', value: 401 },
          { name: 'TV Series', value: 402 },
          { name: 'Entertainment', value: 403 },
          { name: 'Anime', value: 405 },
          { name: 'Music', value: 414 },
          { name: 'Sport', value: 407 },
          { name: 'Documentaries', value: 404 },
          { name: 'MV', value: 406 },
          { name: 'Software', value: 408 },
          { name: 'Game', value: 410 },
          { name: 'e-Learn', value: 411 },
          { name: 'Other', value: 409 }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    userInfo: {
      bonus: {
        selector: ["td.rowhead:contains('银元') + td"]
      }
    }
  }

}
