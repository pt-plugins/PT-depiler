/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import { ISiteMetadata } from '../../types';
import { selectorSearchStatus } from './hdchina';

export const siteMetadata: ISiteMetadata = {
  name: 'BTSCHOOL',
  schema: 'NexusPHP',
  description: '汇聚每一个人的影响力',
  url: 'https://pt.btschool.club/',
  tags: ['影视', '综合'],
  selector: {
    search: {
      progress: {
        selector: ['.progress:eq(0) > div'],
        attr: 'style',
        filters: [
          (query: string) => {
            const queryMatch = query.match(/width:([ \d.]+)%/);
            return (queryMatch && queryMatch.length >= 2) ? parseFloat(queryMatch[1]) : 0;
          }
        ]
      },
      status: selectorSearchStatus
    }
  }
};
