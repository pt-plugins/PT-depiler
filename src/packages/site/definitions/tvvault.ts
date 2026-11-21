/**
 * @TVVaultAPI https://tv-vault.me/kb.php?id=61 (login required; user-provided documentation excerpts)
 * @JackettRemoval https://github.com/Jackett/Jackett/pull/12496
 * TV-Vault prohibits automated HTML scraping. Search exclusively through its XML API.
 */
import type { ISearchEntryRequestConfig, ISearchResult, ISiteMetadata, ITorrent } from "../types";
import { EResultParseStatus } from "../types";
import PrivateSite from "../schemas/AbstractPrivateSite.ts";
import { parseSizeString } from "../utils/filesize.ts";

const SEARCH_INTERVAL_SECONDS = 5 * 60 + 1; // API searches must be more than five minutes apart.
let lastSearchAt = 0; // Unix timestamp in seconds, shared by site instances in this runtime.

// Category IDs and form field names come from the user-provided TV-Vault search form.
const genres = [
  { name: "Action", value: 1 },
  { name: "Advertising", value: 2 },
  { name: "Animation", value: 3 },
  { name: "Chatshow", value: 4 },
  { name: "Comedy", value: 5 },
  { name: "Documentary", value: 6 },
  { name: "Drama", value: 7 },
  { name: "Family", value: 8 },
  { name: "Fantasy", value: 15 },
  { name: "Gameshow", value: 9 },
  { name: "Horror", value: 16 },
  { name: "Instructional", value: 18 },
  { name: "Music", value: 10 },
  { name: "Sci-Fi", value: 11 },
  { name: "Soap", value: 12 },
  { name: "Thriller", value: 13 },
  { name: "Western", value: 17 },
  { name: "Other", value: 14 },
];
const allowedGenreIds = new Set(genres.map(({ value }) => value));

const ripFilters = [
  { key: "container", name: "Container", options: ["AVI", "MPG", "MKV", "MP4", "TS", "VOB/IFO", "m2ts/bdmv", "ISO", "Audio", "CBR", "ePUB", "PDF", "Subtitle", "Multiple", "Other"] },
  { key: "format", name: "Video format", options: ["XviD", "DivX", "H.264", "AV1", "VC-1", "H.265", "MPEG-2", "MPEG-1", "VP8/9", "Unknown", "Multiple", "Other", ""] },
  { key: "aformat", name: "Audio format", options: ["AC3", "AAC", "DTS", "E-AC3", "MP3", "MP2", "FLAC", "(L)PCM", "Vorbis", "Opus", "Unknown", "Multiple", "Other", ""] },
  { key: "media", name: "Media", options: ["DVD", "HDTV", "PDTV", "TV", "VHS", "Blu-ray", "HD-DVD", "LaserDisc", "Master", "Kinescope", "Web", "ScreenCap", "CD", "Scan", "Unknown", "Multiple", "Other"] },
  { key: "hdrvideo", name: "High Dynamic Range", options: [
    { name: "No: 8-bit", value: "0" }, { name: "All HDR types", value: "10" },
    { name: "General 10-bit", value: "1" }, { name: "Dolby Vision", value: "3" },
    { name: "10-bit (via MediaInfo)", value: "2" }, { name: "DoVi (via MediaInfo)", value: "4" },
  ] },
  { key: "subtitles", name: "Subtitles", options: [
    { name: "No Subs", value: "0" }, { name: "Subs Avail", value: "1" }, { name: "Autoset (MI)", value: "2" },
  ] },
  { key: "commentary", name: "Commentary", options: [
    { name: "No Comm", value: "0" }, { name: "Comm Avail", value: "1" }, { name: "Autoset (MI)", value: "2" },
  ] },
  { key: "excludecontainer", name: "Exclude Container", options: ["AVI", "MPG", "MKV", "MP4", "TS", "VOB/IFO", "m2ts/bdmv", "ISO", "Audio", "CBR", "ePUB", "PDF", "Subtitle", "Multiple", "Other"] },
  { key: "order_by", name: "Order by", options: [
    { name: "Name", value: "s1" }, { name: "Year", value: "s2" }, { name: "Added", value: "s3" },
    { name: "Size", value: "s4" }, { name: "Snatched", value: "s5" }, { name: "Seeders", value: "s6" },
    { name: "Leechers", value: "s7" }, { name: "Comments", value: "s8" },
  ] },
  { key: "order_way", name: "Order direction", options: [
    { name: "Descending", value: "desc" }, { name: "Ascending", value: "asc" },
  ] },
] as const;

