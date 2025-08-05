<script setup lang="ts">
import { saveAs } from "file-saver";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useElementSize } from "@vueuse/core";
import { computed, onMounted, ref, shallowRef, provide, useTemplateRef } from "vue";
import { flatten, mapValues, pick, uniq } from "es-toolkit";
import VChart, { THEME_KEY } from "vue-echarts";
import { isNumber } from "es-toolkit/compat";
import { use as useEcharts, type ComposeOption } from "echarts/core";
import { BarChart, LineChart, type LineSeriesOption, type BarSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent,
  type TitleComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
  LegendComponent,
  type LegendComponentOption,
  GridComponent,
  type GridComponentOption,
} from "echarts/components";

import { formatSize, formatDate } from "@/options/utils.ts";
import { IStoredUserInfo } from "@/shared/types.ts";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { allAddedSiteMetadata, loadAllAddedSiteMetadata } from "@/options/views/Overview/MyData/utils.ts";

import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";
import NavButton from "@/options/components/NavButton.vue";
import CheckSwitchButton from "@/options/components/CheckSwitchButton.vue";

import { type IUserDataStatistic, loadFullData, setSubDate } from "./utils.ts";
import { NO_IMAGE } from "@ptd/site";

type EChartsLineChartOption = ComposeOption<
  TitleComponentOption | TooltipComponentOption | LegendComponentOption | GridComponentOption | LineSeriesOption
>;

type EChartsBarChartOption = ComposeOption<
  TitleComponentOption | TooltipComponentOption | LegendComponentOption | GridComponentOption | BarSeriesOption
>;

useEcharts([TitleComponent, TooltipComponent, LegendComponent, GridComponent, LineChart, BarChart, CanvasRenderer]);

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const configStore = useConfigStore();
const chartContainerRef = useTemplateRef<HTMLDivElement>("chartContainer");
const { width: containerWidth } = useElementSize(chartContainerRef);
const perChartHeight = computed(() => 400);

const allowEditName = ref<boolean>(false);

const rawDataRef = ref<IUserDataStatistic>({ siteDateRange: {}, dailyUserInfo: {}, incrementalData: {} });

const allDateRanges = computed(() => Object.keys(rawDataRef.value.dailyUserInfo));
const allSites = computed<string[]>(() => Object.keys(rawDataRef.value.siteDateRange));

const selectedDateRanges = shallowRef<string[]>([]);
const selectedDateRangeRawData = computed<IUserDataStatistic["dailyUserInfo"]>(() =>
  pick(rawDataRef.value.dailyUserInfo, selectedDateRanges.value),
);

const availableSites = computed(() =>
  uniq(flatten(Object.values(mapValues(selectedDateRangeRawData.value, (x) => Object.keys(x))))),
);

const selectedSites = ref<string[]>([]);
const selectedDataComputed = computed<IUserDataStatistic["dailyUserInfo"]>(() =>
  mapValues(selectedDateRangeRawData.value, (x) => pick(x, selectedSites.value)),
);

function getTotalDataByField(field: keyof IStoredUserInfo) {
  return selectedDateRanges.value.map((x) =>
    Object.values(selectedDataComputed.value[x] ?? {})
      .map((x: IStoredUserInfo) => x[field])
      .filter(isNumber)
      .reduce((a, b) => (a ?? 0) + (b ?? 0), 0),
  ) as number[];
}

const formatDict = {
  int: (value: number) => value.toFixed(0),
  number: (value: number) => value.toFixed(2),
  size: (value: number) => formatSize(value),
} as const;

function createTotalInfoTooltipFormatter(type: (keyof typeof formatDict)[]) {
  return function (params: any) {
    let result = "<div>" + params[0].name + "</div>";
    params.forEach(function (param: any) {
      const formatFunction = formatDict[type[param.seriesIndex] ?? "number"];

      result +=
        `<div style='color: ${param.color}'>` +
        param.marker +
        param.seriesName +
        ": " +
        formatFunction(param.value) +
        "</div>";
    });
    return result;
  };
}

