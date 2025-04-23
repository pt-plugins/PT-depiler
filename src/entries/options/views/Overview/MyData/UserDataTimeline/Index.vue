<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, useTemplateRef } from "vue";
import { useElementSize } from "@vueuse/core";
import { useDisplay } from "vuetify";
import { deepToRaw, formatDate, formatSize, formValidateRules } from "@/options/utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useResetableRef } from "@/options/directives/useResetableRef.ts";
import {
  definitionList,
  EResultParseStatus,
  ISiteMetadata,
  ISiteUserConfig,
  IUserInfo,
  NO_IMAGE,
  TSiteID,
} from "@ptd/site";
import { IStoredUserInfo } from "@/shared/storages/types/metadata.ts";
import { formatRatio } from "@/options/views/Overview/MyData/utils.ts";
import { sendMessage } from "@/messages.ts";
import { differenceInDays } from "date-fns";
import { version as EXT_VERSION } from "~/../package.json";
import Konva from "konva";

const git = __GIT_VERSION__;

const { width: containerWidth } = useElementSize(useTemplateRef("canvasContainer"));
const canvasStage = useTemplateRef("canvasStage"); // await canvasStage.value.getStage().toBlob()

const display = useDisplay();
const metadataStore = useMetadataStore();

interface IMaxInfo {
  site: IStoredUserInfo;
  maxValue: number;
  subSite: IStoredUserInfo;
  subValue: number;
}

type ITimelineUserInfoField = "uploads" | "uploaded" | "downloaded" | "seeding" | "seedingSize";

interface ITimelineData {
  createAt: Date;
  nameInfo: {
    name: string;
    maxCount: number;
  };
  joinTimeInfo: {
    site: IStoredUserInfo;
    time: number;
    years: string;
  };
  siteInfo: IStoredUserInfo[];
  maxUploadsInfo: IMaxInfo;
  maxUploadedInfo: IMaxInfo;
  maxDownloadedInfo: IMaxInfo;
  maxSeedingInfo: IMaxInfo;
  maxSeedingSizeInfo: IMaxInfo;
  total: {
    sites: number;
  } & Required<Pick<IUserInfo, ITimelineUserInfoField | "ratio">>;
}

const userInfoToResultKeymap: Record<ITimelineUserInfoField, keyof ITimelineData> = {
  uploads: "maxUploadsInfo",
  uploaded: "maxUploadedInfo",
  downloaded: "maxDownloadedInfo",
  seeding: "maxSeedingInfo",
  seedingSize: "maxSeedingSizeInfo",
};

const allSiteMetadata = shallowRef<Record<TSiteID, ISiteMetadata>>({});

function canThisSiteShow(siteId: TSiteID) {
  return computed(() => {
    const siteUserInfo = metadataStore.lastUserInfo[siteId] as IStoredUserInfo;
    if (
      !siteUserInfo ||
      !siteUserInfo.name ||
      !siteUserInfo.joinTime ||
      siteUserInfo.status !== EResultParseStatus.success
    ) {
      return false;
    }

    const siteUserConfig = (metadataStore.sites[siteId] ?? {}) as ISiteUserConfig;
    const siteMetadata = (allSiteMetadata.value[siteId] ?? {}) as ISiteMetadata;

    return !(
      // siteMetadata.isDead ||
      // siteUserConfig.isOffline ||
      (!Object.hasOwn(siteMetadata, "userInfo") || !siteUserConfig.allowQueryUserInfo)
    );
  });
}

