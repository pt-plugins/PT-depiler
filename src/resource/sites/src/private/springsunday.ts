import { ISiteMetadata, ETorrentStatus } from '../../types';

export const siteMetadata: ISiteMetadata = {
  name: 'SSD',
  description: 'Classic Movie Compression Team',
  url: 'https://springsunday.net/',
  tags: [
    '影视',
    '音乐',
    '综合'
  ],
  schema: 'NexusPHP',
  formerHosts: [
    'hdcmct.org'
  ],
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 501, name: 'Movies(电影)' },
          { value: 502, name: 'TV Series(剧集)' },
          { value: 503, name: 'Docs(纪录)' },
          { value: 504, name: 'Animations(动画)' },
          { value: 505, name: 'TV Shows(综艺)' },
          { value: 506, name: 'Sports(体育)' },
          { value: 507, name: 'MV(音乐视频)' },
          { value: 508, name: 'Music(音乐)' },
          { value: 509, name: 'Others(其他)' }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      // FIXME 我觉得旧版的 progress, status 获取方法实现并不好
      progress: {
        selector: ["a[id*='subscription'] > img"],
        elementProcess: (element: HTMLElement) => {
          if (element.classList.contains('uploading')) {
            return 100;
          } else if (element.classList.contains('downloading')) {
            const title = element.getAttribute('title') || '';
            const titleMatch = title.match(/(\d.+)%/);
            return (titleMatch && titleMatch.length >= 2) ? parseFloat(titleMatch[1]) : 0;
          } else {
            return 0;
          }
        }
      },
      status: {
        selector: ["a[id*='subscription'] > img"],
        elementProcess: (element: HTMLElement) => {
          if (element.classList.contains('uploading')) {
            return ETorrentStatus.seeding;
          } else if (element.classList.contains('downloading')) {
            return ETorrentStatus.downloading;
          } else {
            return ETorrentStatus.unknown;
          }
        }
      }
    },
    userInfo: {
      messageCount: {
        selector: ["a[href*='messages.php'][style*='background: red']"]
      }
    }
  }
};