// XML field names have not been verified: the sample pasted into chat lost its XML tags.
function field(element: Element | null, names: string[]): string {
  if (!element) return "";
  const wanted = names.map((name) => name.toLowerCase());
  for (const child of Array.from(element.children)) {
    if (wanted.includes(child.localName.toLowerCase())) return child.textContent?.trim() ?? "";
  }
  for (const attribute of Array.from(element.attributes)) {
    if (wanted.includes(attribute.name.toLowerCase())) return attribute.value.trim();
  }
  return "";
}

function numberField(element: Element | null, names: string[]): number | undefined {
  const raw = field(element, names).replace(/,/g, "");
  return raw && Number.isFinite(Number(raw)) ? Number(raw) : undefined;
}

function getRipSubtitle(torrent: Element): string {
  const formats = ["container", "format", "aformat", "media"] as const;
  // The form field names are not necessarily the names used in XML responses. Inspect only this
  // torrent and its immediate metadata containers, never the enclosing show description.
  const containers = [
    torrent,
    ...Array.from(torrent.children).filter((child) =>
      /^(rip|ripinfo|ripspecifics|releaseinfo|specs|properties|mediainfo)$/i.test(child.localName),
    ),
  ];
  const parts = [
    ["container"],
    ["format", "videoformat", "codec", "video", "videocodec"],
    ["aformat", "audioformat", "audio", "audiocodec"],
    ["media", "source"],
  ].map((names) => containers.map((container) => field(container, names)).find(Boolean) ?? "");
  if (parts.filter(Boolean).length >= 3) return parts.filter(Boolean).join(" ");

  // Some XML responses provide only a combined value, e.g. MKV/H.264/AC3/Web.
  const known = formats.map((key) => new Set<string>(ripFilters.find((item) => item.key === key)!.options.map((option) =>
    typeof option === "string" ? option : option.value,
  )));
  const candidates = [
    field(torrent, ["rip", "ripinfo", "ripspecifics", "releaseformat", "format", "specs"]),
    ...containers.flatMap((container) => Array.from(container.getElementsByTagName("*"))
      .filter((child) => !child.children.length)
      .map((child) => child.textContent?.trim() ?? "")),
  ];
  for (const candidate of candidates) {
    const segments = candidate.split("/").map((part) => part.trim());
    if (segments.length === 4 && segments.every((part, index) => known[index].has(part))) {
      return segments.join(" ");
    }
  }
  // A response may expose the four values as separate XML elements with site-specific tag names.
  const recognized = known.map((choices, index) => parts[index] || candidates.find((candidate) => candidate && choices.has(candidate)) || "");
  if (recognized.filter(Boolean).length >= 3) return recognized.filter(Boolean).join(" ");
  return parts.filter(Boolean).join(" ");
}

