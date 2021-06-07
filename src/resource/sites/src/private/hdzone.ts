/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import { SiteMetadata } from '@/shared/interfaces/sites';

export const siteMetadata: SiteMetadata = {
  name: 'HDZone',
  url: 'https://hdzone.me/',
  tags: ['电影'],
  schema: 'NexusPHP',
  collaborator: 'ian',
  selector: {
    search: {
      progress: {
        selector: ['> td:eq(8)'],
        filters: [
          (query: string) => query === '-' ? 0 : parseFloat(query)
        ]
      }
    }
  }
};