const totalSiteBaseInfoChartOptions = computed(() => {
  const uploaded = getTotalDataByField("uploaded");
  const downloaded = getTotalDataByField("downloaded");
  const bonus = getTotalDataByField("bonus");

  return {
    title: {
      text: `[${configStore.userName}] ${t("UserDataStatistic.chart.totalSiteBase")}`,
      subtext: `上传: ${formatSize(uploaded.at(-1)!)}, 下载: ${formatSize(downloaded.at(-1)!)}, 积分: ${(bonus.at(-1) ?? 0).toFixed(2)}`,
      left: "center", // 设置标题居中
    },
    tooltip: {
      trigger: "axis",
      formatter: createTotalInfoTooltipFormatter(["size", "size", "number"]),
    },
    legend: { data: ["上传", "下载", "积分"], bottom: 10, orient: "horizontal" },
    grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
    xAxis: { type: "category", boundaryGap: false, data: selectedDateRanges.value }, // 时间轴
    yAxis: [
      { type: "value", name: "数据", position: "left", axisLabel: { formatter: formatSize } },
      { type: "value", name: "积分", position: "right", axisLabel: { formatter: (value) => value.toFixed(0) } },
    ],
    series: [
      { name: "上传", type: "line", smooth: true, data: uploaded, yAxisIndex: 0 },
      { name: "下载", type: "line", smooth: true, data: downloaded, yAxisIndex: 0 },
      { name: "积分", type: "line", smooth: true, data: bonus, yAxisIndex: 1 },
    ],
  } as EChartsLineChartOption;
});

const totalSiteSeedingInfoChartOptions = computed(() => {
  const seeding = getTotalDataByField("seeding");
  const seedingSize = getTotalDataByField("seedingSize");

  return {
    title: {
      text: `[${configStore.userName}] ${t("UserDataStatistic.chart.totalSiteSeeding")}`,
      subtext: `做种量: ${formatSize(seedingSize.at(-1)!)}, 数量: ${(seeding.at(-1) ?? 0).toFixed(2)}`,
      left: "center", // 设置标题居中
    },
    tooltip: {
      trigger: "axis",
      formatter: createTotalInfoTooltipFormatter(["size", "int"]),
    },
    legend: { data: ["做种量", "做种数"], bottom: 10, orient: "horizontal" },
    grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
    xAxis: { type: "category", boundaryGap: false, data: selectedDateRanges.value }, // 时间轴
    yAxis: [
      { type: "value", name: "做种量", position: "left", axisLabel: { formatter: formatSize } },
      { type: "value", name: "做种数", position: "right", axisLabel: { formatter: (value) => value.toFixed(0) } },
    ],
    series: [
      { name: "做种量", type: "line", smooth: true, data: seedingSize, yAxisIndex: 0 },
      { name: "做种数", type: "line", smooth: true, data: seeding, yAxisIndex: 1 },
    ],
  } as EChartsLineChartOption;
});

// Echart 不支持在 tooltip 中直接获取鼠标悬停的系列索引，所以我们需要通过 mousemove 事件手动记录
const lastHoveredSeriesIndex = ref<number>(-1);

function updateLastHoveredSeriesIndex(data: any) {
  lastHoveredSeriesIndex.value = data?.seriesIndex ?? -1; // 获取鼠标悬停的系列索引
}

