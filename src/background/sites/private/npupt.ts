import { SiteMetadata } from '@/shared/interfaces/sites'
import urlparse from 'url-parse'

const timeRegex = /\d{4}-\d{2}-\d{2}[^\d]+?\d{2}:\d{2}:\d{2}/

export const siteMetadata: SiteMetadata = {
  name: 'NPUBits',
  description: '界面独具一格的教育网站点',
  url: 'https://npupt.com/',
  tags: ['教育网', '综合'],
  schema: 'NexusPHP',
  collaborator: ['Rhilip', 'xfl03'],
  search: {
    categories: [
      {
        name: '类型',
        key: 'cat',
        options: [
          { name: '资料', value: 411 },
          { name: '电影', value: 401 },
          { name: '动漫', value: 405 },
          { name: '剧集', value: 402 },
          { name: '综艺', value: 403 },
          { name: '体育', value: 407 },
          { name: '纪录', value: 404 },
          { name: '音乐', value: 414 },
          { name: 'MV', value: 406 },
          { name: '软件', value: 408 },
          { name: '游戏', value: 410 },
          { name: '校园', value: 412 },
          { name: '其他', value: 409 }
        ],
        cross: { mode: 'append' }
      }
    ]
  },
  selector: {
    search: {
      rows: { selector: '#torrents_table > tbody > tr:gt(0)' },
      title: {
        selector: "a[href*='hit']:eq(0)",
        elementProcess: [
          (element: HTMLElement) => {
            return element.getAttribute('title') || element.innerText
          }
        ]
      },
      subTitle: {
        selector: 'table.torrentname td.embedded > span:last()',
        elementProcess: [
          (element: HTMLElement) => {
            return element.getAttribute('title') || element.innerText
          }
        ]
      },
      id: { selector: 'a[href^="details"]' },
      url: { selector: 'a[href^="details"]' },
      link: {
        selector: 'a[href^="details"]',
        filters: [
          (query: string) => query
            .replace('details', 'download')
            .replace('&hit=1', '') +
            '&trackerssl=1' // 强制SSL
        ]
      },
      time: {
        selector: 'div.small',
        elementProcess: [
          (element: HTMLElement) => {
            if (timeRegex.test(element.innerHTML)) {
              return ((element.innerHTML.match(timeRegex) || ['0000-00-00 00:00:00'])[0]).trim()
            }
            return 0
          }
        ]
      },
      size: { selector: '.rowfollow.vcenter.nowrap > center' },
      seeders: { selector: '.rowfollow.vcenter.nowrap span.badge:eq(0)' },
      leechers: { selector: '.rowfollow.vcenter.nowrap span.badge:eq(1)' },
      completed: { selector: "a[href^='viewsnatches.php?id=']" },
      comments: { selector: "a[href$='#startcomments']" },
      category: { selector: 'div.category_text' }

    },

    userInfo: {
      id: {
        selector: "span#curuser a[href*='userdetails.php'][class*='Name']:first",
        attr: 'href',
        filters: [
          (query: string) => {
            return urlparse(query, true).query.id
          }
        ]
      },
      name: {
        selector: ["span#curuser a[href*='userdetails.php'][class*='Name']:first"]
      },

      // "/userdetails.php?id=$user.id$"
      uploaded: { selector: ["td.rowfollow:contains('分享率')", "td.rowhead:contains('传输') + td"] }, // 不覆蓋filter
      downloaded: { selector: ["td.rowfollow:contains('分享率')", "td.rowhead:contains('传输') + td"] }, // 不覆蓋filter
      levelName: {
        selector: ["td.rowhead:contains('等級') + td > img, td.rowhead:contains('等级') + td > img"],
        attr: 'title'
      },
      bonus: { selector: ["td.rowhead:contains('沙粒') + td"] }
    }
  }
}