const selectedSites = ref<TSiteID[]>([]); // 选中的站点
const { ref: timelineData, reset: resetTimelineData } = useResetableRef<ITimelineData>(() => {
  // 初始化需要展示的数据
  const currentDate = new Date();
  const result: ITimelineData = {
    createAt: currentDate,
    nameInfo: { name: "test", maxCount: 0 },
    joinTimeInfo: { site: {} as IStoredUserInfo, time: Infinity, years: "0" },
    siteInfo: [],
    maxUploadsInfo: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
    maxUploadedInfo: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
    maxDownloadedInfo: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
    maxSeedingInfo: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
    maxSeedingSizeInfo: { site: {} as IStoredUserInfo, maxValue: 0, subSite: {} as IStoredUserInfo, subValue: 0 },
    total: { sites: 0, uploads: 0, uploaded: 0, downloaded: 0, seeding: 0, seedingSize: 0, ratio: -1 },
  };

  const lastUserInfo = deepToRaw(Object.values(metadataStore.lastUserInfo)) as IStoredUserInfo[]; // 获取所有站点的用户信息，并取消响应式
  const userNames: Record<string, number> = {};
  const addedSiteInfo: IStoredUserInfo[] = [];
  for (const userInfo of lastUserInfo) {
    // 未勾选的站点不展示
    //if (!selectedSites.value.includes(userInfo.site)) {
    //  continue;
    //}

    // 不能获取站点信息的站点，即使勾选了也不展示
    if (!canThisSiteShow(userInfo.site).value) {
      continue;
    }

    // 更新 result 信息， 这里其实并不需要判断 name & joinTime，但为了 ts 不报错。。。
    if (userInfo.name && userInfo.joinTime) {
      result.total.sites++;
      addedSiteInfo.push(userInfo); // 记录下所有能添加的站点

      if (!userNames[userInfo.name]) {
        userNames[userInfo.name] = 0;
      }
      userNames[userInfo.name]++;

      // 获取使用最多的用户名
      if (userNames[userInfo.name] > result.nameInfo.maxCount) {
        result.nameInfo.name = userInfo.name;
      }

      // 获取加入时间最久的站点
      if (userInfo.joinTime < result.joinTimeInfo.time) {
        result.joinTimeInfo.site = userInfo;
        result.joinTimeInfo.time = userInfo.joinTime;
        // 此处先不计算 years，在完成全部站点遍历后再计算
      }

      // 更新 uploads, uploaded, downloaded, seeding, seedingSize 信息
      for (const [userInfoKey, resultKey] of Object.entries(userInfoToResultKeymap)) {
        if (userInfo[userInfoKey] && userInfo[userInfoKey] > 0) {
          result.total[userInfoKey as ITimelineUserInfoField] += userInfo[userInfoKey]; // 更新总量

          // 更新最大值和次大值
          if (userInfo[userInfoKey] > (result[resultKey] as IMaxInfo).maxValue) {
            (result[resultKey] as IMaxInfo).subValue = (result[resultKey] as IMaxInfo).maxValue;
            (result[resultKey] as IMaxInfo).subSite = (result[resultKey] as IMaxInfo).site;
            (result[resultKey] as IMaxInfo).maxValue = userInfo[userInfoKey];
            (result[resultKey] as IMaxInfo).site = userInfo;
          } else if (userInfo[userInfoKey] > (result[resultKey] as IMaxInfo).subValue) {
            (result[resultKey] as IMaxInfo).subValue = userInfo[userInfoKey];
            (result[resultKey] as IMaxInfo).subSite = userInfo;
          }
        }
      }
    }
  }

  if (result.total.downloaded > 0) {
    result.total.ratio = result.total.uploaded / result.total.downloaded;
  }

  if (result.joinTimeInfo.time !== Infinity) {
    result.joinTimeInfo.years = (differenceInDays(currentDate, result.joinTimeInfo.time) / 365).toFixed(2);
  }

  result.siteInfo = addedSiteInfo.toSorted((a, b) => a.joinTime! - b.joinTime!); // 按照加入时间排序

  return result;
});

const cols = computed(() => {
  return display.mdAndUp.value ? [6, 6] : [12, 12];
});

const canvasWidth = 650; // 650px 是设计稿的宽度
const canvasHeight = computed<number>(() => 460 + 160 * timelineData.value.siteInfo.length); // FIXME 这是一个计算的值，应该是基础值加上选择站点的数量
const scale = computed(() => Math.min(containerWidth.value, canvasWidth) / canvasWidth); // 按照 650 来绘图，然后缩放显示
const stageConfig = computed(() => {
  return {
    width: canvasWidth,
    height: canvasHeight.value,
    scaleX: scale.value,
    scaleY: scale.value,
  };
});

