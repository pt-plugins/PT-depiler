import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Luminance";
import { buildCategoryOptions } from "../utils";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "happyfappy",
  version: 2,
  name: "HappyFappy",
  aka: ["HF"],
  tags: ["成人"],
  collaborator: ["hyuan280"],

  type: "private",
  schema: "Luminance",

  urls: ["uggcf://jjj.uncclsnccl.bet/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "Fansite", value: "6" },
        { name: "Asian", value: "11" },
        { name: "Games", value: "13" },
        { name: "Gay / Bi", value: "3" },
        { name: "Interracial", value: "4" },
        { name: "Lesbian", value: "5" },
        { name: "Packs", value: "9" },
        { name: "Pics", value: "10" },
        { name: "Pron", value: "1" },
        { name: "Retro", value: "8" },
        { name: "Transexual", value: "12" },
        { name: "VR", value: "7" },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "标签和分辨率",
      key: "taglist",
      options: buildCategoryOptions([
        ["1080p", "2160p", "720p", "1on1", "anal", "big.ass", "big.dick", "big.tits", "blonde", "blowjob", "brunette"],
        ["cowgirl", "creampie", "cum.in.mouth", "cumshot", "cunnilingus", "deepthroat", "doggy.style", "face.fuck"],
        ["facial", "fake.tits", "fingering", "handjob", "hardcore", "invalid.tag", "lesbian", "masturbation", "milf"],
        ["missionary", "natural.tits", "pussy.fingering", "rimming", "shaved.pussy", "sideways", "small.tits"],
        ["tattoo", "teen", "tit.fuck", "toys", "virtual.reality"],
      ]),
      cross: { mode: "custom" },
      generateRequestConfig: (selectedOptions) => {
        // tag参数是taglist=tag1+tag2+...
        const params: Record<string, any> = {};
        const taglist: string[] = [];
        (selectedOptions as Array<number | string>).forEach((value) => {
          const strValue = value.toString();
          taglist.push(strValue);
        });
        if (taglist.length > 0) {
          params.taglist = taglist.join("+");
        }
        return { requestConfig: { params } };
      },
    },
    {
      name: "优惠",
      key: "free",
      options: [{ name: "100% Freeleech", value: "filter_freeleech" }],
      cross: { mode: "append", key: "" },
    },
  ],

  search: {
    ...SchemaMetadata!.search!,
    requestConfig: {
      ...SchemaMetadata!.search!.requestConfig!,
      params: {
        perPage: 100,
      },
    },
    advanceKeywordParams: {
      // 支持站点的高级搜索
      terms: {
        requestConfigTransformer: ({ requestConfig: config }) => {
          if (config?.params?.title) {
            config.params.searchtext = config.params.title;
            delete config.params.title;
          }
          return config!;
        },
      },
    },
    selectors: {
      ...SchemaMetadata!.search!.selectors!,
      category: {
        selector: ["td.cats_col > div"],
        attr: "title",
        filters: [
          (query: string) => {
            if (query.toLowerCase() === "vr") {
              return "VR";
            }
            return query.toLowerCase().replace(/\b\w/g, (char: any) => char.toUpperCase());
          },
        ],
      },
    },
  },

  levelRequirements: [
    {
      id: 1,
      name: "Sex Worker",
      privilege:
        "Class every new user starts with；can upload torrents；can create and vote in Requests；can access forums；can make bookmarks；can set forum signature (up to 128 characters)",
    },
    {
      id: 2,
      name: "Pimp",
      uploaded: "25GB",
      ratio: 1.15,
      interval: "P2W",
      privilege:
        "can use the top 10 system；can use the notifications system；can create collages；can use upload templates；can add tags；can play slot machine；can set forum signature (up to 128 characters)；can set torrent footer",
    },
    {
      id: 3,
      name: "Pornstar Trainee",
      uploaded: "50GB",
      ratio: 1.5,
      uploads: 10,
      posts: 5,
      interval: "P4W",
      privilege:
        "can create polls in the forum；can add multiple tags；can view site stats；can sent special gift；can set forum signature (up to 256 characters)",
    },
    {
      id: 4,
      name: "Lube Handler",
      uploaded: "10TB",
      ratio: 2.5,
      uploads: 150,
      interval: "P16W",
      privilege:
        "can use Advanced bbcode tags；can use avatar size 150x200；can set forum signature (up to 512 characters)",
    },
    {
      id: 5,
      name: "Toy Expert",
      uploaded: "25TB",
      ratio: 5.0,
      uploads: 500,
      posts: 100,
      interval: "P28W",
      privilege:
        "can use Forum: Users Invite Forum；can make public upload templates.；upload, rank up and find out what unlocks.",
    },
    {
      id: 6,
      name: "Pornstar",
      uploaded: "50TB",
      ratio: 7.0,
      uploads: 1000,
      interval: "P28W",
      privilege: "upload, rank up and find out what unlocks.",
    },
  ],
};
