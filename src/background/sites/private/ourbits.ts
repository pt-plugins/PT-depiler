import { SiteMetadata } from '@/shared/interfaces/sites'

export const siteMetadata: SiteMetadata = {
  name: 'OurBits',
  baseModule: 'NexusPHP',
  url: 'https://ourbits.club/',
  description: '综合性网站，有分享率要求',
  tags: ['影视', '动漫', '纪录片', '综艺'],
  selector: {
    search: {
      progress: {
        selector: 'div.progressBar > div',
        attr: 'style',
        filters: [
          (query: string) => {
            const progressMatch = query.match(/width:.?(\d.+)%/)
            return progressMatch && progressMatch.length >= 2 ? progressMatch[1] : null
          }
        ]
      }
      // FIXME status
    }
  }
}