function parseXmlSearch(xml: Document, siteUrl: string, authkey: string, torrentPass: string): ITorrent[] {
  const root = xml.documentElement;
  if (!root || root.localName.toLowerCase() !== "searchresults" || root.getElementsByTagName("parsererror").length) {
    throw new Error("Invalid TV-Vault XML response");
  }

  const error = Array.from(root.getElementsByTagName("*")).find(
    (element) => element.localName.toLowerCase() === "searcherror",
  );
  if (error && error.getAttribute("value") !== "0") {
    // Do not include the response in errors; it could contain a personal credential.
    const code = error.getAttribute("value") ?? "unknown";
    throw new Error(`TV-Vault XML search error ${code}`);
  }

  const torrents = Array.from(root.getElementsByTagName("*")).filter((element) => {
    if (["torrent", "release"].includes(element.localName.toLowerCase())) return true;
    const details = field(element, ["details", "detailsurl", "link", "url"]);
    try {
      return new URL(details).searchParams.has("torrentid");
    } catch {
      return false;
    }
  });

  return torrents.flatMap((element): ITorrent[] => {
    let group: Element | null = element.parentElement;
    while (group && !["group", "show", "series", "torrentgroup"].includes(group.localName.toLowerCase())) {
      const groupLink = field(group, ["details", "detailsurl", "link", "url"]);
      if (groupLink && /torrents\.php\?id=\d+(?:$|&amp;|&)/.test(groupLink) && !groupLink.includes("torrentid=")) break;
      group = group.parentElement;
    }

    const rawDetails = field(element, ["details", "detailsurl", "link", "url"]);
    let detailId = "";
    let groupId = field(group, ["id", "groupid", "showid"]);
    try {
      const parsed = new URL(rawDetails, siteUrl);
      // Never follow an untrusted host with personal download credentials.
      if (parsed.hostname !== new URL(siteUrl).hostname) return [];
      detailId = parsed.searchParams.get("torrentid") ?? parsed.searchParams.get("id") ?? "";
      groupId ||= parsed.searchParams.get("id") ?? "";
    } catch {
      return [];
    }
    const id = field(element, ["torrentid"]) || detailId || field(element, ["id"]);
    if (!id || !/^\d+$/.test(id)) return [];

    const details = new URL("torrents.php", siteUrl);
    details.searchParams.set("id", groupId || id);
    if (groupId && groupId !== id) details.searchParams.set("torrentid", id);

    const groupTitle = field(group, ["name", "title", "groupname", "showname"]);
    const releaseTitle = field(element, ["name", "title", "description", "release", "releasename"]);
    const title = [groupTitle, groupTitle && releaseTitle.startsWith(groupTitle) ? "" : releaseTitle].filter(Boolean).join(" ");
    if (!title) return [];

    const rawSize = field(element, ["size", "bytes", "filesize", "sizebytes"]);
    const subTitle = getRipSubtitle(element);
    const numericSize = Number(rawSize);
    const size = /^\d+$/.test(rawSize) ? numericSize : parseSizeString(rawSize);
    const time = numberField(element, ["timestamp", "addedtimestamp", "uploadedtimestamp", "time", "added", "date"]);

    const torrent: ITorrent = {
      site: "tvvault",
      id,
      title,
      ...(subTitle ? { subTitle } : {}),
      url: details.toString(),
      category: "TV",
      ...(size > 0 ? { size } : {}),
      ...(time && time > 0 ? { time: time < 1e12 ? time * 1000 : time } : {}),
      seeders: numberField(element, ["seeders", "seeds"]),
      leechers: numberField(element, ["leechers", "leeches"]),
      completed: numberField(element, ["snatches", "snatched", "grabs", "completed"]),
    };

    const imdb = field(group, ["imdbid", "imdb"]);
    if (imdb) torrent.ext_imdb = imdb;

    // XML search may omit <download>. Use the explicitly configured personal credentials only.
    const providedDownload = field(element, ["download", "downloadurl"]);
    if (providedDownload) {
      try {
        const parsed = new URL(providedDownload, siteUrl);
        if (parsed.hostname === new URL(siteUrl).hostname) torrent.link = parsed.toString();
      } catch { /* No valid download URL in this record. */ }
    } else if (authkey && torrentPass) {
      const download = new URL("torrents.php", siteUrl);
      download.searchParams.set("action", "download");
      download.searchParams.set("id", id);
      download.searchParams.set("authkey", authkey);
      download.searchParams.set("torrent_pass", torrentPass);
      torrent.link = download.toString();
    }
    return [torrent];
  });
}

export const siteMetadata: ISiteMetadata = {
  version: 1,
  id: "tvvault",
  name: "TV-Vault",
  description: "TV-Vault is a private tracker for classic television shows (XML search API only).",
  tags: ["电视剧"],
  timezoneOffset: "+0000",
  type: "private",
  schema: "AbstractPrivateSite",
  urls: ["https://tv-vault.me/"],
  category: [
    {
      name: "题材分类",
      key: "filter_cat",
      options: genres,
      cross: { mode: "appendQuote" },
    },
    ...ripFilters.map(({ key, name, options }) => ({
      name,
      key,
      options: options.map((option) =>
        typeof option === "string"
          ? { name: option || (key === "format" ? "(no video)" : "(no audio)"), value: option }
          : { name: option.name, value: option.value },
      ),
    })),
  ],
  userInputSettingMeta: [
    {
      name: "authkey",
      label: "Authkey",
      hint: "从 TV-Vault 的种子下载链接或 RSS 地址中获取。不要将密钥粘贴到公开对话或代码中。",
      required: true,
    },
    {
      name: "torrentPass",
      label: "Torrent Pass",
      hint: "选填；从种子下载链接中获取，用于生成下载地址。请勿公开。",
      required: false,
    },
  ],
  search: { skipWhiteSpacePlaceholder: true },
  // No background HTML scraping, user-info queries, or automatic content-script list parsing.
};

