/**
 * @JackettDefinitions https://github.com/Jackett/Jackett/blob/master/src/Jackett.Common/Definitions/ptzone.yml
 * @PTPPDefinitions https://github.com/pt-plugins/PT-Plugin-Plus/blob/dev/resource/sites/ptzone.xyz/config.json
 * @PDSDefinitions https://github.com/mantou568/pre-dessert-sites/blob/main/site_config/sites/ptzone.json
 * @PTMDefinitions https://github.com/JustLookAtNow/pt_mate/blob/master/assets/sites/ptzone.json
 */
import type { ISiteMetadata } from "../types";
import { SchemaMetadata, xiaomloveDefaultUserLevelRequirements } from "../schemas/NexusPHP";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,

  version: 1,
  id: "ptzone",
  name: "PTzone",
  description: "分享地带！",
  tags: ["影视", "综合"],
  timezoneOffset: "+0800",

  collaborator: ["xusky0328"],

  type: "private",
  schema: "NexusPHP",

  urls: ["uggcf://cgmbar.klm/"],
  favicon: "./_default_nexusphp.png",

  category: [
    {
      name: "分类",
      key: "cat",
      options: [
        { value: 401, name: "Movies(电影)" },
        { value: 402, name: "TV Series(电视剧)" },
        { value: 403, name: "TV Shows(综艺)" },
        { value: 404, name: "Documentaries(纪录片)" },
        { value: 405, name: "Animations(动漫)" },
        { value: 406, name: "Music(音乐)" },
        { value: 407, name: "Sports(体育)" },
        { value: 408, name: "HQ Audio(音乐)" },
        { value: 410, name: "Software(软件)" },
        { value: 411, name: "Games(游戏)" },
        { value: 409, name: "Others(其它)" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "媒介",
      key: "medium",
      options: [
        { value: 1, name: "Blu-ray" },
        { value: 2, name: "HD DVD" },
        { value: 3, name: "Remux" },
        { value: 4, name: "WEB-DL" },
        { value: 5, name: "HDTV" },
        { value: 6, name: "DVDR" },
        { value: 7, name: "Encode" },
        { value: 8, name: "CD" },
        { value: 9, name: "Track" },
        { value: 10, name: "UHD" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "编码",
      key: "codec",
      options: [
        { value: 1, name: "H.264" },
        { value: 2, name: "VC-1" },
        { value: 3, name: "MPEG-2" },
        { value: 4, name: "MPEG-4" },
        { value: 5, name: "Other" },
        { value: 6, name: "H.265" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "音频编码",
      key: "audiocodec",
      options: [
        { value: 1, name: "FLAC" },
        { value: 2, name: "APE" },
        { value: 3, name: "DTS" },
        { value: 4, name: "MP3" },
        { value: 5, name: "OGG" },
        { value: 6, name: "AAC" },
        { value: 7, name: "Other" },
        { value: 8, name: "AC3" },
        { value: 10, name: "DTS-HD MA" },
        { value: 11, name: "DD/AC3" },
        { value: 12, name: "DDP/EAC3" },
        { value: 13, name: "DTS-HD" },
        { value: 14, name: "TrueHD" },
        { value: 15, name: "WAV" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "分辨率",
      key: "standard",
      options: [
        { value: 1, name: "1080p" },
        { value: 2, name: "1080i" },
        { value: 3, name: "720p" },
        { value: 4, name: "SD" },
        { value: 5, name: "8K" },
        { value: 6, name: "4K" },
      ],
      cross: { mode: "append" },
    },
    {
      name: "制作组",
      key: "team",
      options: [
        { value: 1, name: "HDS" },
        { value: 2, name: "CHD" },
        { value: 3, name: "MySiLU" },
        { value: 4, name: "WiKi" },
        { value: 5, name: "Other" },
        { value: 6, name: "PTZWeb" },
      ],
    },
  ],

  levelRequirements: [...xiaomloveDefaultUserLevelRequirements],

  userInfo: {
    ...SchemaMetadata.userInfo,

    /**
     * 不继承缓存里的 id（其余同 schema 默认）。
     *
     * 本站对 /userdetails.php 做了加固：不带 id 会直接返回「錯誤 無效的ID！基於安全考慮，我們記錄了本次行為。」错误页，
     * 所以第二步必须拿到真实 id。而 AbstractPrivateSite 判断「该步骤字段是否齐全」只看 key 是否存在，
     * 一旦某次解析把空的 id（querystring 过滤器取不到参数时返回的是 `""` 而不是 `undefined`）写进缓存，
     * 后续每次都会把 `""` 继承为「已有 id」→ 跳过取 id 的 /index.php 请求 → 第二步断言 `params.id` 恒失败
     * → 该站 userInfo 永久停在 parseError（id 恒为空），站点恢复后也无法自愈。
     *
     * 清空后每次刷新都会重新从 /index.php 解析 id，空值不会被缓存成「已获取」。
     * refs:
     * - https://github.com/pt-plugins/PT-depiler/issues/1644
     * - https://github.com/sunerpy/pt-tools/blob/main/site/v2/definitions/ptzone.go
     */
    pickLast: [],
  },
};
