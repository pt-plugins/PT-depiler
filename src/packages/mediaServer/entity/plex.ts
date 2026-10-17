import urlJoin from "url-join";
import { toMerged } from "es-toolkit";

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { EResultParseStatus } from "@ptd/site";
import {
  AbstractMediaServer,
  IMediaServerBaseConfig,
  IMediaServerItem,
  IMediaServerMetadata,
  IMediaServerOverview,
  IMediaServerOverviewOptions,
  IMediaServerSearchOptions,
  IMediaServerSearchResult,
} from "../types";
import { createOverviewAccumulator, getResolutionLabel } from "../utils.ts";

export const mediaServerMetaData: IMediaServerMetadata = {
  description: "Plex 是一款流行的媒体服务器软件，支持多种设备和平台，提供丰富的媒体管理和播放功能",
  warning: ["apikey 可通过在console面板中查看 localStorage 中的 myPlexAccessToken 值"],
  auth_field: ["apikey"],
} as const;

interface IPlexConfig extends IMediaServerBaseConfig {
  type: "plex";
  auth: {
    apikey: string;
  };
}

export const mediaServerConfig: IPlexConfig = {
  type: "plex",
  name: "Plex",
  address: "",
  auth: {
    apikey: "",
  },
  timeout: 5000,
};

interface IPlexJsonResponse<T = any> {
  MediaContainer: T;
  error?: string;
  code?: number;
  message?: string;
}

interface IPlexIdentityData {
  apiVersion: string;
  claimed: boolean;
  machineIdentifier: string;
  size: number;
  version: string;
}

interface IPlexSearchItem {
  addedAt: number;
  allowSync: boolean;
  type: "movie" | "show";

  key: string;
  title: string;
  summary: string;
  thumb: string;

  librarySectionID: number;
  librarySectionTitle: string;
  librarySectionUUID: string;

  Genre: Array<{ tag: string }>;

  Media?: Array<{
    Part: Array<{
      container: string;
      duration: number;
      file: string;
      hasThumbnail: boolean;
      id: number;
      key: string;
      size: number;
      /** 媒体流明细（video / audio / subtitle） */
      Stream?: Array<{
        streamType: number; // 1=Video 2=Audio 3=Subtitle
        codec?: string;
        language?: string;
        languageCode?: string;
        displayTitle?: string;
        title?: string;
        channels?: number;
        audioChannelLayout?: string;
        width?: number;
        height?: number;
        bitrate?: number;
        frameRate?: string;
        profile?: string;
        /** 色彩转移特性：smpte2084=HDR10 / arib-std-b67=HLG */
        colorTrc?: string;
        /** 杜比视界 */
        doviPresent?: boolean;
        /** 外挂字幕会带 key */
        key?: string;
        selected?: boolean;
      }>;
    }>;
    aspectRatio: number;
    audioChannels: number;
    audioCodec: string;
    bitrate: number;
    container: string;
    duration: number;
    height: number;
    id: number;
    videoCodec: string;
    videoFrameRate: string;
    videoProfile: string;
    videoResolution: string;
    width: number;
  }>;

  audienceRating: number;
  duration: number;

  year: number;

  updatedAt: number;

  // —— 调研 A3–A6 / B7–B12 需要的字段 ——
  ratingKey?: string;
  /** 影评人评分（audienceRating 是观众评分） */
  rating?: number;
  /** 官方分级 */
  contentRating?: string;
  /** 制片公司 */
  studio?: string;
  tagline?: string;
  Label?: Array<{ tag: string }>;
  /** 外部标识：imdb://tt… / tmdb://… / tvdb://… */
  Guid?: Array<{ id: string }>;
  /** 最近观看时间（epoch 秒） */
  lastViewedAt?: number;
  /** 播放次数 */
  viewCount?: number;
  /** 已观看时长（毫秒） */
  viewOffset?: number;
  /** 集号 / 季号（剧集用） */
  index?: number;
  parentIndex?: number;
  /** 演职人员（详情接口才有） */
  Role?: Array<{ tag: string; role?: string }>;
  Director?: Array<{ tag: string }>;
}

interface IPlexRecentlyAddedItem extends Omit<IPlexSearchItem, "Media"> {
  parentTitle?: string; // 父标题，可能是系列名称
}

