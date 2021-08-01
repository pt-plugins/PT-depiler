/**
 * 旧版直接迁移，未测试Gazelle模板匹配性
 * Rhilip, 2021.4.22
 */
import { ISiteMetadata } from '../../types';

export const siteMetadata: ISiteMetadata = {
  name: 'GFXPeers',
  timezoneOffset: '+0000',
  url: 'https://gfxpeers.net/',
  schema: 'Gazelle',
  tags: ['设计', '素材'],
  collaborator: 'bimzcy',
  feature: {
    skipImdbSearch: true
  }
};
