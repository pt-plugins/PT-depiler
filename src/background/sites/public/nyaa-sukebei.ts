import Nyaa, { siteConfig as NyaaSiteConfig } from './nyaa'
import { SiteConfig } from '@/shared/interfaces/sites'

export const siteConfig: SiteConfig = {
  ...NyaaSiteConfig,
  name: 'Nyaa Sukebei',
  url: 'https://sukebei.nyaa.si/',
  categories: [
    {
      name: 'Filter',
      key: 'f',
      options: [
        { name: 'No filter', value: '0' },
        { name: 'No remakes', value: '1' },
        { name: 'Trusted only', value: '2' }
      ],
      cross: false
    },
    {
      name: 'Category',
      key: 'c',
      options: [
        { name: 'All categories', value: '0_0' },
        { name: 'Art', value: '1_0' },
        { name: 'Art - Anime', value: '1_1' },
        { name: 'Art - Doujinshi', value: '1_2' },
        { name: 'Art - Games', value: '1_3' },
        { name: 'Art - Manga', value: '1_4' },
        { name: 'Art - Pictures', value: '1_5' },
        { name: 'Real Life', value: '2_0' },
        { name: 'Real Life - Pictures', value: '2_1' },
        { name: 'Real Life - Videos', value: '2_2' }
      ],
      cross: false
    }

  ]
}

export default class NyaaSukebei extends Nyaa {
  protected readonly siteConfig = siteConfig;
}
