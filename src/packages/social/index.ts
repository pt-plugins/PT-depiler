import axios from "axios";
import {
  IFetchSocialSiteInformationConfig,
  ISocialInformation,
  TSupportSocialSite,
  TSupportSocialSitePageParserMatches,
} from "./types.ts";

export * from "./types.ts";

// From https://github.com/ourbits/PtGen#usage
export const buildInPtGenApi = [
  { provider: "Github Pages", url: "https://ourbits.github.io/PtGen/<site>/<sid>.json" },
  { provider: "OurHelp CDN", url: "https://cdn.ourhelp.club/ptgen/<site>/<sid>.json" },
  { provider: "OurHelp API", url: "https://api.ourhelp.club/infogen?site=<site>&sid=<sid>" },
];

interface socialEntity {
  parse: (query: string) => string;
  build: (id: string) => string;
  pageParserMatches: TSupportSocialSitePageParserMatches;
  transformPtGen?: (data: any) => ISocialInformation;
  fetchInformation: (id: string, config: IFetchSocialSiteInformationConfig) => Promise<ISocialInformation>;
}

export const socialContent = import.meta.glob<socialEntity>("./entity/*.ts", { eager: true });
export const socialEntityList = Object.keys(socialContent).map((value: string) => {
  return value.replace(/^\.\/entity\//, "").replace(/\.ts$/, "");
}) as TSupportSocialSite[];

export type TSupportSocialSite$1 = (typeof socialEntityList)[number];

const PtGenApiSupportSite: TSupportSocialSite$1[] = [] as const;

export const socialBuildUrlMap = {} as Record<TSupportSocialSite$1, socialEntity["build"]>;
export const socialParseUrlMap = {} as Record<TSupportSocialSite$1, socialEntity["parse"]>;
export const socialPageParserMatchesMap = {} as Record<TSupportSocialSite$1, TSupportSocialSitePageParserMatches>;

export function getSocialModule(site: TSupportSocialSite$1): socialEntity {
  return socialContent[`./entity/${site}.ts`];
}

for (const socialEntity of socialEntityList) {
  const socialModule = getSocialModule(socialEntity);

  socialBuildUrlMap[socialEntity] = socialModule.build;
  socialParseUrlMap[socialEntity] = socialModule.parse;
  socialPageParserMatchesMap[socialEntity] = socialModule.pageParserMatches;

  if (socialModule.transformPtGen) {
    PtGenApiSupportSite.push(socialEntity);
  }
}

export async function getSocialSiteInformation(
  site: TSupportSocialSite$1,
  id: string,
  config: IFetchSocialSiteInformationConfig = {},
  // @ts-ignore
): Promise<ISocialInformation | undefined> {
  const socialModule = getSocialModule(site);
  const { preferPtGen = true, ptGenEndpoint = buildInPtGenApi[0].url, timeout = 5e3 } = config;

  if (preferPtGen && PtGenApiSupportSite.includes(site)) {
    console?.log("Use PtGen API to fetch social site information ", { site, id });

    for (const ptGenEndpointElement of new Set<string>([ptGenEndpoint, buildInPtGenApi.at(-1)!.url].filter(Boolean))) {
      const ptGenUrl = ptGenEndpointElement.replace("<site>", site).replace("<sid>", id);
      try {
        const req = await axios.get(ptGenUrl, { timeout, responseType: "json" });
        if (req.status === 200) {
          const data = req.data as any;
          if (data.success !== false) {
            return socialModule.transformPtGen!(data);
          }
        }
      } catch (error) {}
    }
  }

  // 如果没有使用 PtGen API 或者 PtGen API 获取失败，则使用内置的解析方法
  console?.log("Use build-in API to fetch social site information:", { site, id });
  return await socialModule.fetchInformation(id, config);
}
