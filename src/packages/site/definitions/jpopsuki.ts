import type { ISiteMetadata, IUserInfo, ITorrent } from "../types";
import Sizzle from "sizzle";
import Gazelle from "../schemas/Gazelle";
import { parseSizeString } from "../utils";

type boxName = "stats" | "community" | "personal";

const userInfoMap: Record<"en" | "ja", Record<boxName | keyof IUserInfo, string>> = {
  en: {
    stats: "Stats",
    community: "Community",
    personal: "Personal",
    uploaded: "Uploaded",
    downloaded: "Downloaded",
    seeding: "Seeding:",
    bonus: "Bonus Points:",
    levelName: "Class:",
    joinTime: "Joined:",
  },
  ja: {
    stats: "統計情報",
    community: "コミュニティ",
    personal: "個人情報",
    uploaded: "アップロード数",
    seeding: "シード中",
    bonus: "ボーナスポイント",
    levelName: "階級:",
  },
};

function genUserInfoSelector(boxName: boxName, field: keyof IUserInfo): string[] {
  const failBack = userInfoMap.en[field]; // 默认使用英文，这样就可以减小重复字段了
  return Object.values(userInfoMap).map(
    (value) =>
      `div:contains('${value[boxName]}') + ul.stats > li:contains('${value[field] || failBack}')`,
  );
}

export const siteMetadata: ISiteMetadata = {
  name: "JPopsuki",
  timezoneOffset: "+0000",
  description: "日韩音乐",
  url: "https://jpopsuki.eu/",
  tags: ["音乐", "日韩"],
  schema: "Gazelle",
  type: "private",
  category: {
    key: "filter_cat",
    options: [
      { value: 1, name: "Album" },
      { value: 2, name: "Single" },
      { value: 3, name: "PV" },
      { value: 4, name: "DVD" },
      { value: 5, name: "TV-Music" },
      { value: 6, name: "TV-Variety" },
      { value: 7, name: "TV-Drama" },
      { value: 8, name: "Fansubs" },
      { value: 9, name: "Pictures" },
      { value: 10, name: "Misc" },
    ],
  },
  search: {
    advanceKeyword: {
      imdb: {
        skip: true,
      },
    },
    selectors: {
      // 对于特定站点，不使用自动生成列表，而是直接指定selector
      time: { selector: "> td:eq(5)" },
      size: { selector: "> td:eq(6)" },
      completed: { selector: "> td:eq(7)" },
      seeders: { selector: "> td:eq(8)" },
      leechers: { selector: "> td:eq(9)" },
      comments: {
        text: 0,
        selector: 'a[href*="#comments"][title="View Comments"]',
      },
      category: { selector: "> td:eq(1) > a" },

      link: {
        selector: "a[href*='torrents.php?action=download'][title='Download']",
        attr: "href",
      },

      tags: [{ selector: "strong:contains('Freeleech!')", name: "Free" }],
    },
  },
  userInfo: {
    selectors: {
      uploaded: {
        selector: genUserInfoSelector("stats", "uploaded"),
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: genUserInfoSelector("stats", "downloaded"),
        filters: [{ name: "parseSize" }],
      },
      seeding: {
        selector: genUserInfoSelector("community", "seeding"),
        filters: [{ name: "parseNumber" }],
      },
      levelName: {
        selector: genUserInfoSelector("personal", "levelName"),
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(Class:|階級:).+?(.+)/);
            return queryMatch && queryMatch.length >= 3 ? queryMatch[2] : "";
          },
        ],
      },
      joinTime: {
        selector: genUserInfoSelector("stats", "joinTime").map((x) => `${x} > span`),
        attr: "title",
        filters: [{ name: "parseTime" }],
      },
      messageCount: {
        selector: [
          "#alerts > .alertbar > a[href='notice.php']",
          "div.alertbar > a[href*='inbox.php']",
        ],
        filters: [
          (query: string) => {
            const queryMatch = query.match(/(\d+)/);
            return queryMatch && queryMatch.length >= 2 ? parseInt(queryMatch[1]) : 0;
          },
        ],
      },
    },
  },
};

