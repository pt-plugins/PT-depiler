<script setup lang="ts">
import Konva from "konva";
import { useI18n } from "vue-i18n";
import { useElementSize } from "@vueuse/core";
import { formatDistanceToNow } from "date-fns";
import { zhCN as dFLocalZhCn } from "date-fns/locale/zh-CN";
import { computed, onMounted, reactive, ref, useTemplateRef } from "vue";
import { definitionList, type ISiteMetadata, NO_IMAGE, type TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { formatDate } from "@/options/utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";

import { version as EXT_VERSION } from "~/../package.json";

import {
  allSiteMetadata,
  canThisSiteShow,
  timelineDataRef,
  selectedSites,
  topSiteRenderAttr,
  ITimelineUserInfoField,
  CTimelineUserInfoField,
  allSiteFavicons,
} from "./utils.ts";

import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";
import NavButton from "@/options/components/NavButton.vue";
import { useRoute } from "vue-router";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const git = __GIT_VERSION__;

const { t } = useI18n();
const route = useRoute();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();
const control = metadataStore.userDataTimelineControl;

const isLoading = ref<boolean>(false);
const { ref: timelineData, reset: resetTimelineData } = timelineDataRef;
const allowEdit = reactive({ name: false, title: false }); // 是否允许编辑用户名、时间轴标题

type KonvaNode = { getNode: () => any; getStage: () => any };

const canvasStage = useTemplateRef<KonvaNode>("canvasStage"); // await canvasStage.value.getStage().toBlob()
const { width: containerWidth } = useElementSize(useTemplateRef("canvasContainer"));

const realAllSite = computed(() =>
  Object.values(metadataStore.lastUserInfo)
    .map((x) => x.site)
    .filter((x) => canThisSiteShow(x).value),
);

// Konvas 绘图部分
const canvasWidth = 650; // 650px 是设计稿的宽度
const perSiteHeight = 160; // 给每个站点 160px 的高度

// 动态计算 canvas 的高度
const nameInfoHeight = 70;
const topAndTotalInfoHeight = computed<number>(() => 10 + (realShowField.value.length + 2) * 30);
const siteTimeHeight = computed<number>(() =>
  control.showTimeline ? 95 + perSiteHeight * selectedSites.value.length : 0,
);
const canvasHeight = computed<number>(() => nameInfoHeight + topAndTotalInfoHeight.value + siteTimeHeight.value + 25);

// 得到 scale 和 stageConfig
const scale = computed(() => Math.min(containerWidth.value, canvasWidth) / canvasWidth); // 按照 650 来绘图，然后缩放显示
const stageConfig = computed(() => {
  return {
    width: canvasWidth,
    height: canvasHeight.value,
    scaleX: scale.value,
    scaleY: scale.value,
  };
});

// 绘制相关辅助函数
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

const favicon = (config: TKonvaConfig) =>
  image({
    image: allSiteFavicons.value[config.site],
    filters: [Konva.Filters.Blur],
    blurRadius: control.faviconBlue,
    ...config,
  });

const icon = (config: TKonvaConfig) =>
  text({
    fontSize: 32,
    fontFamily: "Material Design Icons",
    ...config,
  });

const siteFaviconClipFunc =
  (radius: number = 24, position: [number, number] = [stageConfig.value.width / 2, 0]) =>
  (ctx: any) => {
    ctx.beginPath();
    ctx.arc(position[0], position[1], radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    ctx.stroke();
    ctx.fill();
  };

const siteInfo = computed(() => timelineData.value.siteInfo.filter((x) => selectedSites.value.includes(x.site)));
const realShowField = computed(() => {
  const showField: ITimelineUserInfoField[] = [];
  for (const key of CTimelineUserInfoField) {
    if (control.showField[key.name]) {
      showField.push(key);
    }
  }
  return showField;
});

const formatSiteDate = (siteDate: number) =>
  computed(() => {
    if (control.dateFormat === "time_added") {
      return formatDate(siteDate, "yyyy-MM-dd");
    } else {
      const formatOptions: any = {
        addSuffix: true,
      };
      if (configStore.lang === "zh_CN") {
        formatOptions.locale = dFLocalZhCn;
      }

      return formatDistanceToNow(siteDate, formatOptions);
    }
  });

const faviconRefs = ref<KonvaNode[]>([]);
function updateBlue() {
  for (const faviconRef of faviconRefs.value) {
    const rectNode = faviconRef.getNode();
    rectNode.cache();
  }
}

onMounted(async () => {
  isLoading.value = true;
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

  // 从 route 中加载选择的站点，如果没有，则选择默认全部可以的站点
  if (route.query.sites?.length) {
    selectedSites.value = route.query.sites as string[];
  } else {
    selectedSites.value = realAllSite.value;
  }

  // 开始生成 timeline 的数据
  resetTimelineData();

  // 将 control 中的 name 和 timelineTitle 覆盖掉自动生成的
  if (control.name !== "") {
    timelineData.value.nameInfo.name = control.name;
  }

  if (control.timelineTitle !== "") {
    timelineData.value.timelineTitle = control.timelineTitle;
  }

  isLoading.value = false;
});

function exportTimelineImg() {
  const stage = canvasStage.value!.getStage();
  stage.toDataURL({
    mimeType: "image/png",
    pixelRatio: 3,
    callback: (dataUrl: string) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${timelineData.value.nameInfo.name}的时间轴（${formatDate(timelineData.value.createAt)}）.png`;
      a.click();
    },
  });
}

function saveControl() {
  metadataStore.$save();
  useRuntimeStore().showSnakebar("保存成功", { color: "success" });
}
</script>

<template>
  <v-card>
    <v-row class="pa-2" justify="start">
      <v-col
        ref="canvasContainer"
        :style="{
          'max-width': `${canvasWidth}px`,
          height: `${stageConfig.height * scale}px`,
        }"
        class="mb-3 pa-0 mr-3"
        cols="12"
      >
        <v-skeleton-loader v-if="isLoading" :min-height="canvasHeight" type="image@20"> </v-skeleton-loader>

        <!-- 使用 konva 来绘制 UserDataTimeLine -->
        <vk-stage ref="canvasStage" :config="stageConfig">
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
            <vk-group :config="{ x: 20, y: nameInfoHeight }">
              <!-- 3.1 左侧 totalInfo -->
              <vk-text
                :config="
                  text({
                    y: 0,
                    text: `${t('UserDateTimeline.total')}${t('UserDateTimeline.field.site')}: ${timelineData.totalInfo.sites}`,
                  })
                "
              />
              <vk-text
                v-for="(key, index) in realShowField"
                :key="key.name"
                :config="
                  text({
                    y: 30 * (index + 1),
                    text: `${t('UserDateTimeline.total')}${t('UserDateTimeline.field.' + key.name)}: ${key.format(timelineData.totalInfo[key.name])}`,
                  })
                "
              />
              <vk-text
                :config="
                  text({
                    y: 30 * (realShowField.length + 1),
                    text: `． ．P龄: ≈ ${timelineData.joinTimeInfo.years} 年`,
                  })
                "
              />

              <!-- 3.2 中间分隔线、右侧冠军及亚军站点 -->
              <vk-group v-if="control.showTop" :config="{ x: 280, y: 0 }">
                <!-- 3.2.1 中间分隔线 -->
                <vk-line :config="divider({ points: [0, 5, 0, topAndTotalInfoHeight - 15] })" />
                <!-- 3.2.2 右侧冠军及亚军站点 -->
                <template v-for="(type, index) in topSiteRenderAttr" :key="type.iconFill">
                  <vk-group :config="{ x: 20 + index * 170, y: 0 }">
                    <vk-text :config="icon({ y: 0, fill: type.iconFill, fontSize: 24, text: `󰔸` /* trophy */ })" />
                    <template v-for="(key, index) in realShowField" :key="key.name">
                      <vk-group
                        v-if="timelineData.topInfo[key.name][type.siteKey]"
                        :config="{ x: 0, y: 30 * (index + 1) }"
                      >
                        <vk-image
                          :ref="
                            (el: any) => {
                              faviconRefs.push(el);
                              el?.getNode().cache();
                            }
                          "
                          :config="favicon({ site: timelineData.topInfo[key.name][type.siteKey].site, size: 20 })"
                        />
                        <vk-text
                          v-if="timelineData.topInfo[key.name][type.valueKey] > 0"
                          :config="text({ x: 30, text: key.format(timelineData.topInfo[key.name][type.valueKey]) })"
                        />
                      </vk-group>
                    </template>
                  </vk-group>
                </template>
              </vk-group>
            </vk-group>

            <!-- 4. 绘制站点信息 -->
            <vk-group v-if="control.showTimeline" :config="{ x: 0, y: nameInfoHeight + topAndTotalInfoHeight }">
              <!-- 4.1 分割线 -->
              <vk-line :config="divider({ points: [20, 0, 630, 0] })" />
              <!-- 4.2 提示词 -->
              <vk-text
                :config="
                  text({
                    y: 15,
                    text: `... ${timelineData.timelineTitle} ...`,
                    align: 'center',
                    fontStyle: 'bold',
                    width: stageConfig.width,
                  })
                "
              />

              <!-- 4.3 站点信息 -->
              <vk-group :config="{ x: 0, y: 50 }">
                <!-- 4.3.1 分割线 -->
                <vk-line
                  :config="
                    divider({
                      x: stageConfig.width / 2,
                      y: 0,
                      points: [0, 10, 0, selectedSites.length * perSiteHeight + 10],
                    })
                  "
                />
                <!-- 4.3.2 不同站点的信息 -->
                <template v-for="(site, index) in siteInfo" :key="site.site">
                  <vk-group :config="{ x: 0, y: index * perSiteHeight + 100 }">
                    <!-- 首先画出 favicon 并 clip -->
                    <vk-group :config="{ clipFunc: siteFaviconClipFunc(24) }">
                      <vk-image
                        :ref="
                          (el: any) => {
                            faviconRefs.push(el);
                            el?.getNode().cache();
                          }
                        "
                        :config="favicon({ site: site.site, size: 38, x: stageConfig.width / 2 - 19, y: 0 - 19 })"
                      />
                    </vk-group>

                    <!-- 站点数据（上传下载等） -->
                    <vk-group :config="index % 2 == 0 ? { x: 30, y: -60 } : { x: stageConfig.width / 2 + 60, y: -60 }">
                      <vk-text
                        v-if="control.showPerSiteField.siteName"
                        :config="text({ y: -10, text: allSiteMetadata[site.site].siteName, fontStyle: 'bold' })"
                      />

                      <vk-text
                        v-for="(key, index) in realShowField"
                        :key="key.name"
                        :config="
                          text({
                            y: 20 * (index + 1) - (control.showPerSiteField.siteName ? 0 : 10),
                            text: `${t('UserDateTimeline.field.' + key.name)}: ${key.format(site[key.name] ?? 0)}`,
                            fontSize: 16,
                          })
                        "
                      />
                      <vk-line
                        v-if="index != siteInfo.length - 1"
                        :config="divider({ points: [0, 150, stageConfig.width / 2 - 80, 150] })"
                      />
                    </vk-group>

                    <!-- 站点数据（用户名、用户等级、用户UID等） -->
                    <vk-group :config="index % 2 == 0 ? { x: stageConfig.width / 2 + 60, y: -20 } : { x: 30, y: -20 }">
                      <vk-text
                        :config="text({ y: 0, text: `${formatSiteDate(site.joinTime!).value}`, fontStyle: 'bold' })"
                      />
                      <vk-text
                        :config="
                          text({
                            y: 28,
                            text: [
                              control.showPerSiteField.name ? site.name! : '',
                              control.showPerSiteField.level ? `<${site.levelName!}>` : '',
                              control.showPerSiteField.uid ? `<${site.id!}>` : '',
                            ]
                              .filter(Boolean)
                              .join(' '),
                            fontSize: 16,
                          })
                        "
                      ></vk-text>
                    </vk-group>
                  </vk-group>
                </template>
              </vk-group>
            </vk-group>

            <!-- 5. 构建信息 -->
            <vk-group :config="{ x: 0, y: nameInfoHeight + topAndTotalInfoHeight + siteTimeHeight }">
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
                      ') at ' +
                      formatDate(timelineData.createAt),
                    fontSize: 12,
                    fill: '#b5b5b5',
                  })
                "
              />
            </vk-group>
          </vk-layer>
        </vk-stage>
      </v-col>
      <v-col cols="12" sm>
        <v-alert title="编辑生成时间轴样式" type="info" class="mb-2">
          <template #append>
            <NavButton
              class="mr-1"
              color="grey"
              icon="mdi-file-export-outline"
              size="small"
              text="导出图片"
              @click="exportTimelineImg"
            />
            <NavButton icon="mdi-content-save" size="small" text="保存设置" color="grey" @click="saveControl" />
          </template>
        </v-alert>

        <v-label class="my-2">用户名及标题</v-label>

        <v-row>
          <v-col cols="12" sm>
            <v-text-field
              v-model="timelineData.nameInfo.name"
              :readonly="!allowEdit.name"
              append-inner-icon="mdi-history"
              hide-details
              label="用户名"
              @update:model-value="(v: string) => (control.name = v)"
              @click:append-inner="
                () => {
                  control.name = '';
                  resetTimelineData();
                }
              "
            >
              <template #prepend>
                <v-icon
                  :color="allowEdit.name ? 'success' : ''"
                  :icon="!allowEdit.name ? 'mdi-lock' : 'mdi-lock-open'"
                  @click="allowEdit.name = !allowEdit.name"
                ></v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm>
            <v-text-field
              v-model="timelineData.timelineTitle"
              :disabled="!control.showTimeline"
              :readonly="!allowEdit.title"
              append-inner-icon="mdi-history"
              hide-details
              label="时间轴标题"
              @update:model-value="(v: string) => (control.timelineTitle = v)"
              @click:append-inner="
                () => {
                  control.timelineTitle = '';
                  resetTimelineData();
                }
              "
            >
              <template #prepend>
                <v-icon
                  :color="allowEdit.title ? 'success' : ''"
                  :icon="!allowEdit.title ? 'mdi-lock' : 'mdi-lock-open'"
                  @click="allowEdit.title = !allowEdit.title"
                ></v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-label class="my-2">组件</v-label>

        <v-switch v-model="control.showTop" color="success" hide-details label="展示各类数据的冠军及亚军站点" />
        <v-switch v-model="control.showTimeline" color="success" hide-details label="展示各个站点信息（总开关）" />

        <v-label class="my-2">站点展示组件</v-label>

        <v-row>
          <v-col cols="10">
            <v-slider
              v-model="control.faviconBlue"
              :min="0"
              :max="8"
              :step="1"
              label="站点Favicon模糊度"
              class="pr-5"
              @update:model-value="updateBlue"
              hide-details
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="ml-2" align-self="center">
            <v-label>展示内容</v-label>
          </v-col>
          <v-col cols="12" sm="10">
            <v-row class="pl-5">
              <v-col v-for="(v, key) in control.showField" class="pa-0" cols="6" sm="4">
                <v-switch
                  :key="key"
                  v-model="control.showField[key]"
                  :label="t('UserDateTimeline.field.' + key)"
                  color="success"
                  hide-details
                  density="compact"
                />
              </v-col>
            </v-row>
            <v-row class="pl-5">
              <v-col v-for="(v, key) in control.showPerSiteField" class="pa-0" cols="6" sm="4">
                <v-switch
                  :key="key"
                  v-model="control.showPerSiteField[key]"
                  :label="t('UserDateTimeline.field.' + key)"
                  color="success"
                  density="compact"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="ml-2" align-self="center">
            <v-label>时间显示方式</v-label>
          </v-col>
          <v-col cols="12" sm="10">
            <v-radio-group inline hide-details v-model="control.dateFormat">
              <v-radio label="发生时间" value="time_added"></v-radio>
              <v-radio label="过去时间" value="time_alive"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>

        <v-alert type="info" title="展示站点" class="mt-4 mb-2">
          <template #append>
            <NavButton
              icon="mdi-checkbox-marked"
              size="small"
              text="全选"
              color="grey"
              @click="
                () => {
                  selectedSites = realAllSite;
                  resetTimelineData();
                }
              "
            />
            <NavButton
              icon="mdi-checkbox-blank-off-outline"
              text="全不选"
              size="small"
              color="grey"
              class="mx-1"
              @click="
                () => {
                  selectedSites = [];
                  resetTimelineData();
                }
              "
            />
            <NavButton
              icon="mdi-checkbox-intermediate-variant"
              text="反选"
              size="small"
              color="grey"
              @click="
                () => {
                  selectedSites = realAllSite.filter((site) => !selectedSites.includes(site));
                  resetTimelineData();
                }
              "
            />
          </template>
        </v-alert>

        <v-row class="my-2">
          <v-col v-for="(site, siteId) in metadataStore.lastUserInfo" :key="siteId" cols="6" sm="3" class="py-0">
            <v-checkbox
              v-model="selectedSites"
              multiple
              :value="siteId"
              hide-details
              density="compact"
              :indeterminate="!canThisSiteShow(siteId).value"
              indeterminate-icon="mdi-close"
              :disabled="!canThisSiteShow(siteId).value"
              @update:model-value="() => resetTimelineData()"
            >
              <template #label>
                <SiteFavicon :site-id="siteId" :size="16" />
                <SiteName :site-id="siteId" tag="p" :class="['ml-1']" />
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss"></style>
