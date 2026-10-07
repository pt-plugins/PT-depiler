<!--suppress HtmlUnknownTag -->
<script setup lang="ts">
import { saveAs } from "file-saver";
import { computed, nextTick, onMounted, reactive, ref, shallowRef, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useElementSize } from "@vueuse/core";

// konva 按需加载（见 vue-konva README「Minimal Bundle (Tree-Shaking)」）：
// konva/lib/Core 只含 Stage / Layer / Group 等核心节点，模板里用到的形状必须逐个引入，
// 否则 vue-konva 会在创建节点时抛 `xxx is not available. Did you forget to import it?`。
import Konva from "konva/lib/Core";
import "konva/lib/shapes/Rect";
import "konva/lib/shapes/Text";
import "konva/lib/shapes/Line";
import "konva/lib/shapes/Image";
// 仅取类型（运行时由上面那行副作用 import 完成注册）；Konva.Image 不在 Core 的类型面里
import type { Image as KonvaImage } from "konva/lib/shapes/Image";
import {
  Group as VkGroup,
  Image as VkImage,
  Layer as VkLayer,
  Line as VkLine,
  Rect as VkRect,
  Stage as VkStage,
  Text as VkText,
  type VueKonvaRef,
} from "vue-konva/core";

import { formatDate, formatTimeAgo } from "@/options/utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import {
  defaultTimelineBackgroundColor,
  defaultTimelineTextColor,
  defaultTimelineUserNameColor,
  useConfigStore,
} from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import SiteName from "@/options/components/SiteName.vue";
import NavButton from "@/options/components/NavButton.vue";
import CheckSwitchButton from "@/options/components/CheckSwitchButton.vue";

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
  fixedLastUserInfo,
  loadFullData,
} from "./utils.ts";
import { allAddedSiteMetadata, loadAllAddedSiteMetadata } from "../utils/siteMetadata.ts";

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

// vue-konva 组件的模板 ref 类型：VueKonvaRef<T> 提供 getNode()/getStage()。
// 注意 getNode() 的泛型要按实际节点类型给（favicon 是 Image，因为要用到 image()）。
// Konva.Image 不在 konva/lib/Core 的类型面里，单独从 shapes/Image 取。
const { width: containerWidth } = useElementSize(useTemplateRef("canvasContainer"));
const canvasStage = useTemplateRef<VueKonvaRef<Konva.Stage>>("canvasStage");
const canvasLayer = useTemplateRef<VueKonvaRef<Konva.Layer>>("canvasLayer");

const realAllSite = shallowRef<string[]>([]);

const siteInfo = computed(() => timelineData.value.siteInfo.filter((x) => selectedSites.value.includes(x.site)));

