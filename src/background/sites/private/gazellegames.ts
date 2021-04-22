import { SiteMetadata } from '@/shared/interfaces/sites'
import { ETorrentStatus } from '@/shared/interfaces/enum'
import { parseSizeString } from '@/shared/utils/filter'

export const siteMetadata: SiteMetadata = {
  name: 'GGN',
  timezoneOffset: '+0000',
  description: 'Game',
  url: 'https://gazellegames.net/',
  tags: ['Game'],
  schema: 'Gazelle',
  collaborator: 'ted423',
  selector: {
    search: {
      //
      time: { selector: '> td:eq(1)' },
      size: { selector: '> td:eq(3)' },
      seeders: { selector: '> td:eq(5)' },
      leechers: { selector: '> td:eq(6)' },
      completed: { selector: '> td:eq(4)' },
      comments: { text: 0 },
      author: { selector: '> td:eq(2)' },

      category: {
        selector: ':self',
        elementProcess: [
          (element: HTMLElement) => {
            let groupElement = element
            while (true) {
              groupElement = groupElement.previousElementSibling as HTMLElement
              if (!groupElement || groupElement.classList.contains('group')) {
                break
              }
            }

            if (groupElement && groupElement.querySelector('td.cats_col > div[title]')) {
              return groupElement.querySelector('td.cats_col > div[title]')!.getAttribute('title')!
            } else {
              return 'Other'
            }
          }
        ]
      },

      progress: {
        selector: ['#color_seeding, #color_snatched', '#color_leeching, #color_downloaded'],
        switchFilters: [
          () => 100,
          () => 0
        ]
      },
      status: {
        selector: ['#color_seeding', '#color_snatched', '#color_leeching', '#color_downloaded'],
        switchFilters: [
          () => ETorrentStatus.seeding,
          () => ETorrentStatus.completed,
          () => ETorrentStatus.downloading,
          () => ETorrentStatus.inactive
        ]
      }
    },
    userInfo: {
      // "page": "/index.php",
      messageCount: {
        selector: ['.newnoti']
      },

      // "page": "/user.php?id=$user.id$",
      uploaded: {
        selector: ['#upload .stat.tooltip'],
        filters: [
          (query: string) => parseSizeString(query.replace(/,/g, ''))
        ]
      },
      downloaded: {
        selector: ['#download .stat.tooltip'],
        filters: [
          (query: string) => parseSizeString(query.replace(/,/g, ''))
        ]
      },
      bonus: {
        selector: ['#gold .stat.tooltip']
      },
      joinTime: {
        selector: ['.box_personal_history ul.stats li:nth-child(2) span.time']
      },
      seeding: {
        selector: ['#seeding']
      },
      seedingSize: {
        selector: ['#seeding_size'],
        filters: [
          (query: string) => parseSizeString(query.replace(/,/g, ''))
        ]
      }
    }
  }
}