const createPerSiteChartOptionsFn = (
  field: keyof IStoredUserInfo,
  format: keyof typeof formatDict,
  incr: boolean = false,
) =>
  computed(() => {
    const series = selectedSites.value.map((site) => {
      let data;
      if (incr) {
        // 使用预计算的增量数据，大幅提升性能
        data = selectedDateRanges.value.map((date) => {
          const incrementalValue = rawDataRef.value.incrementalData[site]?.[date]?.[field];
          return incrementalValue ?? 0;
        });
      } else {
        data = selectedDateRanges.value.map((date) => selectedDataComputed.value[date]?.[site]?.[field] ?? 0);
      }

      return {
        name: site,
        type: "bar",
        emphasis: {
          focus: "series",
        },
        stack: "site",
        data,
      };
    });

    const seriesTotal = series.map((x) => ({ name: x.name, value: x.data.reduce((a, b) => a + b, 0) }));

    return {
      title: {
        text: `[${configStore.userName}] ${t("UserDataStatistic.chart.perSiteK" + field + (incr ? "Incr" : ""))}`,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any[]) => {
          let ret = "";
          const date = params?.[0]?.name ?? "No Date"; // 从params 中拿到日期
          ret += `<span class="font-weight-bold">${date}</span><br>`;

          const hasData = params.some((x) => Number(x.data));
          const totalCount = params.reduce((acc, cur) => acc + (Number(cur.data) || 0), 0); // 算出总和
          let thresholdSite = 0; // 低于阈值的站点数量

          if (hasData) {
            ret += '<table style="width: 100%;">';
            ret += `<tr class="font-weight-bold" style="border-bottom: 1pt solid black;"><td class="pr-3">总和</td><td class="pr-3 text-right">${formatDict[format](totalCount)}</td><td class="text-right">100%</td></tr>`;

            const sortedParams = params.sort((a, b) => b.data - a.data);

            for (const data of sortedParams) {
              const dataValue = Number(data.data) || 0;

              if (dataValue === 0) continue; // 跳过无数据的站点
              const site = data.seriesName;
              const siteName = allAddedSiteMetadata[site]?.siteName ?? site;
              const siteFavicon = allAddedSiteMetadata[site]?.faviconSrc ?? NO_IMAGE;
              const precentValue = (dataValue / totalCount) * 100;
              const isHighlightSite = lastHoveredSeriesIndex.value === data.seriesIndex; // 是否高亮此行

              // 跳过低于阈值且没有高亮的站点
              if (
                !isHighlightSite &&
                Math.abs(precentValue) < (configStore.userStatisticControl.hidePerSitePrecentThreshold ?? 0)
              ) {
                thresholdSite++;
                continue;
              }

              ret += `<tr style='${isHighlightSite ? `color: ${data.color};` : ""}'>
<td class="pr-3"><div class="d-inline-flex align-center"><img src="${siteFavicon}" class="mr-1" style="width:16px; height: 16px; " alt="${siteName}">${siteName}</div></td>
<td class="pr-3 text-right">${formatDict[format](data.value)}</td>
<td class="text-right">${precentValue.toFixed(2)}%</td>
</tr>`;
            }

            if (thresholdSite > 0) {
              ret += `<tr><td colspan="3" class="text-right">（另有 ${thresholdSite} 个站点数据被隐藏 )</td></tr>`;
            }

            ret += "</table>";
          } else {
            ret += `无数据`;
          }

          return ret;
        },
      },
      legend: {
        data: seriesTotal.sort((a, b) => b.value - a.value).map((x) => x.name),
        bottom: 10,
        orient: "horizontal",
        type: "scroll",
        formatter: (site) => allAddedSiteMetadata[site].siteName ?? site,
      },
      grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
      xAxis: { type: "category", boundaryGap: true, data: selectedDateRanges.value }, // 所有柱状图都使用 boundaryGap: true
      yAxis: [{ type: "value", name: "数据", axisLabel: { formatter: formatDict[format] } }],
      series,
    } as EChartsBarChartOption;
  });

const perSiteChartField: [keyof IStoredUserInfo, keyof typeof formatDict][] = [
  ["uploaded", "size"],
  ["downloaded", "size"],
  ["seeding", "int"],
  ["seedingSize", "size"],
  ["bonus", "number"],
] as const;

// echarts 主题
const echartsTheme = computed(() => (configStore.uiTheme === "dark" ? "dark" : null));
provide(THEME_KEY, echartsTheme);

