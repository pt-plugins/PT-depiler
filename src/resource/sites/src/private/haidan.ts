import { ETorrentStatus, ISiteMetadata, ITorrent, ITorrentTag } from '../../types';
import NexusPHP from '../schema/NexusPHP';
import Sizzle from 'sizzle';

export const siteMetadata: ISiteMetadata = {
  name: 'HaiDan',
  schema: 'NexusPHP',
  url: 'https://www.haidan.video/',
  description: '海胆之家',
  favicon: 'https://www.haidan.video/favicon.ico',
  tags: ['影视', '综合'],
  host: 'www.haidan.video',
  collaborator: ['rsj'],
  search: {
    selectors: {
      title: { selector: '.video_name_str' },
      subTitle: { selector: '.torrent_name_col a' },
      url: { selector: '.torrent_name_col a', attr: 'href' },
      link: { selector: 'a:has(> .fa-download)', attr: 'href' },
      time: { selector: '.time_col span[title]', attr: 'title' },
      size: { selector: '.video_size' },
      author: { selector: '.username-center a b' },
      seeders: { selector: '.seeder_col' },
      leechers: { selector: '.leecher_col' },
      completed: { selector: '.snatched_col' },
      comments: { text: 0 },
      category: { selector: '.img_blurry a img', attr: 'title' },
      progress: {
        selector: 'progress',
        data: 'label',
        filters: [
          (query: string) => query.replace('%', '')
        ]
      },
      status: {
        selector: 'progress',
        data: 'label',
        filters: [
          (query: string) => query === '' ? ETorrentStatus.unknown : (query === '100%' ? ETorrentStatus.seeding : ETorrentStatus.downloading)
        ]
      },
      tags: [
        { name: 'H&R', color: 'black', selector: "img[src='public/pic/hit_run.gif']" }
      ]
    }
  }
};

// noinspection JSUnusedGlobalSymbols
export default class HaiDan extends NexusPHP {
  protected override async transformSearchPage (doc: Document): Promise<ITorrent[]> {
    const torrents : ITorrent[] = [];
    const trs = Sizzle('.group_content', doc);
    trs.forEach(tr => {
      const baseTorrentDetail = this.getFieldsData(tr, 'search', ['title', 'category']);
      const items = Sizzle('.torrent_wrap', tr);
      items.forEach(item => {
        const torrentDetail = this.getFieldsData(item, 'search', [
          'subTitle', 'link', 'url', 'size', 'time', 'author', 'seeders', 'leechers', 'completed', 'comments'
        ]);
        const torrentTags = this.parseTagsFromRow(item);
        torrents.push({ ...baseTorrentDetail, ...torrentDetail, tags: torrentTags } as ITorrent);
      });
    });

    return torrents;
  }

  protected override parseTagsFromRow (row: Element): ITorrentTag[] {
    const tags = super.parseTagsFromRow(row);
    const labelsAnother = Sizzle('label', row);
    labelsAnother.forEach(labelAnother => {
      tags.push({
        name: labelAnother.querySelector('b')!.innerText,
        color: (labelAnother as HTMLElement).style.backgroundColor
      });
    });

    return tags;
  }
}