export default class TVVault extends PrivateSite {
  public override async getSearchResult(
    keywords?: string,
    searchEntry: ISearchEntryRequestConfig = {},
  ): Promise<ISearchResult> {
    if (!this.allowSearch || !keywords?.trim()) {
      return { status: EResultParseStatus.passParse, data: [] };
    }

    const authkey = this.userConfig.inputSetting?.authkey?.trim();
    const torrentPass = this.userConfig.inputSetting?.torrentPass?.trim() ?? "";
    if (!authkey) {
      return { status: EResultParseStatus.noUserInput, statusMsg: "请先配置 TV-Vault Authkey", data: [] };
    }

    const input = keywords.trim();
    const selected = searchEntry.requestConfig?.params ?? {};
    const imdbSearch = /^(?:imdb|imdbid)[|=]/i.test(input);
    const imdbId = imdbSearch ? input.replace(/^(?:imdb|imdbid)[|=]/i, "").trim() : "";
    const query = imdbSearch ? (imdbId.startsWith("tt") ? imdbId : `tt${imdbId}`) : input;
    if ((imdbSearch && !/^tt\d+$/i.test(query)) || (!imdbSearch && query.length < 3)) {
      return {
        status: EResultParseStatus.passParse,
        statusMsg: "TV-Vault 搜索需要至少三个字符，IMDb 搜索需要 tt 开头的有效编号",
        data: [],
      };
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const rateLimitResult = (last: number): ISearchResult => ({
      status: EResultParseStatus.passParse,
      statusMsg: `TV-Vault XML 搜索请在 ${Math.max(1, last + SEARCH_INTERVAL_SECONDS - currentTime)} 秒后重试`,
      data: [],
    });

    // Reserve synchronously before the first await so searches in this runtime cannot race.
    if (lastSearchAt > 0 && currentTime < lastSearchAt + SEARCH_INTERVAL_SECONDS) {
      return rateLimitResult(lastSearchAt);
    }
    lastSearchAt = currentTime;

    try {
      const stored = await this.retrieveRuntimeSettings<number>("xmlSearchLastRequestAt");
      // Earlier versions stored milliseconds under the same key; migrate without bypassing their cooldown.
      const saved = typeof stored === "number" && Number.isFinite(stored) && stored > 0
        ? Math.floor(stored > 1e12 ? stored / 1000 : stored)
        : 0;
      if (saved > 0 && currentTime < saved + SEARCH_INTERVAL_SECONDS) {
        return rateLimitResult(saved);
      }
      // Save the request timestamp before contacting the API. Failed requests also consume this slot.
      await this.storeRuntimeSettings("xmlSearchLastRequestAt", currentTime);
      const params: Record<string, string | number> = { query: "get", authkey, enablegrouping: 1 };
      const categorySelection = selected.filter_cat;
      if (categorySelection && typeof categorySelection === "object" && !Array.isArray(categorySelection)) {
        for (const [id, checked] of Object.entries(categorySelection)) {
          if (allowedGenreIds.has(Number(id)) && checked == 1) params[`filter_cat[${id}]`] = 1;
        }
      }
      for (const [key, checked] of Object.entries(selected)) {
        const match = /^filter_cat\[(\d+)\]$/.exec(key);
        if (match && allowedGenreIds.has(Number(match[1])) && checked == 1) params[key] = 1;
      }
      for (const { key, options } of ripFilters) {
        if (!Object.prototype.hasOwnProperty.call(selected, key)) continue;
        const value = selected[key];
        if (typeof value !== "string" && typeof value !== "number") continue;
        if (options.some((option) => String(typeof option === "string" ? option : option.value) === String(value))) {
          params[key] = value;
        }
      }
      if (imdbSearch) {
        params.imdbid = query;
      } else {
        params.searchstr = query;
      }
      const { data } = await this.request<string>({ url: "/xmlsearch.php", params, responseType: "text" }, false);
      const xml = new DOMParser().parseFromString(data, "application/xml");
      const parsed = parseXmlSearch(xml, this.url, authkey, torrentPass);
      return { status: parsed.length ? EResultParseStatus.success : EResultParseStatus.noResults, data: parsed };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const code = message.match(/^TV-Vault XML search error (\d+)$/)?.[1];
      const reason: Record<string, string> = {
        "1": "未提供 API 身份验证信息",
        "2": "Authkey 无效或账户已停用",
        "3": "当前账户无权使用 XML 搜索",
        "10": "至少需要一个搜索条件",
        "100": "请求过于频繁，请稍后再试",
        "101": "此搜索成本过高，请缩小范围或延长间隔",
        "250": "此搜索类型暂不可用",
      };
      return {
        status: EResultParseStatus.parseError,
        statusMsg: code ? (reason[code] ?? `TV-Vault API 错误 ${code}`) : "TV-Vault XML 搜索失败，请检查站点权限与返回格式",
        data: [],
      };
    }
  }
}
