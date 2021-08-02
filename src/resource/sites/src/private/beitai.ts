/**
 * FIXME 无号，未进行测试
 * Rhilip, 2021.04.09
 */
import { ISiteMetadata } from '../../types';
import { selectorSearchProgress, selectorSearchStatus } from './hdhome';

export const siteMetadata: ISiteMetadata = {
  name: '备胎',
  schema: 'NexusPHP',
  url: 'https://www.beitai.pt/',
  description: '找不到家时，接纳无家可归的人',
  tags: ['综合'],
  collaborator: ['wyx1818', 'tongyifan'],
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 401, name: 'Movies' },
          { value: 404, name: 'Documentaries' },
          { value: 405, name: 'Animations' },
          { value: 402, name: 'TV Series' },
          { value: 403, name: 'TV Shows' },
          { value: 406, name: 'Music Videos' },
          { value: 407, name: 'Sports' },
          { value: 409, name: 'Misc' },
          { value: 408, name: 'HQ Audio' }
        ],
        cross: { mode: 'append' }
      }
    ],
    imdbTransformer: (config) => {
      config.params.search_area = 1; // params "&search_area=1"
      return config;
    },
    selectors: {
      progress: selectorSearchProgress,
      status: selectorSearchStatus
    }
  }
};
