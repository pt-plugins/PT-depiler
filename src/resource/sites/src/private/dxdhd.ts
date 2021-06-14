import { ISiteMetadata } from '../../types';

export const siteMetadata: ISiteMetadata = {
  name: 'DXDHD',
  timezoneOffset: '+0000',
  description: '综合',
  url: 'https://dxdhd.com/',
  tags: ['综合'],
  schema: 'Unit3D',
  search: {
    categories: [
      {
        name: 'Category',
        key: 'categories',
        options: [
          { value: 1, name: 'Movies' },
          { value: 2, name: 'TV' },
          { value: 3, name: 'Music' },
          { value: 4, name: 'Anime' },
          { value: 5, name: 'Software & Apps' },
          { value: 6, name: 'e-books' },
          { value: 7, name: 'Games' },
          { value: 8, name: 'Sports' },
          { value: 9, name: 'Others' },
          { value: 10, name: 'XXX' }
        ],
        cross: { mode: 'raw' }
      }
    ]
  }
};
