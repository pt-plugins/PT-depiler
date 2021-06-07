import { SiteMetadata } from '@/shared/interfaces/sites';
import { findThenParseNumberString, parseSizeString } from '@/shared/utils/filter';
import dayjs from '@/shared/utils/dayjs';

const parseUpDl = (element: HTMLElement) => {
  const sizeString = element.nextSibling!.textContent!.trim();
  return parseSizeString(sizeString);
};

interface snatchListResponseData {
  aaData: [
    string, // "<a id=\"ddddddd\" class=\"torrent_name\" href=\"/torrent/ddddddd\">xxxxxxxxxxx </a>"
    string, // Size
    string, // Snatched
    string, // Downloaded
    string, // Uploaded
    string, // Ratio
    number, // Announcements
    number, // Completed
    string// Active
  ][],
  iTotalDisplayRecords: number,
  iTotalRecords: number,
  sEcho: number
}

export const siteMetadata: SiteMetadata = {
  name: 'PussyTorrents',
  timezoneOffset: '+0000',
  description: 'PussyTorrents is a Semi-Private Torrent Tracker for 3X',
  url: 'https://pussytorrents.org/',
  tags: ['xxx'],
  search: {
    keywordsParam: 'query',
    requestConfig: {
      url: '/torrents/browse'
    }
  },

  userInfo: {
    process: [
      {
        requestConfig: { url: '/' },
        fields: ['name', 'uploaded', 'downloaded', 'messageCount']
      },
      {
        requestConfig: { url: '/profile/$userName$' },
        assertion: { name: 'userName' },
        fields: ['id', 'levelName', 'joinTime']
      },
      {
        requestConfig: {
          method: 'post',
          url: '/user/account/snatchlist',
          responseType: 'json',
          params: {
            // userID: '$user.id$', 自动添加的，所以注释掉
            sEcho: 0, // 请求次数
            iColumns: 9,
            sColumns: ',,,,,,,,',
            iDisplayStart: '0',
            iDisplayLength: -1, // 直接请求所有做种信息
            // 下面是一连串不知道做啥的参数，就先留着.....
            mDataProp_0: '0',
            sSearch_0: '',
            bRegex_0: 'false',
            bSearchable_0: 'true',
            bSortable_0: 'true',
            mDataProp_1: '1',
            sSearch_1: '',
            bRegex_1: 'false',
            bSearchable_1: 'true',
            bSortable_1: 'true',
            mDataProp_2: '2',
            sSearch_2: '',
            bRegex_2: 'false',
            bSearchable_2: 'true',
            bSortable_2: 'true',
            mDataProp_3: '3',
            sSearch_3: '',
            bRegex_3: 'false',
            bSearchable_3: 'true',
            bSortable_3: 'true',
            mDataProp_4: '4',
            sSearch_4: '',
            bRegex_4: 'false',
            bSearchable_4: 'true',
            bSortable_4: 'true',
            mDataProp_5: '5',
            sSearch_5: '',
            bRegex_5: 'false',
            bSearchable_5: 'true',
            bSortable_5: 'true',
            mDataProp_6: '6',
            sSearch_6: '',
            bRegex_6: 'false',
            bSearchable_6: 'true',
            bSortable_6: 'true',
            mDataProp_7: '7',
            sSearch_7: '',
            bRegex_7: 'false',
            bSearchable_7: 'true',
            bSortable_7: 'true',
            mDataProp_8: '8',
            sSearch_8: '',
            bRegex_8: 'false',
            bSearchable_8: 'true',
            bSortable_8: 'true',
            sSearch: '',
            bRegex: 'false',
            iSortCol_0: '0',
            sSortDir_0: 'desc',
            iSortingCols: '1'
          }, // 这里把请求参数都塞到 params中完全没问题，因为 transferPostData 会把他们都塞入 data 中的23333
          headers: {
            'x-requested-with': 'XMLHttpRequest'
          },
          transferPostData: 'params'
        },
        assertion: { id: 'userID' },
        fields: ['seeding', 'seedingSize']
      }
    ]
  },

  selector: {
    search: {
      rows: { selector: 'table#torrenttable > tbody > tr:has(a[href^="/download/"])' },
      id: { selector: 'a[href^="/torrent/"]', attr: 'href', filters: [findThenParseNumberString] },
      title: { selector: 'a[href^="/torrent/"]' },
      url: { selector: 'a[href^="/torrent/"]', attr: 'href' },
      link: { selector: 'a[href^="/download/"]', attr: 'href' },
      time: { selector: 'span.subnote', filters: [(query: string) => query.replace('Added on ', '')] },
      size: { selector: 'td:nth-last-child(5)' },
      author: { selector: 'td:nth-last-child(1)' },
      category: { text: 'ALL' },
      seeders: { selector: 'td:nth-last-child(3)' },
      leechers: { selector: 'td:nth-last-child(2)' },
      completed: { selector: 'td:nth-last-child(4)', filters: [findThenParseNumberString] },
      comments: { selector: 'a[href*="#comments"]' }
    },
    userInfo: {
      // page: '/',
      name: {
        selector: "#memberBar .span8 a[href*='/profile/']"
      },
      uploaded: {
        selector: "#memberBar .span8 span[title='Uploaded']",
        elementProcess: [parseUpDl]
      },
      downloaded: {
        selector: "#memberBar .span8 span[title='Downloaded']",
        elementProcess: [parseUpDl]
      },
      messageCount: {
        text: 0,
        selector: "a[href='/users/messages'] i.news-notify",
        elementProcess: [() => 255]
      },
      // page: '/profile/$user.name$',
      id: {
        selector: 'a[href="#snatchlist"]',
        data: 'userid'
      },
      levelName: {
        selector: "#profileTable td:contains('Class') + td"
      },
      joinTime: {
        selector: "#profileTable td:contains('Join Date') + td",
        filters: [
          (query: string) => {
            console.log(query);
            return dayjs(query.split(' ').slice(1).join(' '), 'Do MMMM YYYY').valueOf();
          }
        ]
      },
      // url: '/user/account/snatchlist',
      seeding: { selector: 'iTotalRecords' },
      seedingSize: {
        selector: 'aaData',
        filters: [
          (aaData: snatchListResponseData['aaData']) => {
            let seedingSize = 0;
            aaData.forEach(data => {
              seedingSize += parseSizeString(data[1]);
            });
            return seedingSize;
          }
        ]

      }
    }
  }
};
