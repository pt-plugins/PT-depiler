import { SiteMetadata } from '@/shared/interfaces/sites'
import { selectorSearchProgress, selectorSearchStatus } from '@/background/sites/private/tjupt'

export const siteMetadata: SiteMetadata = {
  name: '伊甸园',
  description: '这里是伊甸园 让我们赤裸坦诚相见',
  url: 'https://pt.hdbd.us',
  tags: ['综合', 'XXX'],
  schema: 'NexusPHP',
  selector: {
    search: {
      // FIXME 这个站基于TJUPT，所以 progress, status 两个选择器直接套用，但未测试过
      progress: selectorSearchProgress,
      status: selectorSearchStatus
    }
  }
}
