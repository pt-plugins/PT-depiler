import Sizzle from "sizzle";
import BittorrentSite from "../schemas/AbstractBittorrentSite.ts";
import Gazelle, { SchemaMetadata } from "../schemas/Gazelle.ts";
import { type ISearchInput, type ISiteMetadata, type ITorrent } from "../types";

function isHdfTorrentRow(row: HTMLTableRowElement): boolean {
  if (!row.querySelector("a[href*='torrents.php?action=download']")) return false;

  if (row.classList.contains("torrent")) return true;

  if (!row.classList.contains("group_torrent")) return false;
  if (row.classList.contains("season_header") || row.classList.contains("torrent_filename_row")) return false;
  if (row.classList.contains("edition") && !Array.from(row.classList).some((c) => c.startsWith("edition_"))) {
    return false;
  }
  return true;
}

function extractHdfTitle(row: HTMLElement): string {
  const groupInfo = row.querySelector("div.group_info");
  const link = groupInfo?.querySelector<HTMLAnchorElement>("a[href*='torrents.php?id=']");
  const title = link?.textContent?.trim() ?? "";
  const yearMatch = groupInfo?.textContent?.match(/\[(\d{4})\]/);
  return [title, yearMatch ? `[${yearMatch[1]}]` : ""].filter(Boolean).join(" ");
}

function appendHdfFilename(torrent: ITorrent, row: HTMLTableRowElement): void {
  const filename =
    row.querySelector(".torrent_filename_row")?.textContent?.trim() ??
    (row.nextElementSibling?.classList.contains("torrent_filename_row")
      ? row.nextElementSibling.textContent?.trim()
      : undefined);
  if (filename && torrent.title && !torrent.title.includes(filename)) {
    torrent.title = `${torrent.title} ${filename}`;
  }
}

function filterHdfTorrentRows(rows: HTMLTableRowElement[] | null): HTMLTableRowElement[] | null {
  if (!rows) return rows;
  return rows.filter((row) => isHdfTorrentRow(row));
}

function findHdfGroupRow(torrentEl: HTMLTableRowElement): HTMLElement | null {
  const groupId = Array.from(torrentEl.classList)
    .find((c) => c.startsWith("groupid_"))
    ?.slice("groupid_".length);
  if (!groupId) return null;

  return torrentEl.ownerDocument?.querySelector(`tr.group #showimg_${groupId}`)?.closest("tr.group") ?? null;
}