onMounted(async () => {
  rawDataRef.value = await loadFullData();

  // 加载所有站点的元数据
  await loadAllAddedSiteMetadata(Object.keys(rawDataRef.value.siteDateRange));

  // 从路由中加载默认参数
  const { days = -1, sites = [] } = route.query ?? {};

  const dateRange = (days as number) > 0 ? days : configStore.userStatisticControl.dateRange;

  // noinspection SuspiciousTypeOfGuard
  if (typeof dateRange === "number") {
    selectedDateRanges.value = setSubDate(dateRange);
  } else {
    // 我们不保存上一次自定义时间段的范围，所以如果上一次是自定义时间段，则默认显示所有数据
    if (dateRange === "custom") {
      configStore.userStatisticControl.dateRange = "all";
    }

    selectedDateRanges.value = allDateRanges.value;
  }

  selectedSites.value = ((sites as string[]).length > 0 ? sites : allSites.value) as string[];

  if (configStore.userName === "") {
    configStore.userName = configStore.getUserNames.perfName;
  }
});

async function exportStatisticImg() {
  const createdAt = formatDate(new Date());
  const mainCanvas = document.createElement("canvas");
  const chartsCanvas = document.querySelectorAll("#chartContainer canvas");

  mainCanvas.width = containerWidth.value;
  mainCanvas.height = (perChartHeight.value + 10) * chartsCanvas.length + 10;

  const ctx = mainCanvas.getContext("2d") as CanvasRenderingContext2D;

  // 填充白色背景
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

  // 将 echart 图表渲染到 canvas 上
  let yIndex = 0;
  for (const chartCanvas of chartsCanvas) {
    ctx.drawImage(chartCanvas as HTMLCanvasElement, 0, yIndex, chartCanvas.clientWidth, chartCanvas.clientHeight);
    yIndex += perChartHeight.value + 10;
  }

  // 在 canvas 上添加右对齐文字
  ctx.font = "12px Arial";
  ctx.fillStyle = "#b5b5b5";
  ctx.textAlign = "right"; // 设置文字右对齐

  const textX = containerWidth.value - 10; // 距离右侧边缘 10px
  const textY = yIndex;
  ctx.fillText("Created By PT-Depiler (" + __EXT_VERSION__ + ") at " + createdAt, textX, textY);

  // 导出图片
  mainCanvas.toBlob((blob) => {
    saveAs(blob!, `${configStore.userName}的数据图表（${createdAt}）.png`);
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
      <v-col ref="chartContainer" id="chartContainer" style="max-width: 800px">
        <!-- 总上传、总下载、总积分 -->
        <v-chart
          v-if="configStore.userStatisticControl.showChart.totalSiteBase"
          :option="totalSiteBaseInfoChartOptions"
          :style="{ height: `${perChartHeight}px` }"
          autoresize
          class="chart"
          group="totalSiteBase"
        />
        <!-- 总保种体积、总保种数量 -->
        <v-chart
          v-if="configStore.userStatisticControl.showChart.totalSiteSeeding"
          :option="totalSiteSeedingInfoChartOptions"
          :style="{ height: `${perChartHeight}px` }"
          autoresize
          class="chart"
          group="totalSiteSeeding"
        />
        <!-- 分站点上传、下载、做种、做种量、积分、时魔值数据 -->
        <template v-for="[field, format] in perSiteChartField" :key="field">
          <v-chart
            v-if="
              // @ts-ignore
              configStore.userStatisticControl.showChart[`perSiteK${field}`]
            "
            :group="`perSiteK${field}`"
            :option="createPerSiteChartOptionsFn(field, format).value"
            :style="{ height: `${perChartHeight}px` }"
            autoresize
            class="chart"
            @mousemove="updateLastHoveredSeriesIndex"
          />
          <v-chart
            v-if="
              // @ts-ignore
              configStore.userStatisticControl.showChart[`perSiteK${field}Incr`]
            "
            :group="`perSiteK${field}Incr`"
            :option="createPerSiteChartOptionsFn(field, format, true).value"
            :style="{ height: `${perChartHeight}px` }"
            autoresize
            class="chart"
            @mousemove="updateLastHoveredSeriesIndex"
          />
        </template>
      </v-col>
      <v-col>
        <v-alert title="数据图表样式设置" type="info" class="mb-2">
          <template #append>
            <NavButton icon="mdi-arrow-left" size="small" color="grey" text="返回" @click="() => router.back()" />
            <NavButton
              color="grey"
              icon="mdi-file-export-outline"
              size="small"
              text="导出图片"
              @click="exportStatisticImg"
            />
          </template>
        </v-alert>

        <v-row>
          <v-col align-self="center">
            <v-label>用户名</v-label>
          </v-col>
          <v-col cols="12" sm="10">
            <v-combobox
              v-model="configStore.userName"
              :readonly="!allowEditName"
              append-inner-icon="mdi-history"
              :items="Object.keys(configStore.getUserNames.names)"
              hide-details
              label="用户名"
              @click:append-inner="() => (configStore.userName = configStore.getUserNames.perfName)"
            >
              <template #prepend>
                <v-icon
                  :color="allowEditName ? 'success' : ''"
                  :icon="!allowEditName ? 'mdi-lock' : 'mdi-lock-open'"
                  @click="allowEditName = !allowEditName"
                ></v-icon>
              </template>
            </v-combobox>
          </v-col>
        </v-row>

        <v-row>
          <v-col align-self="center">
            <v-label>展示图表</v-label>
          </v-col>
          <v-col cols="12" sm="10">
            <v-row>
              <v-col
                v-for="(item, index) in configStore.userStatisticControl.showChart"
                class="py-0"
                :key="index"
                cols="6"
              >
                <v-checkbox
                  v-model="configStore.userStatisticControl.showChart[index]"
                  :label="t('UserDataStatistic.chart.' + index)"
                  density="compact"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col align-self="center">
            <v-label>时间段</v-label>
          </v-col>
          <v-col cols="12" sm="10">
            <v-btn-toggle
              v-model="configStore.userStatisticControl.dateRange"
              density="comfortable"
              mandatory
              variant="tonal"
              class="overflow-x-auto"
              color="blue"
            >
              <v-btn
                v-for="day in [7, 30, 60, 90, 180]"
                :key="day"
                :value="day"
                @click="() => (selectedDateRanges = setSubDate(day))"
              >
                {{ t("UserDataStatistic.dateRange.day", [day]) }}
              </v-btn>
              <v-btn value="custom">
                {{ t("UserDataStatistic.dateRange.custom") }}
                <v-menu :close-on-content-click="false" activator="parent">
                  <v-date-picker
                    :max="allDateRanges.at(-1)"
                    :min="allDateRanges.at(0)"
                    hide-header
                    multiple="range"
                    show-adjacent-months
                    @update:model-value="
                      (v: unknown) => {
                        selectedDateRanges = (v as Date[]).map((x) => formatDate(x, 'yyyy-MM-dd')) as string[];
                        configStore.userStatisticControl.dateRange = 'custom';
                      }
                    "
                  />
                </v-menu>
              </v-btn>
              <v-btn value="all" @click="selectedDateRanges = allDateRanges">
                {{ t("UserDataStatistic.dateRange.all") }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <v-row>
          <v-col align-self="center">
            <v-label>图表设置</v-label>
          </v-col>
          <v-col cols="12" sm="10">
            <v-number-input
              v-model="configStore.userStatisticControl.hidePerSitePrecentThreshold"
              :max="100"
              :min="0"
              :precision="2"
              :step="1"
              suffix="%"
              controlVariant="default"
              hint="设置为0则不隐藏"
              label="隐藏分站点图中图例百分比低于该值的详情"
              persistent-hint
            ></v-number-input>
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
            <CheckSwitchButton v-model="selectedSites" :all="allSites" color="grey" />
          </template>
        </v-alert>

        <v-row class="my-2">
          <v-col v-for="siteId in allSites" :key="siteId" cols="6" sm="3" class="py-0">
            <v-checkbox
              v-model="selectedSites"
              :disabled="!availableSites.includes(siteId)"
              :indeterminate="!availableSites.includes(siteId)"
              :value="siteId"
              density="compact"
              hide-details
              indeterminate-icon="mdi-close"
              multiple
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

<style scoped lang="scss">
.chart {
  height: 400px;
}

.chart + .chart {
  margin-top: 10px;
}
</style>
