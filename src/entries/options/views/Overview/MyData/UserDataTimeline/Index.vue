<!--suppress HtmlUnknownTag -->
<script setup lang="ts">
import { saveAs } from "file-saver";
import { computed, onMounted, reactive, ref, shallowRef, useTemplateRef } from "vue";
import Konva from "konva";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useElementSize } from "@vueuse/core";

import { formatDate, formatTimeAgo } from "@/options/utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { allAddedSiteMetadata, loadAllAddedSiteMetadata } from "@/options/views/Overview/MyData/utils.ts";

import {
  canThisSiteShow,
  timelineDataRef,
  selectedSites,
  topSiteRenderAttr,
  CTimelineUserInfoField,
  image,
  text,
  divider,
  icon,
  type ITimelineUserInfoField,
  type TKonvaConfig,
} from "./utils.ts";

import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";
import NavButton from "@/options/components/NavButton.vue";
import CheckSwitchButton from "@/options/components/CheckSwitchButton.vue";

const ext_version = __EXT_VERSION__;

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();
const control = configStore.userDataTimelineControl;

const isLoading = ref<boolean>(false);
const { ref: timelineData, reset: resetTimelineData } = timelineDataRef;
const allowEdit = reactive({ name: false, title: false }); // 是否允许编辑用户名、时间轴标题

function resetTimelineDataWithControl() {
  // 开始生成 timeline 的数据
  resetTimelineData();

  // 将 control 中的 name 和 timelineTitle 覆盖掉自动生成的
  if (configStore.userName == "") {
    configStore.userName = configStore.getUserNames.perfName;
  }

  if (control.title !== "") {
    timelineData.value.title = control.title;
  }
}

type KonvaNode = { getNode: () => any; getStage: () => any };

const { width: containerWidth } = useElementSize(useTemplateRef("canvasContainer"));
const canvasStage = useTemplateRef<KonvaNode>("canvasStage");
const canvasLayer = useTemplateRef<KonvaNode>("canvasLayer");

const realAllSite = shallowRef<string[]>([]);

// 动态计算 canvas 的的各类属性
const canvasWidth = 650; // 650px 是设计稿的宽度，下面各类宽高均根据设计稿进行调整，然后使用 scale 来控制缩放
const nameInfoHeight = 70;
const topAndTotalInfoHeight = computed<number>(() => 10 + (realShowField.value.length + 2) * 30);
const perSiteHeight = computed<number>(
  () => (control.showPerSiteField.siteName ? 24 : 20) + (realShowField.value.length + 1) * 20 + 20,
); // 给每个站点 160px 的高度
const siteTimeHeight = computed<number>(() =>
  control.showTimeline ? 95 + perSiteHeight.value * selectedSites.value.length : 0,
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

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); // FIXME 该判断移动到 utils.ts 中

(Konva.Filters as any).tryNativeBlur = isSafari
  ? Konva.Filters.Blur
  : function (imageData: ImageData) {
      // 创建一个和 imageData 一样大小的 OffscreenCanvas
      const context = new OffscreenCanvas(imageData.width, imageData.height).getContext("2d");

      // @ts-expect-error
      const radius = Math.round((this as Konva.Node).blurRadius());
      context!.filter = `blur(${radius}px)`;
      // @ts-expect-error
      context!.drawImage((this as any).getImage(), 0, 0);
      const newImageData = context!.getImageData(0, 0, imageData.width, imageData.height);

      imageData.data.set(newImageData.data);
    };

// 绘制相关辅助函数
const favicon = (config: TKonvaConfig) =>
  image({
    image: allAddedSiteMetadata[config.site].faviconElement,
    filters: [(Konva.Filters as any).tryNativeBlur],
    blurRadius: control.faviconBlue,
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
      return formatTimeAgo(siteDate);
    }
  });

const faviconRefs = ref<KonvaNode[]>([]);

function updateBlue() {
  Konva.autoDrawEnabled = false;
  for (const faviconRef of faviconRefs.value) {
    faviconRef.getNode()?.cache();
  }
  canvasLayer.value?.getNode()?.batchDraw();
  Konva.autoDrawEnabled = true;
}

onMounted(async () => {
  isLoading.value = true;

  // 加载所有站点的元数据
  await loadAllAddedSiteMetadata();

  realAllSite.value = Object.values(metadataStore.lastUserInfo)
    .map((x) => x.site)
    .filter((x) => canThisSiteShow(x));

  // 从 route 中加载选择的站点，如果没有，则选择默认全部可以的站点（注意，这里我们不记住选择过的站点！！）
  const { sites = [] } = route.query ?? {};
  console.log(realAllSite.value);
  selectedSites.value = ((sites as string[]).length > 0 ? sites : realAllSite.value) as string[];

  // 开始生成 timeline 的数据
  resetTimelineDataWithControl();

  isLoading.value = false;
});

