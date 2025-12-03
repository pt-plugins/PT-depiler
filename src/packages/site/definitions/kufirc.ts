import { type ISiteMetadata } from "../types";
import { SchemaMetadata } from "../schemas/Luminance";
import { buildCategoryOptionsFromList } from "../utils";

export const siteMetadata: ISiteMetadata = {
  ...SchemaMetadata,
  id: "kufirc",
  version: 1,
  name: "kufirc",
  aka: ["kf"],
  tags: ["成人", "XXX"],
  description: "XXX Animal",

  type: "private",
  schema: "Luminance",

  urls: ["uggcf://xhsvep.pbz/"],

  category: [
    {
      name: "类别",
      key: "filter_cat",
      options: [
        { name: "Amateur", value: "30" },
        { name: "Anal", value: "29" },
        { name: "Animal", value: "5" },
        { name: "Asian", value: "27" },
        { name: "BBW", value: "26" },
        { name: "BDSM", value: "44" },
        { name: "Big Ass", value: "25" },
        { name: "Big Tits", value: "24" },
        { name: "Black", value: "34" },
        { name: "Busty", value: "35" },
        { name: "Classic", value: "23" },
        { name: "Creampie", value: "33" },
        { name: "Cumshot", value: "22" },
        { name: "Feature", value: "36" },
        { name: "Fetish", value: "21" },
        { name: "Film/Cam/Hun", value: "31" },
        { name: "Film/Xvid/hun", value: "46" },
        { name: "Foreign", value: "37" },
        { name: "Gay / Bi", value: "19" },
        { name: "Hardcore", value: "18" },
        { name: "HD porn", value: "32" },
        { name: "Hentai / 3D", value: "28" },
        { name: "Homemade", value: "17" },
        { name: "Image", value: "11" },
        { name: "Interracial", value: "38" },
        { name: "Latina", value: "48" },
        { name: "Lesbian", value: "16" },
        { name: "Magazines", value: "56" },
        { name: "Magyar", value: "6" },
        { name: "Masturbation", value: "15" },
        { name: "Mature", value: "14" },
        { name: "Megapack", value: "13" },
        { name: "Milf", value: "55" },
        { name: "Natural Tits", value: "49" },
        { name: "Old + Young", value: "39" },
        { name: "Oral", value: "12" },
        { name: "Orgia / Gang Bang", value: "20" },
        { name: "Other", value: "42" },
        { name: "Parody", value: "50" },
        { name: "Paysite", value: "41" },
        { name: "Piss", value: "40" },
        { name: "Porn Music Videos", value: "43" },
        { name: "Pov", value: "54" },
        { name: "Pregnant / Preggo", value: "45" },
        { name: "Scat/Puke", value: "57" },
        { name: "Shemale / TS", value: "10" },
        { name: "Siterip", value: "51" },
        { name: "Softcore", value: "52" },
        { name: "Squirt", value: "53" },
        { name: "Straight", value: "9" },
        { name: "Teen", value: "8" },
        { name: "VR", value: "47" },
        { name: "XXX Games / Applications", value: "7" },
      ],
      cross: { mode: "appendQuote" },
    },
    {
      name: "标签和分辨率",
      key: "taglist",
      options: buildCategoryOptionsFromList([
        ["1080p", "1on1", "2160p", "720p", "amateur", "anal", "big.ass"],
        ["big.tits", "brunette", "cowgirl", "cumshot", "doggy", "facial", "family.strokes"],
        ["hardcore", "hd", "homemade", "horse", "hungarian", "hungary", "natural.tits", "oral"],
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
      name: "Apprentice",
      privilege: "The default class of new members.",
    },
    {
      id: 2,
      name: "Perv",
      interval: "P1W",
      uploaded: "10GB",
      ratio: 0.7,
      privilege: "Must have been be a member for at least 1 week, uploaded 10GB+, ratio 0.7+",
    },
    {
      id: 3,
      name: "Good Perv",
      interval: "P4W",
      uploaded: "25GB",
      ratio: 1.05,
      privilege: "Must have been be a member for at least 4 weeks, uploaded 25GB+, ratio 1.05+",
    },
    {
      id: 4,
      name: "Sextreme Perv",
      interval: "P13W",
      uploaded: "1TB",
      uploads: 50,
      ratio: 1.05,
      privilege: "Must have been be a member for at least 13 weeks, uploaded 1TB+, uploaded 50+ torrents, ratio 1.05+",
    },
    {
      id: 5,
      name: "Smut Peddler",
      interval: "P26W",
      uploaded: "10TB",
      uploads: 250,
      ratio: 1.05,
      privilege:
        "Must have been be a member for at least 26 weeks, uploaded 10TB+, uploaded 250+ torrents, ratio 1.05+",
    },
    {
      id: 6,
      name: "Legenda",
      privilege: "Legendary user with special privileges.",
    },
  ],
};
