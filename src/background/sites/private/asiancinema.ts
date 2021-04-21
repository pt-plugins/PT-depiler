import { SiteMetadata } from '@/shared/interfaces/sites'

export const siteMetadata: SiteMetadata = {
  name: 'AsianCinema',
  timezoneOffset: '+0000',
  description: '综合',
  url: 'https://asiancinema.me/',
  tags: ['综合'],
  schema: 'Unit3D',
  selector: {
    userInfo: {
      uploaded: { selector: ["span[title='Upload']", "span[title='上传']"] },
      downloaded: { selector: ["span[title='Download']", "span[title='下载']"] },
      bonus: { selector: ["a[title='My Bonus Points']", "a[title='我的魔力']"] },
      seeding: { selector: ["span[title='Seeding']", "span[title='做种']"] }
    }
  }
}