function exportTimelineImg() {
  const stage = canvasStage.value!.getStage();
  stage.toDataURL({
    mimeType: "image/png",
    pixelRatio: 3,
    callback: (dataUrl: string) => {
      saveAs(dataUrl, `${configStore.userName}的时间轴（${formatDate(timelineData.value.createAt)}）.png`);
    },
  });
}

function saveControl() {
  configStore.$save();
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
          <vk-layer ref="canvasLayer">
            <!-- 1. 添加背景颜色，颜色为 blue-grey-darken-2，填满整个画布 -->
            <vk-rect :config="{ fill: '#455A64', x: 0, y: 0, width: stageConfig.width, height: stageConfig.height }" />

            <!-- 2. 绘制顶端概况 -->
            <vk-group :config="{ x: 0, y: 0 }">
              <!-- 2.1 用户图标 -->
              <vk-text :config="icon({ x: 20, y: 20, text: '󰀉' /* account-circle */ })" />
              <!-- 2.2 用户名 -->
              <vk-text :config="text({ x: 65, y: 26, text: configStore.userName, fontSize: 26 })" />
            </vk-group>

            <!-- 3. 绘制基础信息 -->
            <vk-group :config="{ x: 20, y: nameInfoHeight }">
              <!-- 3.1 左侧 totalInfo -->
              <vk-text
                :config="
                  text({
                    y: 0,
                    text: `${t('UserDataTimeline.total')}${t('UserDataTimeline.field.site')}: ${timelineData.totalInfo.sites}`,
                  })
                "
              />
              <vk-text
                v-for="(key, index) in realShowField"
                :key="key.name"
                :config="
                  text({
                    y: 30 * (index + 1),
                    text: `${t('UserDataTimeline.total')}${t('UserDataTimeline.field.' + key.name)}: ${key.format(timelineData.totalInfo[key.name])}`,
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
                        v-if="timelineData.topInfo[key.name][type.valueKey] > 0"
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
                    text: `... ${timelineData.title} ...`,
                    align: 'center',
                    fontStyle: 'bold',
                    width: stageConfig.width,
                  })
                "
              />

              <!-- 4.3 站点信息 -->
              <vk-group :config="{ x: 0, y: 40 }">
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
                <template v-for="(userInfo, index) in siteInfo" :key="userInfo.site">
                  <vk-group :config="{ x: 0, y: index * perSiteHeight }">
                    <!-- 首先画出 favicon 并 clip -->
                    <vk-group :config="{ y: perSiteHeight / 2, clipFunc: siteFaviconClipFunc(24) }">
                      <vk-image
                        :ref="
                          (el: any) => {
                            faviconRefs.push(el);
                            el?.getNode().cache();
                          }
                        "
                        :config="favicon({ site: userInfo.site, size: 38, x: stageConfig.width / 2 - 19, y: 0 - 19 })"
                      />
                    </vk-group>

                    <!-- 站点数据（上传下载等） -->
                    <vk-group
                      :config="{
                        x: index % 2 == 0 ? 30 : stageConfig.width / 2 + 60,
                        y: perSiteHeight / 2 - 10 - realShowField.length * 10,
                      }"
                    >
                      <vk-text
                        v-if="control.showPerSiteField.siteName"
                        :config="
                          text({
                            y: 0,
                            text: allAddedSiteMetadata[userInfo.site].siteName,
                            fontStyle: 'bold',
                          })
                        "
                      />
                      <vk-group
                        :config="{
                          x: 0,
                          y: control.showPerSiteField.siteName ? 10 : 0,
                        }"
                      >
                        <vk-text
                          v-for="(key, index) in realShowField"
                          :key="key.name"
                          :config="
                            text({
                              y: 20 * (index + 1),
                              text: `${t('UserDataTimeline.field.' + key.name)}: ${key.format(userInfo[key.name] ?? 0)}`,
                              fontSize: 16,
                            })
                          "
                        />
                        <vk-line
                          v-if="
                            index != siteInfo.length - 1 &&
                            (control.showPerSiteField.siteName || realShowField.length > 0)
                          "
                          :config="
                            divider({
                              points: [
                                0,
                                (realShowField.length + 1.5) * 20,
                                stageConfig.width / 2 - 80,
                                (realShowField.length + 1.5) * 20,
                              ],
                            })
                          "
                        />
                      </vk-group>
                    </vk-group>

                    <!-- 站点数据（用户名、用户等级、用户UID等） -->
                    <vk-group
                      :config="{ x: index % 2 == 0 ? stageConfig.width / 2 + 60 : 30, y: perSiteHeight / 2 - 20 }"
                    >
                      <vk-text
                        :config="text({ y: 0, text: `${formatSiteDate(userInfo.joinTime!).value}`, fontStyle: 'bold' })"
                      />
                      <vk-text
                        :config="
                          text({
                            y: 28,
                            text: [
                              control.showPerSiteField.name ? userInfo.name! : '',
                              control.showPerSiteField.level ? `<${userInfo.levelName!}>` : '',
                              control.showPerSiteField.uid ? `<${userInfo.id!}>` : '',
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
                    text: 'Created By PT-Depiler (' + ext_version + ') at ' + formatDate(timelineData.createAt),
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
        <v-alert title="时间轴样式设置" type="info" class="mb-2">
          <template #append>
            <NavButton icon="mdi-arrow-left" size="small" color="grey" text="返回" @click="() => router.back()" />
            <NavButton
              color="grey"
              icon="mdi-file-export-outline"
              size="small"
              text="导出图片"
              @click="exportTimelineImg"
            />
          </template>
        </v-alert>

        <v-label class="my-2">用户名及标题</v-label>

        <v-row>
          <v-col cols="12" sm>
            <v-combobox
              v-model="configStore.userName"
              :readonly="!allowEdit.name"
              append-inner-icon="mdi-history"
              :items="Object.keys(configStore.getUserNames.names)"
              hide-details
              label="用户名"
              @click:append-inner="() => (configStore.userName = configStore.getUserNames.perfName)"
            >
              <template #prepend>
                <v-icon
                  :color="allowEdit.name ? 'success' : ''"
                  :icon="!allowEdit.name ? 'mdi-lock' : 'mdi-lock-open'"
                  @click="allowEdit.name = !allowEdit.name"
                ></v-icon>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="12" sm>
            <v-text-field
              v-model="timelineData.title"
              :disabled="!control.showTimeline"
              :readonly="!allowEdit.title"
              append-inner-icon="mdi-history"
              hide-details
              label="时间轴标题"
              @update:model-value="(v: string) => (control.title = v)"
              @click:append-inner="
                () => {
                  control.title = '';
                  resetTimelineDataWithControl();
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
              :max="16"
              :min="0"
              :step="1"
              :thumb-color="control.faviconBlue > 10 ? 'red' : control.faviconBlue > 8 ? 'amber' : ''"
              class="pr-5"
              hide-details
              label="站点Favicon模糊度"
              thumb-label
              @update:model-value="updateBlue"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="ml-2" align-self="center">
            <v-label>展示内容</v-label>
          </v-col>
          <v-col cols="12" sm="10">
            <v-label class="my-2">统计部分</v-label>
            <v-row class="pl-5">
              <v-col v-for="(v, key) in control.showField" class="pa-0" cols="6" sm="4" :key="key">
                <v-switch
                  v-model="control.showField[key]"
                  :label="t('UserDataTimeline.field.' + key)"
                  color="success"
                  hide-details
                  density="compact"
                />
              </v-col>
            </v-row>
            <v-label class="my-2">时间轴部分</v-label>
            <v-row class="pl-5">
              <v-col v-for="(v, key) in control.showPerSiteField" class="pa-0" cols="6" sm="4">
                <v-switch
                  :key="key"
                  v-model="control.showPerSiteField[key]"
                  :label="t('UserDataTimeline.field.' + key)"
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

        <v-divider class="my-2" />

        <v-row class="flex-nowrap">
          <v-col class="d-flex">
            <v-spacer />
            <NavButton icon="mdi-content-save" text="保存样式设置" color="green" @click="saveControl" />
          </v-col>
        </v-row>

        <v-alert type="info" title="展示站点设置" class="mt-4 mb-2">
          <template #append>
            <CheckSwitchButton
              v-model="selectedSites"
              :all="realAllSite"
              color="grey"
              @update:model-value="resetTimelineDataWithControl"
            />
          </template>
        </v-alert>

        <v-row class="my-2">
          <v-col v-for="(site, siteId) in metadataStore.lastUserInfo" :key="siteId" cols="6" sm="3" class="py-0">
            <v-checkbox
              v-model="selectedSites"
              :disabled="!canThisSiteShow(siteId)"
              :indeterminate="!canThisSiteShow(siteId)"
              :value="siteId"
              density="compact"
              hide-details
              indeterminate-icon="mdi-close"
              multiple
              @update:model-value="resetTimelineDataWithControl"
            >
              <template #label>
                <SiteFavicon :site-id="siteId" :size="16" />
                <SiteName :class="['ml-1']" :site-id="siteId" tag="p" />
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss"></style>