interface IPlexSearchData<T = IPlexSearchItem> {
  Metadata: T[];
  identifier: string;
  mediaTagPrefix: string;
  offset?: number;
  size: number;
  totalSize?: number;
}

export default class Plex extends AbstractMediaServer<IPlexConfig> {
  get apiBaseUrl(): string {
    let serverAddress = this.config.address;
    if (serverAddress.includes("/web/index.html")) {
      serverAddress = serverAddress.replace(/\/web\/index.html#.+/, "");
    }
    return serverAddress;
  }

  get webBaseUrl(): string {
    let serverAddress = this.config.address;
    if (serverAddress.includes("/web/index.html")) {
      serverAddress = serverAddress.replace(/\/web\/index.html#.+/, "");
    }
    return serverAddress.replace(/\/$/, "") + "/web/index.html";
  }

  protected async request<T = any, D = any>(
    url: string,
    config: AxiosRequestConfig<D> = {},
  ): Promise<AxiosResponse<T, D>> {
    config.baseURL = this.apiBaseUrl;
    config.url = url;
    config.timeout ??= this.config.timeout; // 未额外传入 timeout 时，使用默认的 timeout
    config.method ??= "GET"; // 默认使用 GET 方法

    // 处理认证方式
    config.params ??= {};
    config.params["X-Plex-Token"] = this.config.auth.apikey;

    config.responseType = "json";
    return axios.request<T>(config);
  }

  private async getServerIdentity(): Promise<string | undefined> {
    const response = await this.request<IPlexJsonResponse<IPlexIdentityData>>("/identity");
    return response.data?.MediaContainer?.machineIdentifier;
  }

  public override async ping(): Promise<boolean> {
    const serverIdentity = await this.getServerIdentity();
    return !!serverIdentity;
  }

  /** 把 Plex 的 Guid 列表解析成 providerIds（imdb / tmdb / tvdb…） */
  private parseProviderIds(guids?: Array<{ id: string }>): Record<string, string> | undefined {
    if (!guids?.length) return undefined;
    const providerIds: Record<string, string> = {};
    for (const guid of guids) {
      const [provider, value] = guid.id.split("://");
      if (provider && value) providerIds[provider.toLowerCase()] = value;
    }
    return Object.keys(providerIds).length > 0 ? providerIds : undefined;
  }

  /** 演职人员（只取详情接口返回的 Role / Director，限制条数避免 UI 过长） */
  private parsePeople(item: IPlexSearchItem): Array<{ name: string; role?: string; type?: string }> | undefined {
    const people = [
      ...(item.Role ?? []).map((person) => ({ name: person.tag, role: person.role, type: "Role" })),
      ...(item.Director ?? []).map((person) => ({ name: person.tag, type: "Director" })),
    ];
    return people.length > 0 ? people.slice(0, 12) : undefined;
  }

  /** Plex 的观看进度：viewOffset / duration 都是毫秒，换算成 0-100 */
  private getPlexPlayedPercentage(item: IPlexSearchItem): number | undefined {
    if ((item.viewCount ?? 0) > 0 && !item.viewOffset) return 100;
    if (!item.viewOffset || !item.duration) return item.viewCount ? 100 : undefined;
    return Math.min(100, Math.max(0, Math.round((item.viewOffset / item.duration) * 100)));
  }

  /**
   * 调研 B12：详情弹窗按需拉取单条目（`/library/metadata/{ratingKey}`，这个接口带 `Stream[]` 与 `Role[]`）。
   * 拉不到时返回 undefined，UI 静默降级。
   */
  public override async getItemDetail(itemId: string): Promise<IMediaServerItem<IPlexSearchItem> | undefined> {
    try {
      const response = await this.request<IPlexJsonResponse<IPlexSearchData>>(`/library/metadata/${itemId}`);
      const item = response.data?.MediaContainer?.Metadata?.[0];
      if (response.status === 200 && item) {
        return this.buildPlexMediaItem(item, await this.getServerIdentity());
      }
    } catch (e) {
      // 忽略：详情拿不到就只展示列表已有的信息
    }
    return undefined;
  }

  /**
   * 调研 C14 / C20：**按需**生成媒体库概览。
   * 遍历 `/library/sections` 的每个媒体库并分页取条目，就地聚合后只回传统计结果。
   */
  public override async getLibraryOverview(
    options: IMediaServerOverviewOptions = {},
  ): Promise<IMediaServerOverview | undefined> {
    const pageSize = Math.max(1, Math.min(options.pageSize ?? 200, 500));
    const maxItems = Math.max(pageSize, options.maxItems ?? 20000);
    const accumulator = createOverviewAccumulator();
    const identity = await this.getServerIdentity();

    const sectionsResponse =
      await this.request<IPlexJsonResponse<{ Directory?: Array<{ key: string; type: string }> }>>("/library/sections");
    const sections = sectionsResponse.data?.MediaContainer?.Directory ?? [];

    let truncated = false;
    for (const section of sections) {
      if (truncated) break;

      let startIndex = 0;
      while (true) {
        const limit = Math.min(pageSize, maxItems);
        const response = await this.request<IPlexJsonResponse<IPlexSearchData>>(
          `/library/sections/${section.key}/all`,
          { params: { "X-Plex-Container-Start": startIndex, "X-Plex-Container-Size": limit } },
        );
        const container = response.data?.MediaContainer;
        const items = (container?.Metadata ?? []).filter((item) => item.type === "movie" || item.type === "show");
        if (items.length === 0) break;

        for (const item of items) {
          accumulator.add(this.buildPlexMediaItem(item, identity));
        }
        startIndex += items.length;

        if (items.length < limit) break;
        if (startIndex >= maxItems) {
          truncated = true;
          break;
        }
      }
    }

    return accumulator.build(this.config.id!, truncated);
  }

  /** 单条目映射：搜索结果、详情与概览共用同一套字段 */
  private buildPlexMediaItem(
    item: IPlexSearchItem | IPlexRecentlyAddedItem,
    serverIdentity: string | undefined,
  ): IMediaServerItem<IPlexSearchItem | IPlexRecentlyAddedItem> {
    const media = (item as IPlexSearchItem).Media?.[0];
    const part = media?.Part?.[0];
    const streams = part?.Stream ?? [];
    const videoStream = streams.find((stream) => stream.streamType === 1);
    const hasStreams = streams.length > 0;
    const isPlayed = (item.viewCount ?? 0) > 0;

    const mediaItem: IMediaServerItem<IPlexSearchItem | IPlexRecentlyAddedItem> = {
      server: this.config.id!,
      id: item.ratingKey ?? item.key.replace(/\/children$/, ""),
      // @ts-ignore
      name: item.parentTitle ? `${item.parentTitle} (${item.title})` : item.title,
      url: `${this.webBaseUrl}#!/server/${serverIdentity}/details?key=${item.key.replace(/\/children$/, "")}`,
      type: item.type === "movie" ? "Movie" : item.type,
      description: item.summary,
      format: media?.container ?? "",
      size: part?.size ?? 0,
      duration: item.duration ?? 0,
      poster: item.thumb ? urlJoin(this.apiBaseUrl, `${item.thumb}?X-Plex-Token=${this.config.auth.apikey}`) : "",
      tags: item.Genre?.map((tag) => ({ name: tag.tag, url: "" })) ?? [],
      rating: item.audienceRating ?? "-",
      streams: streams
        .filter((stream) => stream.streamType === 1 || stream.streamType === 2 || stream.streamType === 3)
        .map((stream) => ({
          title: stream.displayTitle ?? stream.title ?? stream.language ?? stream.codec ?? "",
          type: stream.streamType === 1 ? "Video" : stream.streamType === 2 ? "Audio" : "Subtitle",
          format: stream.codec ?? "",
        })),
      // 调研 A2：Plex 的流明细来自 Media[].Part[].Stream[]
      mediaInfo:
        hasStreams || media
          ? {
              video: videoStream
                ? {
                    width: videoStream.width ?? media?.width,
                    height: videoStream.height ?? media?.height,
                    resolution: getResolutionLabel(
                      videoStream.width ?? media?.width,
                      videoStream.height ?? media?.height,
                    ),
                    codec: videoStream.codec ?? media?.videoCodec,
                    profile: videoStream.profile ?? media?.videoProfile,
                    videoRange: videoStream.doviPresent
                      ? "DolbyVision"
                      : videoStream.colorTrc === "smpte2084"
                        ? "HDR10"
                        : videoStream.colorTrc === "arib-std-b67"
                          ? "HLG"
                          : undefined,
                    bitrate: videoStream.bitrate ?? media?.bitrate,
                    frameRate: videoStream.frameRate ? Number(videoStream.frameRate) : undefined,
                  }
                : undefined,
              audio: streams
                .filter((stream) => stream.streamType === 2)
                .map((stream) => ({
                  title: stream.displayTitle ?? stream.title,
                  codec: stream.codec,
                  language: stream.languageCode ?? stream.language,
                  channels: stream.channels,
                  channelLayout: stream.audioChannelLayout,
                  isDefault: stream.selected,
                })),
              subtitle: streams
                .filter((stream) => stream.streamType === 3)
                .map((stream) => ({
                  title: stream.displayTitle ?? stream.title,
                  codec: stream.codec,
                  language: stream.languageCode ?? stream.language,
                  isExternal: !!stream.key,
                  isDefault: stream.selected,
                })),
            }
          : undefined,
      // 调研 A3 / A4 / A5
      path: part?.file,
      dateCreated: item.addedAt ? new Date(item.addedAt * 1000).toISOString() : undefined,
      externalUrls: item.Guid?.length
        ? [{ name: "Plex", url: `${this.webBaseUrl}#!/server/${serverIdentity}/details?key=${item.key}` }]
        : undefined,
      // 调研 B7–B12
      providerIds: this.parseProviderIds(item.Guid),
      productionYear: item.year,
      officialRating: item.contentRating,
      criticRating: item.rating,
      studios: item.studio ? [item.studio] : undefined,
      mediaSourceCount: (item as IPlexSearchItem).Media?.length,
      seriesName: (item as IPlexRecentlyAddedItem).parentTitle,
      indexNumber: item.index,
      parentIndexNumber: item.parentIndex,
      isHd: media?.videoResolution ? media.videoResolution !== "sd" : undefined,
      width: media?.width ?? videoStream?.width,
      height: media?.height ?? videoStream?.height,
      labels: item.Label?.map((label) => label.tag),
      taglines: item.tagline ? [item.tagline] : undefined,
      people: this.parsePeople(item),
      user: {
        IsFavorite: false, // 搜索结果里 Plex 不返回收藏状态
        IsPlayed: isPlayed,
        playCount: item.viewCount,
        playbackPosition: item.viewOffset ? item.viewOffset / 1000 : undefined,
        playedPercentage: isPlayed || item.viewOffset ? this.getPlexPlayedPercentage(item) : undefined,
        lastPlayedDate: item.lastViewedAt ? new Date(item.lastViewedAt * 1000).toISOString() : undefined,
      },
      raw: item, // Store the raw data for reference
    };

    return mediaItem;
  }

  public override async getSearchResult(
    keywords: string = "",
    config: IMediaServerSearchOptions = {},
  ): Promise<IMediaServerSearchResult> {
    // 预定义搜索结果
    const result: IMediaServerSearchResult<IPlexSearchItem> = {
      status: EResultParseStatus.unknownError,
      items: [],
    };

    const serverIdentity = await this.getServerIdentity();

    // 生成基本请求参数
    let requestConfig: AxiosRequestConfig = { params: {} };
    config.startIndex = requestConfig.params["X-Plex-Container-Start"] = config.startIndex ?? 0;
    config.limit = requestConfig.params["X-Plex-Container-Size"] = config.limit ?? 50;
    requestConfig = toMerged(requestConfig, this.config.defaultSearchExtraRequestConfig ?? {});

    try {
      // 从服务器获取最新数据 /library/recentlyAdded
      let url = "/library/recentlyAdded";

      // 如果有 keywords 则进行搜索 /search?query=string   注意两个接口返回略有不同
      if (keywords !== "") {
        url = "/search";
        requestConfig.params.query = keywords;
      }

      const resp = await this.request<IPlexJsonResponse<IPlexSearchData>>(url, requestConfig);

      const items = resp?.data?.MediaContainer?.Metadata ?? [];
      for (const item of items) {
        result.items.push(this.buildPlexMediaItem(item, serverIdentity));
      }
      result.options = config;
      result.status = EResultParseStatus.success;
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 401) {
        result.status = EResultParseStatus.needLogin;
      }
    }

    return result;
  }
}