// FIXME move it to control
const blue = ref<number>(0);
const allSiteFavicons = shallowRef<Record<TSiteID, HTMLImageElement>>({}); // 站点的图片

type TKonvaConfig = Record<string, any>;
const text = (config: TKonvaConfig) => ({ x: 0, y: 0, fontSize: 24, fill: "#fff", ...config });
const divider = (config: TKonvaConfig) => ({ x: 0, y: 0, stroke: "#0000001f", strokeWidth: 2, ...config });
const image = (config: TKonvaConfig) => {
  const imageBaseSize = config.size ?? 24;
  const imageWidth = config.image?.width ?? imageBaseSize;
  const imageHeight = config.image?.height ?? imageBaseSize;

  return {
    x: 0,
    y: 0,
    scaleX: imageBaseSize / imageWidth,
    scaleY: imageBaseSize / imageHeight,
    width: imageBaseSize,
    height: imageBaseSize,
    ...config,
  };
};

const favicon = (config: TKonvaConfig) => {
  return image({
    image: allSiteFavicons.value[config.site],
    filters: [Konva.Filters.Blur],
    blurRadius: blue.value,
    ...config,
  });
};

const icon = (config: TKonvaConfig) => ({
  fontSize: 32,
  fontFamily: "Material Design Icons",
  fill: "#ffffff",
  ...config,
});

