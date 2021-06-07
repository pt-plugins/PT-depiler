/**
 * FIXME 未进行测试
 * Rhilip, 2021.04.11
 */
import { SiteMetadata } from '@/shared/interfaces/sites';

export const siteMetadata: SiteMetadata = {
  name: '蝴蝶-HUDBT',
  timezoneOffset: '+0800',
  url: 'https://hudbt.hust.edu.cn/',
  tags: ['教育网', '影视', '综合'],
  schema: 'NexusPHP',
  collaborator: 'Rhilip',
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        // FIXME 由于目前配置问题，不能在配置文件中做到大分类，可能需要用户自定义
        options: [
          // 电影 cat1=1&cat401=1&cat413=1&cat414=1&cat415=1&cat430=1
          { value: 401, name: '大陆电影' },
          { value: 413, name: '港台电影' },
          { value: 414, name: '亚洲电影' },
          { value: 415, name: '欧美电影' },
          { value: 430, name: 'iPad' },
          { value: 433, name: '抢先视频' },
          // 剧集 cat2=1&cat402=1&cat417=1&cat416=1&cat418=1
          { value: 402, name: '大陆剧集' },
          { value: 417, name: '港台剧集' },
          { value: 416, name: '亚洲剧集' },
          { value: 418, name: '欧美剧集' },
          // 纪录片 cat9=1&cat404=1
          { value: 404, name: '纪录片' },
          // 体育 cat7=1&cat407=1
          { value: 407, name: '体育' },
          // 综艺 cat5=1&cat403=1&cat419=1&cat420=1&cat421=1
          { value: 403, name: '大陆综艺' },
          { value: 419, name: '港台综艺' },
          { value: 420, name: '亚洲综艺' },
          { value: 421, name: '欧美综艺' },
          // 音乐 cat8=1&cat408=1&cat422=1&cat423=1&cat424=1&cat425=1
          { value: 408, name: '华语音乐' },
          { value: 422, name: '日韩音乐' },
          { value: 423, name: '欧美音乐' },
          { value: 424, name: '古典音乐' },
          { value: 425, name: '原声音乐' },
          // MV cat11=1&cat406=1
          { value: 406, name: '音乐MV' },
          // 资料 cat409=1
          { value: 409, name: '其他' },
          { value: 412, name: '学习' },
          // 电子书 cat12=1&cat432=1
          { value: 432, name: '电子书' },
          // 动漫 cat3=1&cat405=1&cat427=1&cat428=1&cat429=1
          { value: 405, name: '完结动漫' },
          { value: 427, name: '连载动漫' },
          { value: 428, name: '剧场OVA' },
          { value: 429, name: '动漫周边' },
          // 游戏 cat4=1&cat410=1&cat431=1
          { value: 410, name: '游戏' },
          { value: 431, name: '游戏视频' },
          // 软件 cat10=1&cat411=1&cat426=1
          { value: 411, name: '软件' },
          { value: 426, name: 'MAC' },
          // 华中科技大学 cat13=1&cat1037=1
          { value: 1037, name: 'HUST' }
        ],
        cross: { mode: 'append' }
      }
    ]
  }

};