export default class jpopsuki extends Gazelle {
  protected override async transformSearchPage(doc: Document): Promise<ITorrent[]> {
    const torrents: ITorrent[] = [];

    const rows = Sizzle(
      "table.torrent_table:last > tbody > tr:gt(0)",
      doc,
    ) as HTMLElement[];

    let albumAttr: Partial<ITorrent> = {};
    for (let i = 0; i < rows.length; i++) {
      const tr = rows[i] as HTMLTableRowElement;

      const titleAnother = Sizzle("a[href*='torrents.php?id=']:first", tr);
      if (titleAnother.length === 0) {
        continue;
      }

      // 检查 tr 的类型
      let torrent = {} as ITorrent;
      if (tr.classList.contains("group_redline")) {
        // 专辑行，获取title信息
        albumAttr = this.getFieldsData(tr, "search", ["comments", "category"]);

        // 移除掉其他无关元素后的作为专辑标题
        const albumRow = Sizzle("> td:eq(3)", tr)[0].cloneNode(true) as HTMLElement;
        Sizzle(">span, div.tags, a[title='View Comments']", albumRow).forEach((e) =>
          e.remove(),
        );
        albumAttr.title = albumRow.innerText.trim();
        continue;
      } else if (tr.classList.contains("group_torrent_redline")) {
        // 专辑对应的不同格式行
        // 补全前面的单元格，使后续的 selector 能正常生效
        tr.insertCell(0);
        tr.insertCell(0);
        tr.insertCell(0);

        torrent = { ...albumAttr, ...torrent }; // 传入专辑信息，并将格式信息作为 subTitle
        torrent.subTitle = this.getFieldData(tr, {
          selector: '> td:eq(3) > a[href*="torrents.php?id="]',
        });
      } else if (
        tr.classList.contains("torrent_redline") ||
        tr.classList.contains("torrent")
      ) {
        // 单种行
        const cloneTitleAnother = titleAnother[0].parentElement!.cloneNode(
          true,
        ) as HTMLElement;
        Sizzle(">span, div.tags, a[title='View Comments']", cloneTitleAnother).forEach(
          (e) => e.remove(),
        );
        torrent.title = cloneTitleAnother.innerText.trim();
      } else {
        continue;
      }

      if (torrent.title) {
        torrent.title = torrent.title
          .replace(/\t+/g, " ")
          .replace(/\(\d*\)$/, "")
          .trim();
      }

      torrent = this.parseRowToTorrent(tr, torrent) as ITorrent;
      torrents.push(torrent);
    }
    return torrents;
  }

  private async getUserTorrentList(
    userId: number,
    page: number = 0,
    type: string = "seeding",
  ): Promise<Document> {
    const { data: TListDocument } = await this.request<Document>({
      url: "/torrents.php",
      params: {
        userid: userId,
        page,
        type,
      },
      responseType: "document",
    });
    return TListDocument;
  }

  public override async getUserInfo(
    lastUserInfo: Partial<IUserInfo> = {},
  ): Promise<IUserInfo> {
    const flushUserInfo = await super.getUserInfo();

    if (flushUserInfo.id) {
      let seedingSize = 0;

      const pageInfo = { count: 0, current: 0 }; // 生成页面信息
      for (; pageInfo.current <= pageInfo.count; pageInfo.current++) {
        const TListDocument = await this.getUserTorrentList(
          flushUserInfo.id as number,
          pageInfo.current,
        );
        // 更新最大页数
        if (pageInfo.count === 0) {
          pageInfo.count = this.getFieldData(TListDocument, {
            selector: ["a[href*='torrents.php?page=']:contains('Last'):last"],
            attr: "href",
            filters: [
              (query: string) =>
                parseInt(new URL(query).searchParams.get("page") || "-1"),
            ],
          });
        }

        const torrentAnothers = Sizzle("tr.torrent", TListDocument);
        torrentAnothers.forEach((element) => {
          const sizeAnother = Sizzle("td:eq(5)", element);
          if (sizeAnother && sizeAnother.length >= 0) {
            seedingSize += parseSizeString(
              (sizeAnother[0] as HTMLElement).innerText.trim(),
            );
          }
        });
      }

      // 更新做种信息
      flushUserInfo.seedingSize = seedingSize;
    }
    return flushUserInfo;
  }
}