const statsBox = "div:contains('Statistiques') + ul.stats";
const personalBox = "div:contains('Infos personnelles') + ul.stats";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "hdf",
  name: "HD-Forever",
  aka: ["HD-F", "HDF"],
  description: "HD-Forever (HD-F) is a FRENCH Private Torrent Tracker for HD MOVIES",
  tags: ["法国"],
  timezoneOffset: "+0100",

  type: "private",
  schema: "Gazelle",

  urls: ["uggcf://uqs.jbeyq/"],

  category: [
    {
      name: "Catégorie",
      key: "filter_cat",
      options: [
        { value: 1, name: "Film" },
        { value: 2, name: "Film d'animation" },
        { value: 3, name: "Spectacle" },
        { value: 4, name: "Concert" },
        { value: 5, name: "Série" },
        { value: 6, name: "Série d'animation" },
        { value: 7, name: "Documentaire" },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "Promotion",
      key: "freetorrent",
      options: [
        { value: "0", name: "Normal" },
        { value: "1", name: "Freeleech" },
        { value: "2", name: "Neutral" },
        { value: "3", name: "Freeleech ou Neutral" },
      ],
    },
  ],

  search: {
    ...SchemaMetadata.search!,
    requestConfig: {
      url: "/torrents.php",
      responseType: "document",
      params: {
        action: "basic",
        searchsubmit: 1,
      },
    },
    advanceKeywordParams: {
      imdb: {
        requestConfig: {
          params: {
            action: "advanced",
            searchsubmit: 1,
          },
        },
        requestConfigTransformer: ({ requestConfig, keywords }) => {
          requestConfig!.params.imdbid = keywords;
          delete requestConfig!.params.searchstr;
          return requestConfig!;
        },
      },
      tmdb: {
        requestConfig: {
          params: {
            action: "advanced",
            searchsubmit: 1,
          },
        },
        requestConfigTransformer: ({ requestConfig, keywords }) => {
          requestConfig!.params.tmdbid = keywords;
          delete requestConfig!.params.searchstr;
          return requestConfig!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata.search!.selectors!,
      rows: {
        selector: "table#torrent_table tr.torrent, table#torrent_table tr.group_torrent",
        filter: filterHdfTorrentRows,
      },
      title: {
        selector: ":self",
        elementProcess: extractHdfTitle,
      },
      subTitle: {
        selector: ".torrent_info",
        filters: [(text: string) => text.replace(/\s+/g, " ").trim()],
      },
      url: {
        selector: ["a[href*='torrentid=']", "a[href*='torrents.php?id=']"],
        attr: "href",
      },
      time: {
        selector: "td.nobr span.time[title]",
        attr: "title",
        filters: [{ name: "parseTime", args: ["dd-MM-yyyy, HH:mm:ss"] }],
      },
      size: {
        selector: "td.number_column.nobr",
        filters: [{ name: "parseSize" }],
      },
      completed: {
        selector: "td.number_column:nth-last-child(3)",
        filters: [{ name: "parseNumber" }],
      },
      seeders: {
        selector: "td.number_column:nth-last-child(2)",
        filters: [{ name: "parseNumber" }],
      },
      leechers: {
        selector: "td.number_column:nth-last-child(1)",
        filters: [{ name: "parseNumber" }],
      },
      ext_imdb: {
        selector: "a.db-link-copy[data-imdb-id]",
        attr: "data-imdb-id",
        filters: [{ name: "extImdbId" }],
      },
      category: {
        selector: "td.cats_col div[class*='cats_']",
        attr: "class",
        filters: [
          (cat: string) => {
            if (/cats_film(?!d)/.test(cat)) return "Film";
            if (/cats_filmd/.test(cat)) return "Film d'animation";
            if (/cats_spectacle/.test(cat)) return "Spectacle";
            if (/cats_concert/.test(cat)) return "Concert";
            if (/cats_série(?!d)/.test(cat)) return "Série";
            if (/cats_séried/.test(cat)) return "Série d'animation";
            if (/cats_documentaire/.test(cat)) return "Documentaire";
            return "";
          },
        ],
      },
      tags: [
        { selector: "strong.torrent_label.tl_free", name: "Free", color: "blue" },
        { selector: "strong.torrent_label:contains('-25%')", name: "-25%", color: "green" },
        { selector: "strong.torrent_label:contains('-50%')", name: "-50%", color: "green" },
        { selector: "strong.torrent_label:contains('-75%')", name: "-75%", color: "green" },
      ],
    },
  },

  userInfo: {
    ...SchemaMetadata.userInfo!,
    process: [
      ...(SchemaMetadata.userInfo!.process ?? []).map((step, index) =>
        index === 1
          ? {
              ...step,
              fields: [
                ...(step.fields ?? []).filter((field) => field !== "seeding"),
                "hnrUnsatisfied",
                "bonusPerHour",
                "trueUploaded",
              ],
            }
          : step,
      ),
      {
        requestConfig: {
          url: "/ajax.php",
          params: { action: "community_stats" },
          responseType: "json",
        },
        assertion: { id: "params.userid" },
        fields: ["seeding"],
      },
    ],
    selectors: {
      ...SchemaMetadata.userInfo!.selectors!,
      name: {
        selector: [
          "div.user-name-class span[class^='class_']",
          "h2 a[href*='user.php?id='] span",
          "a.username + strong a[href*='user.php'] span",
        ],
      },
      uploaded: {
        selector: [`${statsBox} > li.tooltip:contains('Uploadé :')`],
        attr: "title",
        filters: [{ name: "parseSize" }],
      },
      trueUploaded: {
        selector: [`${statsBox} > li.tooltip:contains('Upload réel (tracker)')`],
        attr: "title",
        filters: [{ name: "parseSize" }],
      },
      downloaded: {
        selector: [`${statsBox} > li.tooltip:contains('Téléchargé :')`],
        attr: "title",
        filters: [{ name: "parseSize" }],
      },
      ratio: {
        selector: [`${statsBox} > li:contains('Ratio :'):not(:contains('Ratio requis')) span.tooltip`],
        attr: "title",
        filters: [{ name: "parseNumber" }],
      },
      bonus: {
        selector: ["#bonus_points_number_link span"],
        filters: [{ name: "parseNumber" }],
      },
      bonusPerHour: {
        selector: [`${statsBox} > li:contains('Points par heure')`],
        filters: [{ name: "parseNumber" }],
      },
      levelName: {
        selector: [`${personalBox} > li:contains('Rang :')`],
        filters: [{ name: "split", args: ["Rang :", 1] }, { name: "trim" }],
      },
      joinTime: {
        selector: [`${statsBox} > li:contains('Inscription :') span.time.tooltip`],
        attr: "title",
        filters: [{ name: "parseTime", args: ["dd-MM-yyyy, HH:mm:ss"] }],
      },
      lastAccessAt: {
        selector: [`${statsBox} > li:contains('Dernier vu :') span.time.tooltip`],
        attr: "title",
        filters: [{ name: "parseTime", args: ["dd-MM-yyyy, HH:mm:ss"] }],
      },
      uploads: {
        selector: ["#comm_upload"],
        filters: [{ name: "parseNumber" }],
      },
      seedingSize: {
        selector: ["#comm_seedsize span.tooltip"],
        filters: [(query: string) => query.replace(/^[\s\S]*?:\s*/, ""), { name: "parseSize" }],
      },
      seeding: {
        selector: ["response.seeding", "response.community.seeding"],
        filters: [{ name: "parseNumber" }],
      },
      hnrUnsatisfied: {
        selector: ["#hnr_count_link span"],
        filters: [{ name: "parseNumber" }],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Novice",
      privilege: "Can download, vote on applications, use advanced search, and access the top 10.",
    },
    {
      id: 2,
      name: "Member",
      interval: "P1W",
      uploaded: "55GB",
      privilege:
        "Can upload, send requests, create bookmarks, edit wiki pages, download multiple torrents at once, and reset own password/authkey.",
    },
    {
      id: 3,
      name: "Elite",
      uploaded: "1TiB",
      ratio: 1,
      privilege:
        "Can access torrents notification system, create collections and a personal collection, create polls in forums, view snatch torrent lists, add own torrents to recommendations, display tag aliases, change password, and add artists to any group.",
    },
  ],
};

export default class HDF extends Gazelle {
  public override async transformSearchPage(doc: Document, searchConfig: ISearchInput): Promise<ITorrent[]> {
    return BittorrentSite.prototype.transformSearchPage.call(this, doc, searchConfig);
  }

  protected override async parseWholeTorrentFromRow(
    torrent: Partial<ITorrent>,
    row: Element | Document | object,
    searchConfig: ISearchInput,
  ): Promise<Partial<ITorrent>> {
    if (row instanceof HTMLTableRowElement) {
      let partTorrent = { ...torrent };
      if (row.classList.contains("group_torrent")) {
        const groupRow = findHdfGroupRow(row);
        if (groupRow) {
          partTorrent = { ...partTorrent, ...this.getTorrentGroupInfo(groupRow, searchConfig) };
        }
      } else if (row.classList.contains("torrent")) {
        partTorrent = { ...partTorrent, ...this.getTorrentGroupInfo(row, searchConfig) };
      }

      const parsed = (await super.parseWholeTorrentFromRow(partTorrent, row, searchConfig)) as ITorrent;
      appendHdfFilename(parsed, row);
      return parsed;
    }

    return super.parseWholeTorrentFromRow(torrent, row, searchConfig);
  }

  protected override get torrentClasses(): Record<"group" | "unGroupTorrent", string[]> {
    return {
      ...super.torrentClasses,
      unGroupTorrent: ["group_torrent", ...super.torrentClasses.unGroupTorrent],
    };
  }
}