// 动态计算 canvas 的的各类属性
const canvasWidth = 650; // 650px 是设计稿的宽度，下面各类宽高均根据设计稿进行调整，然后使用 scale 来控制缩放
const nameInfoHeight = 70;
const topAndTotalInfoHeight = computed<number>(() => 10 + (realShowField.value.length + 2) * 30);
const perSiteHeight = computed<number>(
  () => (control.showPerSiteField.siteName ? 24 : 20) + (realShowField.value.length + 1) * 20 + 20,
); // 给每个站点 160px 的高度
const siteTimeHeight = computed<number>(() =>
  // 用 siteInfo.length（实际画出来的行数），不能用 selectedSites.length：
  // 勾选但取不到有效用户信息的站点不会绘制（见 utils.ts 里 canThisSiteShow 的分支），
  // 而 selectedSites 可能残留这类站点（例如从 URL 的 sites 参数进入、或历史保存的配置），
  // 用 selectedSites.length 会为它们各多留一整行高度 —— 表现就是图片底部多出一块空白。
  control.showTimeline ? 95 + perSiteHeight.value * siteInfo.value.length : 0,
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
//
// 这里的两层缓存都是为了「同一个 favicon 不重复做同样的活」：
// 1. 合成画布：favicon() 是在模板里按节点调用的，每次渲染都会跑一遍；不缓存的话每个图标
//    每次渲染都要新建一个 OffscreenCanvas 并重绘。而且 konva 的 Image 会监听 imageChange
//    去摘挂图片的 load 监听器，image 身份频繁变化本身也有开销。
// 2. 滤镜数组：konva 的 Node._setAttr 对数组不做内容比较（只有 `oldVal === val &&
//    !Util.isObject(val)` 才短路），每次传新数组都会把 _filterUpToDate 置 false，
//    使每次重绘都重跑一遍 blur 滤镜。
const faviconCanvasCache = new Map<string, OffscreenCanvas>();
const faviconFilterCache = new Map<string, string[]>();

const favicon = (config: TKonvaConfig) => {
  const imageBaseSize = config.size ?? 24;
  const siteConfig = allAddedSiteMetadata[config.site];

  const filterKey = `${control.faviconBlue}|${siteConfig.isDead ? 1 : 0}`;
  let imageFilters = faviconFilterCache.get(filterKey);
  if (!imageFilters) {
    imageFilters = [`blur(${control.faviconBlue}px)`];
    if (siteConfig.isDead) {
      imageFilters.push("grayscale(1)");
    }
    faviconFilterCache.set(filterKey, imageFilters);
  }

  let imageElement: HTMLImageElement | OffscreenCanvas = siteConfig.faviconElement;

  // 如果设置中传入了 canvas 这个自定义参数，我们为这个 favicon 生成一个带有背景的 canvas，然后在 canvas 上居中绘制 favicon
  if (config.canvas) {
    const { width: canvasWidth = imageBaseSize, height: canvasHeight = imageBaseSize } = config.canvas;
    const fillStyle = config.canvas.fillStyle ?? "#fff";
    const canvasKey = `${config.site}|${imageBaseSize}|${canvasWidth}x${canvasHeight}|${fillStyle}`;

    let canvas = faviconCanvasCache.get(canvasKey);
    if (!canvas) {
      canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

      // 填充背景
      ctx.fillStyle = fillStyle;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 计算缩放比例和位置，并将 favicon 居中填充
      const x = (canvasWidth - imageBaseSize) / 2;
      const y = (canvasHeight - imageBaseSize) / 2;
      ctx.drawImage(siteConfig.faviconElement, x, y, imageBaseSize, imageBaseSize);

      faviconCanvasCache.set(canvasKey, canvas);
    }

    // 防止辅助函数 image() 又一次设置 scaleX 和 scaleY
    config.scaleX = 1;
    config.scaleY = 1;

    // 将imageElement重写为我们的canvas
    imageElement = canvas;
  }

  return image({
    image: imageElement,
    filters: imageFilters,
    ...config,
  });
};

// clipFunc 只需要把路径描出来，konva 随后自己调 ctx.clip()（见 konva 的
// Container._drawChildren：save → transform → beginPath → clipFunc → clip）。
// 也就是说 clipFunc 里的 fill()/stroke() 会**真的画到画布上**，而且是 scene 与 hit
// 两张画布各画一次。这里原来画的白盘会被上面 48x48 白底 favicon 完全盖住，属于纯浪费。
const siteFaviconClipFunc =
  (radius: number = 24, position: [number, number] = [stageConfig.value.width / 2, 0]) =>
  (ctx: any) => {
    ctx.beginPath();
    ctx.arc(position[0], position[1], radius, 0, 2 * Math.PI);
  };

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

// favicon 节点索引。
//
// 不能用数组 push：Vue 的函数 ref 在**每次组件更新**时都会被调用（卸载时传 null），
// 原来的 `faviconRefs.push(el)` 会让数组无限增长，updateBlue() 里就会把同一个节点
// 反复 cache 很多次。这里按 key 覆盖写，天然幂等。
const faviconNodes = new Map<string, VueKonvaRef<KonvaImage>>();
const faviconRefCache = new Map<string, (el: unknown) => void>();

// 记录每个 favicon 节点「已按哪张底图缓存过」。
// 用 WeakMap 而不是往 konva 节点上挂自定义属性：不污染节点对象，也不需要 any 断言。
const faviconCachedImage = new WeakMap<KonvaImage, unknown>();

function syncFaviconNode(key: string, el: unknown) {
  if (!el) {
    faviconNodes.delete(key);
    return;
  }

  const component = el as VueKonvaRef<KonvaImage>;
  faviconNodes.set(key, component);

  // 只在「节点还没缓存」或「底图换了」时重新 cache —— 模糊值变化不需要重新 cache：
  // konva 的滤镜是在绘制时作用在 cache 画布上的（Node._getCachedSceneCanvas），
  // 改 filters 只会把 _filterUpToDate 置 false，下一次绘制自动重算。
  const node = component.getNode();
  if (node && (!node.isCached() || faviconCachedImage.get(node) !== node.image())) {
    node.cache();
    faviconCachedImage.set(node, node.image());
  }
}

// 同一个 key 返回同一个函数，避免每次渲染都生成新 ref 导致 Vue 反复卸载/重挂
const faviconRef = (key: string) => {
  let refFn = faviconRefCache.get(key);
  if (!refFn) {
    refFn = (el: unknown) => syncFaviconNode(key, el);
    faviconRefCache.set(key, refFn);
  }
  return refFn;
};

function syncAllFaviconCaches() {
  const prevAutoDrawEnabled = Konva.autoDrawEnabled;
  Konva.autoDrawEnabled = false;
  try {
    for (const component of faviconNodes.values()) {
      const node = component.getNode();
      if (node && !node.isCached()) {
        node.cache();
        faviconCachedImage.set(node, node.image());
      }
    }
  } finally {
    // 原来没有 try/finally：cache() 一旦抛错，autoDrawEnabled 会永久停在 false，
    // 整个应用的 konva 自动重绘都会停摆。
    Konva.autoDrawEnabled = prevAutoDrawEnabled;
  }

  canvasLayer.value?.getNode()?.batchDraw();
}

async function updateBlue() {
  // 等这一轮渲染把新的 filters 应用到节点上再重绘，否则会按旧滤镜画一次
  await nextTick();
  syncAllFaviconCaches();
}

onMounted(async () => {
  isLoading.value = true;

  // 加载所有站点的元数据
  await loadAllAddedSiteMetadata(Object.keys(metadataStore.sites));

  // 加载 fixedLastUserInfo
  fixedLastUserInfo.value = await loadFullData();

  realAllSite.value = Object.keys(fixedLastUserInfo.value).filter((x) => canThisSiteShow(x));

  const { sites = [] } = route.query ?? {};

  // 勾选站点，优先使用 route 参数，其次是上次保存的配置，最后是全部站点
  if ((sites as string[]).length > 0) {
    selectedSites.value = sites as string[];
  } else if ((configStore.userDataTimelineControl.selectedSites ?? []).length > 0) {
    selectedSites.value = configStore.userDataTimelineControl.selectedSites;
  } else {
    selectedSites.value = realAllSite.value;
  }

  // 开始生成 timeline 的数据
  resetTimelineDataWithControl();

  isLoading.value = false;
  console.debug(fixedLastUserInfo);
});

function exportTimelineImg() {
  const stage = canvasStage.value!.getStage();
  stage.toDataURL({
    mimeType: "image/png",
    pixelRatio: 3,
    callback: (dataUrl: string) => {
      saveAs(
        dataUrl,
        t("UserDataTimeline.exportFilename", {
          name: configStore.userName,
          date: formatDate(timelineData.value.createAt),
        }) + ".png",
      );
    },
  });
}

function saveControl() {
  configStore.userDataTimelineControl.selectedSites = selectedSites.value;
  configStore.$save();
  useRuntimeStore().showSnakebar(t("common.saveSuccess"), { color: "success" });
}
</script>

<template>
  <v-card>
    <v-row class="justify-start pa-2">
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
        <VkStage ref="canvasStage" :config="stageConfig">
          <!-- listening: false —— 这张图是静态的、不响应任何事件，关掉后 konva 不再绘制
               hit canvas（Node.shouldDrawHit 只看 isListening()），并顺带释放它的内存。 -->
          <VkLayer ref="canvasLayer" :config="{ listening: false }">
            <!-- 1. 添加背景颜色，并填满整个画布 -->
            <VkRect
              :config="{
                fill: control.backgroundColor,
                x: 0,
                y: 0,
                width: stageConfig.width,
                height: stageConfig.height,
              }"
            />

            <!-- 2. 绘制顶端概况 -->
            <VkGroup :config="{ x: 0, y: 0 }">
              <!-- 2.1 用户图标（跟着「用户名颜色」走，而不是「其他文本颜色」） -->
              <VkText :config="icon({ x: 20, y: 20, text: '󰀉' /* account-circle */, fill: control.userNameColor })" />
              <!-- 2.2 用户名 -->
              <VkText
                :config="text({ x: 65, y: 26, text: configStore.userName, fontSize: 26, fill: control.userNameColor })"
              />
              <!-- 2.3 创建时间 -->
              <VkText
                :config="
                  text({
                    y: 20,
                    text: formatDate(timelineData.createAt),
                    fontSize: 12,
                    fill: '#9E9E9E',
                    width: stageConfig.width - 20,
                    align: 'right',
                  })
                "
              />
            </VkGroup>

            <!-- 3. 绘制基础信息 -->
            <VkGroup :config="{ x: 20, y: nameInfoHeight }">
              <!-- 3.1 左侧 totalInfo -->
              <VkGroup :config="{ x: 0, y: 0 }">
                <VkText
                  :config="
                    text({
                      y: 0,
                      text: `${t('UserDataTimeline.total')}${t('UserDataTimeline.field.site')}: ${timelineData.totalInfo.sites}`,
                    })
                  "
                />
                <VkText
                  v-if="timelineData.totalInfo.deadSites > 0"
                  :config="
                    text({
                      x: 160,
                      y: 0,
                      text: `󰖛: ${timelineData.totalInfo.deadSites}`,
                      fontFamily: 'Material Design Icons For PTD',
                      fill: '#9E9E9E',
                    })
                  "
                />
              </VkGroup>
              <VkText
                v-for="(key, index) in realShowField"
                :key="key.name"
                :config="
                  text({
                    y: 30 * (index + 1),
                    text: `${t('UserDataTimeline.total')}${t('UserDataTimeline.field.' + key.name)}: ${key.format(timelineData.totalInfo[key.name])}`,
                  })
                "
              />
              <VkText
                :config="
                  text({
                    y: 30 * (realShowField.length + 1),
                    text: t('UserDataTimeline.ptAge', { years: timelineData.joinTimeInfo.years }),
                  })
                "
              />

              <!-- 3.2 中间分隔线、右侧冠军及亚军站点 -->
              <VkGroup v-if="control.showTop" :config="{ x: 280, y: 0 }">
                <!-- 3.2.1 中间分隔线 -->
                <VkLine :config="divider({ points: [0, 5, 0, topAndTotalInfoHeight - 15] })" />
                <!-- 3.2.2 右侧冠军及亚军站点 -->
                <template v-for="(type, index) in topSiteRenderAttr" :key="type.iconFill">
                  <VkGroup :config="{ x: 20 + index * 170, y: 0 }">
                    <VkText :config="icon({ y: 0, fill: type.iconFill, fontSize: 24, text: `󰔸` /* trophy */ })" />
                    <template v-for="(key, index) in realShowField" :key="key.name">
                      <VkGroup
                        v-if="timelineData.topInfo[key.name][type.valueKey] > 0"
                        :config="{ x: 0, y: 30 * (index + 1) }"
                      >
                        <VkImage
                          :ref="faviconRef(type.valueKey + '-' + key.name)"
                          :config="
                            favicon({
                              site: timelineData.topInfo[key.name][type.siteKey].site,
                              size: 20,
                              canvas: { fillStyle: control.backgroundColor },
                            })
                          "
                        />
                        <VkText
                          v-if="timelineData.topInfo[key.name][type.valueKey] > 0"
                          :config="text({ x: 30, text: key.format(timelineData.topInfo[key.name][type.valueKey]) })"
                        />
                      </VkGroup>
                    </template>
                  </VkGroup>
                </template>
              </VkGroup>
            </VkGroup>

            <!-- 4. 绘制站点信息 -->
            <VkGroup v-if="control.showTimeline" :config="{ x: 0, y: nameInfoHeight + topAndTotalInfoHeight }">
              <!-- 4.1 分割线 -->
              <VkLine :config="divider({ points: [20, 0, 630, 0] })" />
              <!-- 4.2 提示词 -->
              <VkText
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
              <VkGroup :config="{ x: 0, y: 40 }">
                <!-- 4.3.1 分割线 -->
                <VkLine
                  :config="
                    divider({
                      x: stageConfig.width / 2,
                      y: 0,
                      points: [0, 10, 0, siteInfo.length * perSiteHeight + 10],
                    })
                  "
                />
                <!-- 4.3.2 不同站点的信息 -->
                <template v-for="(userInfo, index) in siteInfo" :key="userInfo.site">
                  <VkGroup :config="{ x: 0, y: index * perSiteHeight }">
                    <!-- 首先画出 favicon 并 clip -->
                    <VkGroup :config="{ y: perSiteHeight / 2, clipFunc: siteFaviconClipFunc(24) }">
                      <VkImage
                        :ref="faviconRef(userInfo.site)"
                        :config="
                          favicon({
                            site: userInfo.site,
                            size: 38,
                            x: stageConfig.width / 2 - 24,
                            y: 0 - 24,
                            canvas: { width: 48, height: 48 },
                          })
                        "
                      />
                    </VkGroup>

                    <!-- 站点数据（上传下载等） -->
                    <VkGroup
                      :config="{
                        x: index % 2 == 0 ? 30 : stageConfig.width / 2 + 60,
                        y: perSiteHeight / 2 - 10 - realShowField.length * 10,
                      }"
                    >
                      <VkText
                        v-if="control.showPerSiteField.siteName"
                        :config="
                          text({
                            y: 0,
                            text: `${allAddedSiteMetadata[userInfo.site]?.isDead ? '󰖛' : ''}${allAddedSiteMetadata[userInfo.site].siteName}`,
                            fill: allAddedSiteMetadata[userInfo.site]?.isDead ? '#9E9E9E' : control.textColor,
                            fontFamily: allAddedSiteMetadata[userInfo.site]?.isDead
                              ? 'Material Design Icons For PTD'
                              : undefined,
                            fontStyle: 'bold',
                          })
                        "
                      />
                      <VkGroup
                        :config="{
                          x: 0,
                          y: control.showPerSiteField.siteName ? 10 : 0,
                        }"
                      >
                        <VkText
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
                        <VkLine
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
                      </VkGroup>
                    </VkGroup>

                    <!-- 站点数据（用户名、用户等级、用户UID等） -->
                    <VkGroup
                      :config="{ x: index % 2 == 0 ? stageConfig.width / 2 + 60 : 30, y: perSiteHeight / 2 - 20 }"
                    >
                      <VkText
                        :config="text({ y: 0, text: `${formatSiteDate(userInfo.joinTime!).value}`, fontStyle: 'bold' })"
                      />
                      <VkText
                        :config="
                          text({
                            y: 28,
                            width: stageConfig.width / 2 - 80,
                            wrap: 'char',
                            lineHeight: 1.25,
                            text: [
                              control.showPerSiteField.name ? userInfo.name! : '',
                              control.showPerSiteField.level ? `<${userInfo.levelName!}>` : '',
                              control.showPerSiteField.uid && userInfo.id && userInfo.id !== '0' && userInfo.id !== 0
                                ? `<${userInfo.id}>`
                                : '',
                            ]
                              .filter(Boolean)
                              .join(' '),
                            fontSize: 16,
                          })
                        "
                      ></VkText>
                    </VkGroup>
                  </VkGroup>
                </template>
              </VkGroup>
            </VkGroup>

            <!-- 5. 构建信息 -->
            <VkGroup :config="{ x: 0, y: nameInfoHeight + topAndTotalInfoHeight + siteTimeHeight }">
              <VkLine :config="divider({ points: [20, -10, 630, -10] })" />
              <VkText
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
            </VkGroup>
          </VkLayer>
        </VkStage>
      </v-col>
      <v-col cols="12" sm>
        <v-row class="flex-nowrap mb-1">
          <v-col class="d-flex">
            <NavButton color="grey" icon="mdi-arrow-left" :text="t('common.back')" @click="() => router.back()" />
            <v-spacer />
            <NavButton
              color="info"
              icon="mdi-file-export-outline"
              :text="t('common.exportImage')"
              @click="exportTimelineImg"
            />
            <NavButton color="green" icon="mdi-content-save" :text="t('common.saveSettings')" @click="saveControl" />
          </v-col>
        </v-row>

        <v-alert :title="t('UserDataTimeline.controls.styleSettings')" type="info" class="mb-2"> </v-alert>

        <v-label class="my-2">{{ t("UserDataTimeline.controls.usernameAndTitle") }}</v-label>

        <v-row>
          <v-col cols="12" sm>
            <v-combobox
              v-model="configStore.userName"
              :readonly="!allowEdit.name"
              append-inner-icon="mdi-history"
              :items="Object.keys(configStore.getUserNames.names)"
              hide-details
              :label="t('common.username')"
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
              :label="t('UserDataTimeline.controls.timelineTitle')"
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

        <v-label class="my-2">{{ t("UserDataTimeline.controls.components") }}</v-label>

        <v-switch
          v-model="control.showTop"
          color="success"
          hide-details
          :label="t('UserDataTimeline.controls.showTopSites')"
        />
        <v-switch
          v-model="control.showTimeline"
          color="success"
          hide-details
          :label="t('UserDataTimeline.controls.showTimeline')"
        />

        <v-row>
          <v-col cols="12" sm="4">
            <v-color-input
              v-model="control.backgroundColor"
              mode="hex"
              color-pip
              hide-actions
              hide-details
              :label="t('UserDataTimeline.controls.customBgColor')"
            >
              <template #append-inner>
                <v-icon
                  icon="mdi-backup-restore"
                  @click="control.backgroundColor = defaultTimelineBackgroundColor"
                ></v-icon>
              </template>
            </v-color-input>
          </v-col>
          <v-col cols="12" sm="4">
            <!-- sm 及以上三个输入框并排（<v-col sm="4">），VColorInput 默认在 prepend 渲染一个色块，
                 会额外占掉左侧宽度、把三个框的间距撑开，所以这个断点下用 hide-pip 关掉；
                 sm 以下三者各占整行、宽度充裕，改用 color-pip 让色块显示当前颜色。 -->
            <v-color-input
              v-model="control.userNameColor"
              mode="hex"
              :color-pip="!$vuetify.display.smAndUp"
              :hide-pip="$vuetify.display.smAndUp"
              hide-actions
              hide-details
              :label="t('UserDataTimeline.controls.userNameColor')"
            >
              <template #append-inner>
                <v-icon
                  icon="mdi-backup-restore"
                  @click="control.userNameColor = defaultTimelineUserNameColor"
                ></v-icon>
              </template>
            </v-color-input>
          </v-col>
          <v-col cols="12" sm="4">
            <v-color-input
              v-model="control.textColor"
              mode="hex"
              :color-pip="!$vuetify.display.smAndUp"
              :hide-pip="$vuetify.display.smAndUp"
              hide-actions
              hide-details
              :label="t('UserDataTimeline.controls.textColor')"
            >
              <template #append-inner>
                <v-icon icon="mdi-backup-restore" @click="control.textColor = defaultTimelineTextColor"></v-icon>
              </template>
            </v-color-input>
          </v-col>
        </v-row>

        <v-label class="my-2">{{ t("UserDataTimeline.controls.siteDisplay") }}</v-label>

        <v-row>
          <v-col cols="10">
            <v-slider
              v-model="control.faviconBlue"
              :max="8"
              :min="0"
              :step="1"
              :thumb-color="control.faviconBlue > 4 ? 'red' : ''"
              class="pr-5"
              hide-details
              :label="t('UserDataTimeline.controls.faviconBlur')"
              thumb-label
              @update:model-value="updateBlue"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col class="align-self-center ml-2">
            <v-label>{{ t("UserDataTimeline.controls.displayContent") }}</v-label>
          </v-col>
          <v-col cols="12" sm="10">
            <v-label class="my-2">{{ t("UserDataTimeline.controls.statsSection") }}</v-label>
            <v-row gap="0" class="pl-5">
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
            <v-label class="my-2">{{ t("UserDataTimeline.controls.timelineSection") }}</v-label>
            <v-row gap="0" class="pl-5">
              <v-col v-for="(v, key) in control.showPerSiteField" :key="key" class="pa-0" cols="6" sm="4">
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
          <v-col class="align-self-center ml-2">
            <v-label>{{ t("UserDataTimeline.controls.timeDisplay") }}</v-label>
          </v-col>
          <v-col cols="12" sm="10">
            <v-radio-group inline hide-details v-model="control.dateFormat">
              <v-radio :label="t('UserDataTimeline.controls.timeAdded')" value="time_added"></v-radio>
              <v-radio :label="t('UserDataTimeline.controls.timeAlive')" value="time_alive"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>

        <v-alert class="mt-4 mb-2" :title="t('UserDataTimeline.controls.displaySiteSettings')" type="info">
          <template #append>
            <CheckSwitchButton
              v-model="selectedSites"
              :all="realAllSite"
              color="grey"
              @update:model-value="resetTimelineDataWithControl"
            />
          </template>
        </v-alert>

        <v-row gap="0" class="my-2">
          <v-col v-for="(site, siteId) in fixedLastUserInfo" :key="siteId" class="py-0" cols="6" sm="3">
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
                <span class="ml-1">
                  <SiteName :site-id="siteId" class="" tag="span" />
                  <v-icon
                    v-if="allAddedSiteMetadata[siteId]?.isDead"
                    class="ml-1"
                    color="blue-grey-darken-1"
                    icon="mdi-weather-sunset-down"
                    size="small"
                  ></v-icon>
                  <v-icon
                    v-if="allAddedSiteMetadata[siteId]?.isOffline && !allAddedSiteMetadata[siteId]?.isDead"
                    class="ml-1"
                    color="blue-grey-darken-1"
                    icon="mdi-signal-off"
                    size="small"
                  ></v-icon>
                </span>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped lang="scss"></style>
