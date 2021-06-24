import { ISiteMetadata } from '../../types';
import urlparse from 'url-parse';
import { findThenParseSizeString, parseSizeString } from '@ptpp/utils/filter';
import dayjs from '@ptpp/utils/plugins/dayjs';
import Sizzle from 'sizzle';

export const siteMetadata: ISiteMetadata = {
  name: 'BWTorrents',
  timezoneOffset: '+0000',
  description: 'bwtorrents',
  url: 'https://bwtorrents.tv/',
  tags: ['综合', '印度'],
  host: 'bwtorrents.tv',
  search: {
    keywordsParam: 'search',
    requestConfig: {
      url: '/index.php',
      params: {
        incldead: 1, // 1 all, 2 onlydead, 3 free
        blah: 0 // 0 name, 1 descr, 2 both
      }
    },
    categories: [
      {
        name: 'Category',
        key: 'cat',
        options: [
          { value: 113, name: 'Bollywood-Pre-Release' },
          { value: 114, name: 'Bollywood-4K Ultra HD / Upscaled' },
          { value: 115, name: 'Bollywood-Untouched BluRay' },
          { value: 116, name: 'Bollywood-1080p BluRay Rips' },
          { value: 117, name: 'Bollywood-720p BluRay Rips' },
          { value: 118, name: 'Bollywood-Remuxes BluRay' },
          { value: 119, name: 'Bollywood-Untouched WEB-DLs' },
          { value: 120, name: 'Bollywood-1080p WEB-Rips' },
          { value: 188, name: 'Bollywood-720p WEB-Rips' },
          { value: 121, name: 'Bollywood-Untouched DVDs' },
          { value: 189, name: 'Bollywood-Encoded DVDs' },
          { value: 122, name: 'Bollywood-DVDRips 1080p/720p' },
          { value: 123, name: 'Bollywood-SDRips WEB/DVD' },
          { value: 124, name: 'Bollywood-3D-Movies' },
          { value: 190, name: 'Bollywood-Movie packs' },
          { value: 125, name: 'Bollywood-Web Series' },
          { value: 136, name: 'Hollywood-Pre-Release' },
          { value: 126, name: 'Hollywood-4K Ultra HD / Upscaled' },
          { value: 127, name: 'Hollywood-Untouched BluRay' },
          { value: 128, name: 'Hollywood-1080p BluRay Rips' },
          { value: 129, name: 'Hollywood-720p BluRay Rips' },
          { value: 130, name: 'Hollywood-BluRay Remuxes' },
          { value: 131, name: 'Hollywood-Untouched WEB-DLs' },
          { value: 132, name: 'Hollywood-1080p WEB-Rips' },
          { value: 192, name: 'Hollywood-720p WEB-Rips' },
          { value: 133, name: 'Hollywood-Untouched DVDs' },
          { value: 191, name: 'Hollywood-Encoded DVDs' },
          { value: 134, name: 'Hollywood-DVDRips 1080p/720p' },
          { value: 193, name: 'Hollywood-SDRips - WEB/DVD' },
          { value: 135, name: 'Hollywood-3D-Movies' },
          { value: 194, name: 'Hollywood-Movie packs' },
          { value: 137, name: 'Malayalam-Movies' },
          { value: 140, name: 'Punjabi-Movies' },
          { value: 141, name: 'Kannada-Movies' },
          { value: 142, name: 'Lollywood-Movies' },
          { value: 143, name: 'Bhoipuri-Movies' },
          { value: 144, name: 'Marathi-Movies' },
          { value: 145, name: 'Bangla-Movies' },
          { value: 185, name: 'Gujarati-Movies' },
          { value: 184, name: 'South Hindi Dubbed' },
          { value: 183, name: 'English Hindi Dubbed' },
          { value: 197, name: 'Turkish Hindi Dubbed' },
          { value: 182, name: 'Other Movies' },
          { value: 146, name: 'TV-Colors' },
          { value: 147, name: 'TV-TV' },
          { value: 148, name: 'TV-Life OK' },
          { value: 149, name: 'TV-Pakistan Drams' },
          { value: 150, name: 'TV-Sab TV' },
          { value: 151, name: 'TV-Sony' },
          { value: 152, name: 'TV-Star Bharat' },
          { value: 153, name: 'TV-Star Plus' },
          { value: 154, name: 'TV-Zee TV' },
          { value: 186, name: 'TV-Dangal Tv' },
          { value: 218, name: 'TV-Ishara TV' },
          { value: 155, name: 'TV-Sports' },
          { value: 156, name: 'TV-Documentaries' },
          { value: 198, name: 'TV-MTV' },
          { value: 158, name: 'TV-Other Tv Shows' },
          { value: 157, name: 'TV-Hollywood Tv Shows' },
          { value: 195, name: 'TV-Tv Packs' },
          { value: 159, name: 'Music-Religion & Spirituality' },
          { value: 160, name: 'Music-Classical' },
          { value: 172, name: 'Music-Remix' },
          { value: 161, name: 'Music-Flacs' },
          { value: 162, name: 'Music-Ghazals' },
          { value: 163, name: 'Music-Hindi OSTs' },
          { value: 164, name: 'Music-Instrumental' },
          { value: 165, name: 'Music-Kannada' },
          { value: 166, name: 'Music-Lollywood' },
          { value: 167, name: 'Music-Malayalam' },
          { value: 168, name: 'Music-Marathi' },
          { value: 169, name: 'Music-Vvalueeos' },
          { value: 170, name: 'Music-Pop' },
          { value: 171, name: 'Music-Punjabi' },
          { value: 174, name: 'Music-Telugu' },
          { value: 173, name: 'Music-Tamil' },
          { value: 196, name: 'Music-Packs' },
          { value: 175, name: 'Ebooks' },
          { value: 176, name: 'Games PC' },
          { value: 177, name: 'Games Console' },
          { value: 178, name: 'Anime' },
          { value: 179, name: 'Appz' },
          { value: 180, name: 'Mobile Stuff' },
          { value: 181, name: 'Pics/Wallpapers' },
          { value: 187, name: 'Adult XXX 18+' },
          // Telugu-Movies
          { value: 199, name: 'Telgu-Movies | 4K Ultra HD - Upscaled' },
          { value: 200, name: 'Telgu-Movies | Untouched WEB-DLs' },
          { value: 201, name: 'Telgu-Movies | 1080p/720p WEBRips' },
          { value: 202, name: 'Telgu-Movies | Untouched BluRay' },
          { value: 208, name: 'Telgu-Movies | Remuxes BluRay' },
          { value: 207, name: 'Telgu-Movies | BluRay Rips' },
          { value: 203, name: 'Telgu-Movies | Untouched DVDs' },
          { value: 204, name: 'Telgu-Movies | SD-WEBRips / DVDRips' },
          { value: 205, name: 'Telgu-Movies | Movie Packs' },
          // Tamil-Movies
          { value: 209, name: 'Tamil-Movies | 4K Ultra HD - Upscaled' },
          { value: 210, name: 'Tamil-Movies | Untouched WEB-DLs' },
          { value: 211, name: 'Tamil-Movies | 1080p/720p WEBRips' },
          { value: 212, name: 'Tamil-Movies | Untouched BluRay' },
          { value: 217, name: 'Tamil-Movies | Remuxes BluRay' },
          { value: 216, name: 'Tamil-Movies | BluRay Rips' },
          { value: 213, name: 'Tamil-Movies | Untouched DVDs' },
          { value: 214, name: 'Tamil-Movies | SD-WEBRips / DVDRips' },
          { value: 215, name: 'Tamil-Movies | Movie Packs' }
        ]
      }
    ]
  },

  userInfo: {
    pickLast: ['id', 'name'],
    process: [
      {
        requestConfig: { url: '/' },
        fields: ['id', 'name']
      },
      {
        requestConfig: { url: '/userdetailsmore.php' },
        assertion: { id: 'id' },
        fields: ['uploaded', 'downloaded', 'levelName', 'joinTime', 'seeding', 'seedingSize', 'bonus']
      }
    ]
  },

  selector: {
    search: {
      rows: { selector: 'table[width="1200"] > tbody > tr:has(a[href^="download.php/"])' },
      id: { selector: 'a[href^="details.php?id="]', filters: [(query:string) => urlparse(query, true).query.id] },
      title: { selector: 'a[href^="details.php?id="] b' },
      url: { selector: 'a[href^="details.php?id="]', attr: 'href' },
      link: { selector: 'a[href^="download.php/"]', attr: 'href' },
      time: {
        selector: 'td:eq(4) nobr',
        filters: [
          (query: string) => query.replace(/(\d{2})-(\d{2})-(\d{4})\n?(\d{2}:\d{2}:\d{2})/, '$3-$2-$1 $4')
        ]
      },
      size: { selector: 'td:nth-child(6)' },
      author: { selector: 'td:eq(10)' },
      category: { selector: 'td:eq(0) img:first', attr: 'alt' },
      seeders: { selector: 'td:eq(7)' },
      leechers: { selector: 'td:eq(8)' },
      completed: { selector: 'td:eq(9)' },
      comments: { selector: 'td:eq(3)' },
      tags: [
        { name: 'Free', selector: "font[color='red']:contains('[FreeLeech]')" }
      ]
    },
    userInfo: {
      // page: '/',
      id: {
        selector: ["a[href*='userdetails.php']:first"],
        attr: 'href',
        filters: [(query: string) => urlparse(query, true).query.id]
      },
      name: {
        selector: ["a[href*='userdetails.php'][href*='id=']:first"]
      },
      // page: '/userdetailsmore.php?id=$user.id$'
      uploaded: {
        selector: ["td.rowhead:contains('Uploaded') + td"],
        filters: [findThenParseSizeString]
      },
      downloaded: {
        selector: ["td.rowhead:contains('Downloaded') + td"],
        filters: [findThenParseSizeString]
      },
      levelName: {
        selector: "td.rowhead:contains('Class') + td"
      },
      joinTime: {
        selector: "td.rowhead:contains('Join') + td",
        filters: [
          (query: string) => {
            query = query.split(' (')[0];
            return dayjs(query).isValid() ? dayjs(query).valueOf() : query;
          }
        ]
      },
      seeding: {
        selector: '#ka1 table.main > tbody',
        elementProcess: (element: HTMLElement) => {
          const trAnother = Sizzle('> tr', element);
          return trAnother.length - 1;
        }
      },
      seedingSize: {
        selector: '#ka1 table.main > tbody',
        elementProcess: (element: HTMLElement) => {
          let seedingSize = 0;
          const trAnother = Sizzle('> tr:not(:eq(0))', element);
          trAnother.forEach(element => {
            const sizeAnother = Sizzle('td:eq(6)', element)[0] as HTMLElement;
            seedingSize += parseSizeString(sizeAnother.innerText.trim());
          });
          return seedingSize;
        }
      },
      bonus: {
        text: 'N/A'
      }
    }
  }

};
