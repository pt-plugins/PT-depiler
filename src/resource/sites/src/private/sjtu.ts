import { SiteMetadata } from '@/shared/interfaces/sites';
import NexusPHP from '../schema/NexusPHP';
import { ETorrentStatus } from '@/shared/interfaces/enum';

export const siteMetadata: SiteMetadata = {
  name: '葡萄',
  description: 'Free Share, Join us',
  url: 'https://pt.sjtu.edu.cn/',
  tags: ['教育网', '影视', '综合'],
  schema: 'NexusPHP',
  collaborator: 'Rhilip',
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 401, name: '华语电影' },
          { value: 402, name: '欧美电影' },
          { value: 403, name: '亚洲电影' },
          { value: 406, name: '纪录片' },
          { value: 407, name: '港台电视剧' },
          { value: 408, name: '亚洲电视剧' },
          { value: 409, name: '大陆电视剧' },
          { value: 410, name: '欧美电视剧' },
          { value: 411, name: '大陆综艺节目' },
          { value: 412, name: '港台综艺节目' },
          { value: 413, name: '欧美综艺节目' },
          { value: 414, name: '日韩综艺节目' },
          { value: 420, name: '华语音乐' },
          { value: 421, name: '日韩音乐' },
          { value: 422, name: '欧美音乐' },
          { value: 423, name: '原声音乐' },
          { value: 425, name: '古典音乐' },
          { value: 426, name: 'mp3合辑' },
          { value: 427, name: 'Music Videos' },
          { value: 429, name: '游戏' },
          { value: 431, name: '动漫' },
          { value: 432, name: '体育' },
          { value: 434, name: '软件' },
          { value: 435, name: '学习' },
          { value: 440, name: 'mac' },
          { value: 451, name: '校园原创' },
          { value: 450, name: '其他' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      progress: {
        selector: ['td.snatched_no_yes, td.snatched_yes_yes', 'td.snatched_no_no, td.snatched_yes_no'],
        attr: 'class',
        filters: [
          (query: string) => {
            switch (true) {
              case /snatched_(no|yes)_yes/.test(query):
                return 100;
              case /snatched_(no|yes)_no/.test(query):
              default:
                return 0;
            }
          }
        ]
      },
      status: {
        selector: ['td.snatched_no_yes, td.snatched_yes_yes', 'td.snatched_no_no, td.snatched_yes_no'],
        attr: 'class',
        filters: [
          (query: string) => {
            switch (true) {
              case /snatched_(no|yes)_yes/.test(query):
                return ETorrentStatus.seeding;
              case /snatched_(no|yes)_no/.test(query):
                return ETorrentStatus.inactive;
              default:
                return ETorrentStatus.unknown;
            }
          }
        ]
      }
    }
  }
};

export default class sjtu extends NexusPHP {
  protected async requestUserSeedingPage (userId: number, type: string = 'seeding'): Promise<string | null> {
    const { data } = await this.request<string>({
      url: '/viewusertorrents.php',
      params: { id: userId, show: type }
    });
    return data || null;
  }
}
