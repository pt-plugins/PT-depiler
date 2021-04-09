import { SiteMetadata } from '@/shared/interfaces/sites'
import { ETorrentStatus } from '@/shared/interfaces/enum'

export const siteMetadata: SiteMetadata = {
  name: 'OurBits',
  schema: 'NexusPHP',
  url: 'https://ourbits.club/',
  description: '综合性网站，有分享率要求',
  tags: ['影视', '动漫', '纪录片', '综艺'],
  collaborator: 'Rhilip',
  legacyUrl: [
    'https://www.ourbits.club/'
  ],
  search: {
    categories: [
      {
        name: '类别',
        key: 'cat',
        options: [
          { name: 'Movies', value: 401 },
          { name: 'Movies-3D', value: 402 },
          { name: 'Concert', value: 419 },
          { name: 'TV-Episode', value: 412 },
          { name: 'TV-Pack', value: 405 },
          { name: 'TV-Show', value: 413 },
          { name: 'Documentary', value: 410 },
          { name: 'Animation', value: 411 },
          { name: 'Sports', value: 415 },
          { name: 'Music-Video', value: 414 },
          { name: 'Music', value: 416 }
        ],
        cross: { mode: 'append' }
      },
      {
        name: '媒介',
        key: 'medium',
        options: [
          { name: 'UHD Blu-ray', value: 12 },
          { name: 'FHD Blu-ray', value: 1 },
          { name: 'Remux', value: 3 },
          { name: 'Encode', value: 7 },
          { name: 'WEB-DL', value: 9 },
          { name: 'HDTV', value: 5 },
          { name: 'DVD', value: 2 },
          { name: 'CD', value: 8 }
        ],
        cross: { mode: 'append' }
      },
      {
        name: '编码',
        key: 'codec',
        options: [
          { name: 'H.264', value: 12 },
          { name: 'HEVC', value: 14 },
          { name: 'MPEG-2', value: 15 },
          { name: 'VC-1', value: 16 },
          { name: 'Xvid', value: 17 },
          { name: 'Other', value: 18 }
        ],
        cross: { mode: 'append' }
      },
      {
        name: '音频编码',
        key: 'audiocodec',
        options: [
          { name: 'Atmos', value: 14 },
          { name: 'DTS X', value: 21 },
          { name: 'DTS-HDMA', value: 1 },
          { name: 'TrueHD', value: 2 },
          { name: 'DTS', value: 4 },
          { name: 'LPCM', value: 5 },
          { name: 'FLAC', value: 13 },
          { name: 'APE', value: 12 },
          { name: 'AAC', value: 7 },
          { name: 'AC3', value: 6 },
          { name: 'WAV', value: 11 },
          { name: 'MPEG', value: 32 }
        ],
        cross: { mode: 'append' }
      },
      {
        name: '分辨率',
        key: 'standard',
        options: [
          { name: 'SD', value: 4 },
          { name: '720p', value: 3 },
          { name: '1080i', value: 2 },
          { name: '1080p', value: 1 },
          { name: '2160p', value: 5 }
        ],
        cross: { mode: 'append' }
      },
      {
        name: '地区',
        key: 'processing',
        options: [
          { name: 'CN(中国大陆)', value: 1 },
          { name: 'US/EU(欧美)', value: 2 },
          { name: 'HK/TW(港台)', value: 3 },
          { name: 'JP(日)', value: 4 },
          { name: 'KR(韩)', value: 5 },
          { name: 'OT(其他)', value: 6 }
        ],
        cross: { mode: 'append' }
      },
      {
        name: '制作组',
        key: 'team',
        options: [
          { name: 'OurBits', value: 1 },
          { name: 'PbK', value: 2 },
          { name: 'OurTV', value: 12 },
          { name: 'iLoveTV', value: 42 },
          { name: 'FLTTH', value: 46 },
          { name: 'Ao', value: 47 },
          { name: 'MGs', value: 48 },
          { name: 'OurPad', value: 3 },
          { name: 'HosT', value: 18 },
          { name: 'iLoveHD', value: 31 },
          { name: '原创/原抓', value: 41 }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      progress: {
        selector: 'div.progressBar > div',
        attr: 'style',
        filters: [
          (query: string) => {
            const progressMatch = query.match(/width:.?(\d.+)%/)
            return progressMatch && progressMatch.length >= 2 ? parseFloat(progressMatch[1]) : 0
          }
        ]
      },
      status: {
        selector: 'div.progressBar > div',
        attr: 'title',
        filters: [
          (query: string) => {
            const progressStatusMatch = query.match(/(\d.+)% (进行中|未开始)/)
            if (progressStatusMatch && progressStatusMatch.length >= 3) {
              const progress = parseFloat(progressStatusMatch[1])
              const status = progressStatusMatch[2]

              if (status === '进行中') {
                return progress < 100 ? ETorrentStatus.downloading : ETorrentStatus.seeding
              } else { // if (status === '未开始')
                return progress < 100 ? ETorrentStatus.inactive : ETorrentStatus.completed
              }
            }
            return ETorrentStatus.unknown
          }
        ]
      },
      tags: [
        { selector: 'div.tag.tag-gf', name: '官方', color: '#1C86EE' },
        { selector: 'div.tag.tag-diy', name: 'DIY', color: '#FC9014' },
        { selector: 'div.tag.tag-sf', name: '首发', color: '#e01d65' },
        { selector: 'div.tag.tag-gy', name: '国语', color: '#3e93a0' },
        { selector: 'div.tag.tag-zz', name: '中字', color: '#426ab9' },
        { selector: 'div.tag.tag-yq', name: '应求', color: '#9932CC' },
        { selector: 'div.tag.tag-jz', name: '禁转', color: '#C12E2A' },
        { selector: 'div.tag.tag-bd', name: '蓝光', color: '#000' }, // 不明，这个标签已经不做使用
        { selector: 'div.tag.tag-db', name: '杜比视界', color: '#000000' },
        { selector: 'div.tag.tag-hdr10', name: 'HDR10', color: '#38b03f' },
        { selector: 'div.tag.tag-hdr10p', name: 'HDR10+', color: '#336633' },
        { selector: 'div.tag.tag-hlg', name: 'HLG', color: '#009F00' }
      ]
    }
  }
}
