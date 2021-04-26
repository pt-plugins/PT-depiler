import { ElementQuery, SiteMetadata } from '@/shared/interfaces/sites'
import { ETorrentStatus } from '@/shared/interfaces/enum'

// HDHOME 中的 selector.search.progress 以及 selector.search.status 被其他站公用
export const selectorSearchProgress: ElementQuery = {
  selector: ['> td:eq(8)'],
  filters: [
    (query: string) => query === '-' ? 0 : parseFloat(query)
  ]
}

export const selectorSearchStatus: ElementQuery = {
  selector: ['> td:eq(8)'],
  filters: [
    (query:string) => {
      if (query === '-') {
        return ETorrentStatus.unknown
      } else {
        const process = parseFloat(query)
        switch (true) {
          case /Noseed|未做种/.test(query):
            return process >= 100 ? ETorrentStatus.completed : ETorrentStatus.inactive
          case /Seeding|做种中/.test(query):
            return ETorrentStatus.seeding
          case /Leeching|下载中/.test(query):
            return ETorrentStatus.downloading
          default:
            return ETorrentStatus.unknown
        }
      }
    }
  ]
}

export const siteMetadata: SiteMetadata = {
  name: 'HDHome',
  schema: 'NexusPHP',
  url: 'https://hdhome.org/',
  tags: ['影视', '综合'],
  collaborator: 'tongyifan',
  search: {
    categories: [
      {
        name: '分区',
        key: '#changePath',
        options: [
          { name: '种子区', value: '/torrents.php' },
          { name: 'LIVE区', value: '/live.php' }
        ]
      },
      {
        name: '类别',
        key: 'cat',
        options: [
          { value: 411, name: 'Movies SD' },
          { value: 412, name: 'Movies IPad' },
          { value: 413, name: 'Movies 720p' },
          { value: 414, name: 'Movies 1080p' },
          { value: 415, name: 'Movies REMUX' },
          { value: 450, name: 'Movies Bluray' },
          { value: 499, name: 'Movies UHD Blu-ray' },
          { value: 416, name: 'Movies 2160p' },
          { value: 417, name: 'Doc SD' },
          { value: 418, name: 'Doc IPad' },
          { value: 419, name: 'Doc 720p' },
          { value: 420, name: 'Doc 1080p' },
          { value: 421, name: 'Doc REMUX' },
          { value: 451, name: 'Doc Bluray' },
          { value: 500, name: 'Doc UHD Blu-ray' },
          { value: 422, name: 'Doc 2160p' },
          { value: 423, name: 'TVMusic 720p' },
          { value: 424, name: 'TVMusic 1080i' },
          { value: 425, name: 'TVShow SD' },
          { value: 426, name: 'TVShow IPad' },
          { value: 471, name: 'TVShow IPad' },
          { value: 427, name: 'TVShow 720p' },
          { value: 428, name: 'TVShow 1080i' },
          { value: 429, name: 'TVShow 1080p' },
          { value: 430, name: 'TVShow REMUX' },
          { value: 452, name: 'TVShows Bluray' },
          { value: 431, name: 'TVShow 2160p' },
          { value: 432, name: 'TVSeries SD' },
          { value: 433, name: 'TVSeries IPad' },
          { value: 434, name: 'TVSeries 720p' },
          { value: 435, name: 'TVSeries 1080i' },
          { value: 436, name: 'TVSeries 1080p' },
          { value: 437, name: 'TVSeries REMUX' },
          { value: 453, name: 'TVSereis Bluray' },
          { value: 438, name: 'TVSeries 2160p' },
          { value: 502, name: 'TVSeries 4K Bluray' },
          { value: 439, name: 'Musics APE' },
          { value: 440, name: 'Musics FLAC' },
          { value: 441, name: 'Musics MV' },
          { value: 442, name: 'Sports 720p' },
          { value: 443, name: 'Sports 1080i' },
          { value: 444, name: 'Anime SD' },
          { value: 445, name: 'Anime IPad' },
          { value: 446, name: 'Anime 720p' },
          { value: 447, name: 'Anime 1080p' },
          { value: 448, name: 'Anime REMUX' },
          { value: 454, name: 'Anime Bluray' },
          { value: 409, name: 'Misc' },
          { value: 449, name: 'Anime 2160p' },
          { value: 501, name: 'Anime UHD Blu-ray' }
        ],
        cross: { mode: 'append' }
      },
      {
        name: '类别（LIVE区）',
        key: 'cat',
        notes: '请先在“分区”中选择LIVE区，才能正确使用该分类',
        options: [
          { value: 494, name: 'Movies Bluray' },
          { value: 495, name: 'Doc Bluray' },
          { value: 469, name: 'TVMusic 1080i' },
          { value: 472, name: 'TVShow 720p' },
          { value: 473, name: 'TVShow 1080i' },
          { value: 474, name: 'TVShow 1080p' },
          { value: 475, name: 'TVShow REMUX' },
          { value: 496, name: 'TVShows Bluray' },
          { value: 476, name: 'TVShow 2160p' },
          { value: 477, name: 'TVSeries SD' },
          { value: 478, name: 'TVSeries IPad' },
          { value: 479, name: 'TVSeries 720p' },
          { value: 480, name: 'TVSeries 1080p' },
          { value: 481, name: 'TVSeries REMUX' },
          { value: 497, name: 'TVSereis Bluray' },
          { value: 482, name: 'TVSeries 2160p' },
          { value: 483, name: 'Musics APE' },
          { value: 484, name: 'Musics FLAC' },
          { value: 485, name: 'Musics MV' },
          { value: 486, name: 'Sports 720p' },
          { value: 487, name: 'Sports 1080i' },
          { value: 488, name: 'Anime SD' },
          { value: 489, name: 'Anime IPad' },
          { value: 490, name: 'Anime 720p' },
          { value: 491, name: 'Anime 1080p' },
          { value: 492, name: 'Anime REMUX' },
          { value: 498, name: 'Anime Bluray' },
          { value: 493, name: 'Anime 2160p' }
        ]
      }
    ]
  },
  selector: {
    search: {
      progress: selectorSearchProgress,
      status: selectorSearchStatus,
      tags: [
        { selector: 'img.hitandrun', name: 'H&R', color: '#000' },
        { selector: 'span.tgf', name: '官方', color: '#06c' },
        { selector: 'span.tyc', name: '原创', color: '#085' },
        { selector: 'span.tgz', name: '官字', color: '#530' },
        { selector: 'span.tdb', name: 'Dolby Vision', color: '#358' },
        { selector: 'span.thdr10', name: 'HDR10', color: '#9a3' },
        { selector: 'span.thdrm', name: 'HDR10+', color: '#9b5' },
        { selector: 'span.tgy', name: '国配', color: '#f96' },
        { selector: 'span.tyy', name: '粤配', color: '#f66' },
        { selector: 'span.tzz', name: '中字', color: '#9c0' },
        { selector: 'span.tjz', name: 'Excl.' }, // 禁转
        { selector: 'span.txz', name: '限转', color: '#c03' },
        { selector: 'span.tdiy', name: 'DIY', color: '#993' },
        { selector: 'span.tsf', name: '首发', color: '#339' },
        { selector: 'span.tyq', name: '应求', color: '#f90' },
        { selector: 'span.tm0', name: '零魔', color: '#096' }
      ]
    }
  }
}