const siteFaviconClipFunc =
  (radius: number = 24) =>
  (ctx: any) => {
    const radius = 24;
    ctx.beginPath();
    ctx.arc(stageConfig.value.width / 2, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    ctx.stroke();
    ctx.fill();
  };

const topSiteRenderAttr = [
  { iconFill: "#C9B037", siteKey: "site", valueKey: "maxValue" },
  { iconFill: "#B4B4B4", siteKey: "subSite", valueKey: "subValue" },
];

const topSiteItemRenderAttr = [
  { name: "maxUploadsInfo", format: (x: number) => x },
  { name: "maxUploadedInfo", format: (x: number) => formatSize(x) },
  { name: "maxDownloadedInfo", format: (x: number) => formatSize(x) },
  { name: "maxSeedingSizeInfo", format: (x: number) => formatSize(x) },
  { name: "maxSeedingInfo", format: (x: number) => x },
];

onMounted(async () => {
  // 加载所有站点的 metadata
  const canAddedSiteFavicons: Record<TSiteID, HTMLImageElement> = {};
  const canAddedSiteMetadata: Record<TSiteID, ISiteMetadata & { siteName: string }> = {};
  const metadataStore = useMetadataStore();
  for (const siteId of definitionList) {
    canAddedSiteMetadata[siteId] = {
      siteName: await metadataStore.getSiteName(siteId),
      ...(await metadataStore.getSiteMetadata(siteId)),
    };
    const siteFaviconUrl = await sendMessage("getSiteFavicon", { site: siteId });

    // 加载站点图标
    const siteFavicon = new Image();
    siteFavicon.src = siteFaviconUrl;
    try {
      await siteFavicon.decode();
    } catch (e) {
      siteFavicon.src = NO_IMAGE;
      await siteFavicon.decode();
    }

    canAddedSiteFavicons[siteId] = siteFavicon;
  }
  allSiteFavicons.value = canAddedSiteFavicons;
  allSiteMetadata.value = canAddedSiteMetadata;

  // TODO 从 route 中加载选择的站点，如果没有，则从 metaStore 中加载，如果还是没有，则选择全部可以的站点

  resetTimelineData();
  // 从metaStore 中加载并更新 timelieData 的部分属性；
  // timelineData.value.nameInfo.name = "test";
});

const faviconRefs = ref<Array<{ getNode: () => any; getStage: () => any }>>([]);

function updateBlue() {
  for (const faviconRef of faviconRefs.value) {
    const rectNode = faviconRef.getNode();
    rectNode.cache();
  }
}
</script>

<template>
  <v-card>
    <v-row class="pa-2" justify="start">
      <v-col
        ref="canvasContainer"
        :cols="cols[0]"
        class="mb-3 pa-0"
        :style="{
          width: `${stageConfig.width * scale.value}px`,
          'max-width': `${canvasWidth}px`,
          height: `${stageConfig.height * scale.value}px`,
        }"
      >
        <vk-stage :config="stageConfig" ref="canvasStage">
          <vk-layer>
            <!-- 1. 添加背景颜色，颜色为 blue-grey-darken-2，填满整个画布 -->
            <vk-rect :config="{ fill: '#455A64', x: 0, y: 0, width: stageConfig.width, height: stageConfig.height }" />

            <!-- 2. 绘制顶端概况 -->
            <vk-group :config="{ x: 0, y: 0 }">
              <!-- 2.1 用户图标 -->
              <vk-text :config="icon({ x: 20, y: 20, text: '󰀉' /* account-circle */ })" />
              <!-- 2.2 用户名 -->
              <vk-text :config="text({ x: 65, y: 26, text: timelineData.nameInfo.name, fontSize: 26 })" />
            </vk-group>

            <!-- 3. 绘制基础信息 -->
            <vk-group :config="{ x: 20, y: 70 }">
              <!-- 3.1 左侧 total -->
              <vk-text :config="text({ y: 0, text: `站点总数: ${timelineData.total.sites}` })" />
              <vk-text :config="text({ y: 30, text: `发布总数: ${timelineData.total.uploads}` })" />
              <vk-text :config="text({ y: 60, text: `上传总量: ${formatSize(timelineData.total.uploaded)}` })" />
              <vk-text :config="text({ y: 90, text: `下载总量: ${formatSize(timelineData.total.downloaded)}` })" />
              <vk-text :config="text({ y: 120, text: `做种总量: ${formatSize(timelineData.total.seedingSize)}` })" />
              <vk-text :config="text({ y: 150, text: `做种总数: ${timelineData.total.seeding}` })" />
              <vk-text :config="text({ y: 180, text: `总分享率: ${formatRatio(timelineData.total)}` })" />
              <vk-text :config="text({ y: 210, text: `． ．P龄: ≈ ${timelineData.joinTimeInfo.years} 年` })" />

              <!-- 3.2 中间分隔线、右侧冠军及亚军站点 -->
              <vk-group :config="{ x: 260, y: 0 }">
                <!-- 3.2.1 中间分隔线 -->
                <vk-line :config="divider({ points: [0, 5, 0, 235] })" />
                <!-- 3.2.2 右侧冠军及亚军站点 -->
                <template v-for="(type, index) in topSiteRenderAttr" :key="type.iconFill">
                  <vk-group :config="{ x: 20 + index * 180, y: 0 }">
                    <vk-text :config="icon({ y: 0, fill: type.iconFill, fontSize: 24, text: `󰔸` /* trophy */ })" />
                    <template v-for="(key, index) in topSiteItemRenderAttr" :key="key">
                      <vk-group v-if="timelineData[key.name][type.siteKey]" :config="{ x: 0, y: 30 * (index + 1) }">
                        <vk-image
                          :ref="(el) => faviconRefs.push(el)"
                          :config="favicon({ site: timelineData[key.name][type.siteKey].site, size: 20 })"
                        />
                        <vk-text :config="text({ x: 30, text: key.format(timelineData[key.name][type.valueKey]) })" />
                      </vk-group>
                    </template>
                  </vk-group>
                </template>
              </vk-group>
            </vk-group>

            <!-- 4. 绘制站点信息 -->
            <vk-group :config="{ x: 0, y: 320 }">
              <!-- 4.1 分割线 -->
              <vk-line :config="divider({ points: [20, 0, 630, 0] })" />
              <!-- 4.2 提示词 -->
              <vk-text
                :config="
                  text({
                    y: 15,
                    text: '...这些年走过的路...',
                    align: 'center',
                    fontStyle: 'bold',
                    width: stageConfig.width,
                  })
                "
              />
              <vk-text
                :config="
                  text({
                    y: 50,
                    text: '数据更新于 ' + formatDate(timelineData.createAt),
                    align: 'center',
                    fontSize: 12,
                    fill: '#b5b5b5',
                    width: stageConfig.width,
                  })
                "
              />
              <!-- 4.3 站点信息 -->
              <vk-group :config="{ x: 0, y: 70 }">
                <!-- 4.3.1 分割线 -->
                <vk-line
                  :config="
                    divider({
                      x: stageConfig.width / 2,
                      y: 0,
                      points: [0, 10, 0, timelineData.siteInfo.length * 160 + 10],
                    })
                  "
                />
                <!-- 4.3.2 不同站点的信息 -->
                <template v-for="(site, index) in timelineData.siteInfo" :key="site.site">
                  <vk-group :config="{ x: 0, y: index * 160 + 100 }">
                    <!-- 首先画出 favicon 并 clip -->
                    <vk-group :config="{ clipFunc: siteFaviconClipFunc(24) }">
                      <vk-image
                        :ref="(el) => faviconRefs.push(el)"
                        :config="favicon({ site: site.site, size: 38, x: stageConfig.width / 2 - 19, y: 0 - 19 })"
                      />
                    </vk-group>

                    <vk-group :config="index % 2 == 0 ? { x: 30, y: -80 } : { x: stageConfig.width / 2 + 60, y: -80 }">
                      <vk-text :config="text({ y: 20, text: `发布数: ${site.uploads ?? 0}`, fontSize: 16 })" />
                      <vk-text
                        :config="text({ y: 40, text: `上传量: ${formatSize(site.uploaded ?? 0)}`, fontSize: 16 })"
                      />
                      <vk-text
                        :config="text({ y: 60, text: `下载量: ${formatSize(site.downloaded ?? 0)}`, fontSize: 16 })"
                      />
                      <vk-text
                        :config="text({ y: 80, text: `做种量: ${formatSize(site.seedingSize ?? 0)}`, fontSize: 16 })"
                      />
                      <vk-text :config="text({ y: 100, text: `做种数: ${site.seeding ?? 0}`, fontSize: 16 })" />
                      <vk-text :config="text({ y: 120, text: `分享率: ${formatRatio(site)}`, fontSize: 16 })" />
                      <vk-line
                        v-if="index != timelineData.siteInfo.length - 1"
                        :config="divider({ points: [0, 160, stageConfig.width / 2 - 80, 160] })"
                      />
                    </vk-group>
                    <vk-group :config="index % 2 == 0 ? { x: stageConfig.width / 2 + 60, y: -20 } : { x: 30, y: -20 }">
                      <vk-text
                        :config="text({ y: 0, text: `${formatDate(site.joinTime!, 'yyyy-MM-dd')}`, fontStyle: 'bold' })"
                      />
                      <vk-text
                        :config="
                          text({ y: 28, text: site.name! + ` <${site.levelName!}>` + ` <${site.id!}>`, fontSize: 16 })
                        "
                      ></vk-text>
                    </vk-group>
                  </vk-group>
                </template>
              </vk-group>
            </vk-group>

            <!-- 5. 构建信息 -->
            <vk-group :config="{ x: 0, y: 435 + 160 * timelineData.siteInfo.length, drawBorder: true }">
              <vk-line :config="divider({ points: [20, -10, 630, -10] })" />
              <vk-text
                :config="
                  text({
                    width: stageConfig.width - 20,
                    align: 'right',
                    text:
                      'Created By PT-Depiler (v' +
                      EXT_VERSION +
                      (git?.count ? '.' + git.count : '') +
                      (git?.short ? '+' + git.short : '') +
                      ')',
                    fontSize: 12,
                    fill: '#b5b5b5',
                  })
                "
              />
            </vk-group>
          </vk-layer>
        </vk-stage>
      </v-col>
      <v-col :cols="cols[1]">
        <v-slider v-model="blue" :min="0" :max="8" :step="1" @update:model-value="updateBlue"></v-slider>
        <v-text-field v-model="timelineData.nameInfo.name" :rules="[formValidateRules.require()]"></v-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss"></style>
