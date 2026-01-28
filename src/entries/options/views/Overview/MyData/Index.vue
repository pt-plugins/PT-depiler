<script setup lang="ts">
import { computed, onMounted, reactive, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { differenceInDays } from "date-fns";
import { isUndefined } from "es-toolkit/compat";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";
import { EResultParseStatus, type ISiteUserConfig, IUserInfo, TSiteID } from "@ptd/site";

import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useTableCustomFilter } from "@/options/directives/useAdvanceFilter.ts";
import { formatDate, formatSize, formatTimeAgo } from "@/options/utils.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import ResultParseStatus from "@/options/components/ResultParseStatus.vue";
import NavButton from "@/options/components/NavButton.vue";
import UserLevelRequirementsTd from "./UserLevelRequirementsTd.vue";
import HistoryDataViewDialog from "./HistoryDataViewDialog.vue";
import BonusFormatSpan from "./BonusFormatSpan.vue";

import { cancelFlushSiteLastUserInfo, fixUserInfo, flushSiteLastUserInfo, formatRatio } from "./utils.ts";
import { sendMessage } from "@/messages.ts";

const { t } = useI18n();
const router = useRouter();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const currentDate = new Date();

const fullTableHeader = reactive([
  {
    title: t("MyData.table.site"),
    key: "siteUserConfig.sortIndex",
    align: "center",
    props: { disabled: true },
  },
  { title: t("MyData.table.username"), key: "name", align: "center" },
  { title: t("MyData.table.levelName"), key: "levelName", align: "start", width: "15%" },
  // NOTE: 这里将key设为 uploaded, trueUploaded 而不是虚拟的 userData，可以让 v-data-table 使用 uploaded 的进行排序
  { title: t("MyData.table.userData"), key: "uploaded", align: "end" },
  { title: t("MyData.table.trueUserData"), key: "trueUploaded", align: "end" }, // 默认不显示
  { title: t("levelRequirement.ratio"), key: "ratio", align: "end" },
  { title: t("levelRequirement.trueRatio"), key: "trueRatio", align: "end" }, // 默认不显示
  { title: t("levelRequirement.uploads"), key: "uploads", align: "end" },
  { title: t("levelRequirement.seeding"), key: "seeding", align: "end" },
  { title: t("levelRequirement.seedingSize"), key: "seedingSize", align: "end" },
  { title: t("levelRequirement.bonus"), key: "bonus", align: "end" },
  { title: t("levelRequirement.bonusPerHour"), key: "bonusPerHour", align: "end" },
  { title: t("MyData.table.invites"), key: "invites", align: "end" }, // 默认不显示
  { title: t("MyData.table.joinTime"), key: "joinTime", align: "center" },
  { title: t("MyData.table.lastAccessAt"), key: "lastAccessAt", align: "center" }, // 默认不显示
  { title: t("MyData.table.updateAt"), key: "updateAt", align: "center" },
  { title: t("common.action"), key: "action", align: "center", sortable: false, props: { disabled: true } },
] as (DataTableHeader & { props?: any })[]);

const tableHeader = computed(() => {
  return fullTableHeader.filter(
    (item) => item?.props?.disabled || configStore.tableBehavior.MyData.columns!.includes(item.key!),
  ) as DataTableHeader[];
});

const tableNonBooleanControlKey = [
  "joinTimeFormat",
  // Deprecated
  "joinTimeWeekOnly",
];

// 过滤出表格控制中非布尔类型的键
const filteredTableBooleanControlKeys = computed(() => {
  return Object.keys(configStore.myDataTableControl).filter(
    (key) => tableNonBooleanControlKey.indexOf(key) === -1,
  ) as (keyof typeof configStore.myDataTableControl)[];
});

interface IUserInfoItem extends IUserInfo {
  siteUserConfig: ISiteUserConfig;
  // 当获取失败时，用于存储历史数据的更新时间
  historyUpdateAt?: number;
  // 用于排序的优先级：错误或空数据应该置顶显示
  sortPriority?: number;
}

// 检查用户数据是否为空（即使状态是成功，但关键字段为空）
function isEmptyUserInfo(userInfo: Partial<IUserInfo>): boolean {
  // 检查关键字段是否为空
  const hasValidBonus = userInfo.bonus !== undefined && userInfo.bonus !== "" && userInfo.bonus !== 0;
  const hasValidLevelName = userInfo.levelName !== undefined && userInfo.levelName !== "";
  // joinTime 可能是 number（时间戳）或 string（空字符串），需要兼容处理
  // 注意：虽然类型定义是 number，但实际数据中可能有空字符串的情况
  const joinTimeValue: number | string | undefined = userInfo.joinTime as number | string | undefined;
  const hasValidJoinTime =
    joinTimeValue !== undefined &&
    joinTimeValue !== 0 &&
    joinTimeValue !== "" &&
    (typeof joinTimeValue === "number" || (typeof joinTimeValue === "string" && joinTimeValue.trim() !== ""));
  const hasValidTraffic = (userInfo.uploaded !== undefined && userInfo.uploaded > 0) ||
    (userInfo.downloaded !== undefined && userInfo.downloaded > 0);

  // 如果所有关键字段都为空，则认为是空数据
  return !hasValidBonus && !hasValidLevelName && !hasValidJoinTime && !hasValidTraffic;
}

const {
  tableWaitFilterRef,
  tableFilterRef,
  tableFilterFn,
  advanceFilterDictRef,
  updateTableFilterValueFn,
  buildFilterDictFn,
  toggleKeywordStateFn,
} = useTableCustomFilter<IUserInfoItem>({
  parseOptions: {
    keywords: ["site", "status", "siteUserConfig.groups"],
    ranges: ["updateAt", "messageCount"],
  },
  titleFields: ["site", "name", "siteUserConfig.merge.name"],
  format: {
    status: "number",
  },
});

const tableSelected = ref<TSiteID[]>([]); // 选中的站点行
const tableData = shallowRef<IUserInfoItem[]>([]);

// 计算排序字段：始终将 sortPriority 作为第一排序条件
const computedSortBy = computed(() => {
  const userSortBy = configStore.tableBehavior.MyData.sortBy;
  const sortByArray = Array.isArray(userSortBy) ? [...userSortBy] : userSortBy ? [userSortBy] : [];
  
  // 检查第一个排序字段是否是 sortPriority
  const firstSort = sortByArray[0];
  if (firstSort && typeof firstSort === 'object' && firstSort.key === 'sortPriority') {
    return sortByArray;
  }
  
  // 如果不是，将 sortPriority 添加到最前面
  return [{ key: 'sortPriority', order: 'asc' as const }, ...sortByArray];
});

// 处理用户排序更新，确保 sortPriority 始终在最前面
function handleSortByUpdate(v: any) {
  const sortByArray = Array.isArray(v) ? [...v] : v ? [v] : [];
  
  // 移除可能存在的 sortPriority
  const filteredSortBy = sortByArray.filter((item: any) => {
    if (typeof item === 'string') {
      return item !== 'sortPriority';
    }
    return item.key !== 'sortPriority';
  });
  
  // 将 sortPriority 添加到最前面
  const newSortBy = [{ key: 'sortPriority', order: 'asc' as const }, ...filteredSortBy];
  configStore.updateTableBehavior('MyData', 'sortBy', newSortBy);
}

async function updateTableData() {
  const allPrivateSiteUserInfoData = [];

  for (const [siteId, siteUserConfig] of Object.entries(metadataStore.sites)) {
    const siteMeta = await metadataStore.getSiteMetadata(siteId);

    if (
      // 只显示私有站点的用户信息
      siteMeta.type === "public" ||
      // 根据配置决定是否显示已死亡站点的用户信息
      (!configStore.userInfo.showDeadSiteInOverview && siteMeta.isDead === true) ||
      // 根据配置决定是否显示设置了离线模式或不允许查询用户信息的站点
      (!siteMeta.isDead &&
        !configStore.userInfo.showPassedSiteInOverview &&
        (siteUserConfig.isOffline === true || siteUserConfig.allowQueryUserInfo === false))
    ) {
      continue;
    }

    let siteUserInfoData = metadataStore.lastUserInfo[siteId] ?? {};
    const currentStatus = siteUserInfoData.status;
    const currentUpdateAt = siteUserInfoData.updateAt;
    const isCurrentEmpty = isEmptyUserInfo(siteUserInfoData);

    // 如果当前获取失败或当前数据为空，尝试从历史记录中查找最后一次非空的数据
    let historyUpdateAt: number | undefined;
    let hasHistoryValidData = false; // 标记是否有历史非空数据
    if (currentStatus !== EResultParseStatus.success || isCurrentEmpty) {
      try {
        const historyData = (await sendMessage("getSiteUserInfo", siteId)) as Record<string, IUserInfo>;
        if (historyData) {
          // 查找最后一次成功且非空的数据
          let lastValidDate: string | null = null;
          let lastValidData: IUserInfo | null = null;
          for (const [date, item] of Object.entries(historyData)) {
            if (
              item.status === EResultParseStatus.success &&
              !isEmptyUserInfo(item) &&
              (!lastValidDate || new Date(date) > new Date(lastValidDate))
            ) {
              lastValidDate = date;
              lastValidData = item;
            }
          }

          // 如果找到历史非空数据，说明当前空数据是异常情况，应该提醒用户
          if (lastValidData) {
            hasHistoryValidData = true;
            // 记录历史数据的更新时间用于显示
            if (lastValidData.updateAt) {
              historyUpdateAt = typeof lastValidData.updateAt === "number" ? lastValidData.updateAt : new Date(lastValidData.updateAt).getTime();
            }

            // 使用历史非空数据填充
            // 如果当前数据为空但状态是成功，改为错误状态以提醒用户（因为有历史非空数据，说明应该能获取到数据）
            const shouldShowError = isCurrentEmpty && currentStatus === EResultParseStatus.success;
            siteUserInfoData = {
              ...lastValidData,
              status: shouldShowError ? EResultParseStatus.parseError : siteUserInfoData.status, // 如果是空数据且有历史非空数据，则显示错误状态
              updateAt: currentUpdateAt, // 保留当前更新时间
            };
          } else {
            // 没有找到历史非空数据，说明可能站点本身就没有这些数据，不应该显示为错误
            // 保持当前状态和数据
          }
        }
      } catch (error) {
        // 获取历史数据失败，继续使用当前数据
      }
    }

    // 计算排序优先级：只有报错状态或有历史非空数据但当前为空时，才置顶显示
    // 优先级越小越靠前：0 = 错误状态或有历史非空数据但当前为空，1 = 正常数据
    const finalStatus = siteUserInfoData.status;
    // 只有当是错误状态（包括因为有历史非空数据而标记为错误），才置顶显示
    const sortPriority = finalStatus !== EResultParseStatus.success ? 0 : 1;

    allPrivateSiteUserInfoData.push({
      ...fixUserInfo(siteUserInfoData),
      site: siteId,
      siteUserConfig,
      historyUpdateAt, // 存储历史数据的更新时间
      sortPriority, // 排序优先级
      // 对 isDead 或者 isOffline 的站点不允许选择（ https://github.com/pt-plugins/PT-depiler/pull/140 ）
      selectable: !(siteMeta.isDead || siteUserConfig.isOffline),

      // 预先计算 多少天未访问站点，以防止在 template 中反复计算
      lastAccessDuration:
        typeof siteUserInfoData.lastAccessAt === "number"
          ? differenceInDays(currentDate, siteUserInfoData.lastAccessAt)
          : 0,
    });
  }

  // 对数据进行排序：报错和空数据的站点置顶显示
  allPrivateSiteUserInfoData.sort((a, b) => {
    // 先按优先级排序（0 在前，1 在后）
    if (a.sortPriority !== b.sortPriority) {
      return (a.sortPriority ?? 1) - (b.sortPriority ?? 1);
    }
    // 如果优先级相同，保持原有顺序（可以通过站点ID或其他字段排序）
    return 0;
  });

  tableData.value = allPrivateSiteUserInfoData;
}

onMounted(() => updateTableData()); // 挂载时加载表格数据
watch(
  () => metadataStore.lastUserInfo, // 监听用户信息变化
  () => updateTableData(),
  { deep: true },
);

const showHistoryDataViewDialog = ref<boolean>(false);
const historyDataViewDialogSiteId = ref<TSiteID | null>(null);
function viewHistoryData(siteId: TSiteID) {
  showHistoryDataViewDialog.value = true;
  historyDataViewDialogSiteId.value = siteId;
}

async function multiOpen() {
  for (const siteId of tableSelected.value) {
    const siteUrl = await metadataStore.getSiteUrl(siteId);
    if (siteUrl) {
      window.open(siteUrl, "_blank", "noopener noreferrer");
    }
  }
}

async function multiFlush() {
  let flushSiteIds: TSiteID[] = tableSelected.value;
  if (flushSiteIds.length === 0) {
    flushSiteIds = tableData.value.map((item) => item.site);
    runtimeStore.showSnakebar("未选择任何站点，默认刷新全部站点", { color: "info" });
  }

  if (flushSiteIds.length > 0) {
    flushSiteLastUserInfo(flushSiteIds);
  } else {
    runtimeStore.showSnakebar("未选择任何站点，取消刷新", { color: "warning" });
  }
}

function viewTimeline() {
  router.push({
    name: "UserDataTimeline",
    query: {
      sites: tableSelected.value,
    },
  });
}

function viewStatistic() {
  router.push({
    name: "UserDataStatistic",
    query: {
      sites: tableSelected.value,
    },
  });
}
</script>

<template>
  <v-alert :title="t('route.Overview.MyData')" type="info" />
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <!-- 刷新，取消刷新 -->
        <NavButton
          v-if="runtimeStore.isUserInfoFlush"
          :text="t('MyData.index.flushCancel')"
          color="red"
          icon="mdi-cancel"
          @click="cancelFlushSiteLastUserInfo"
        />

        <NavButton
          v-else
          :text="t('MyData.index.flushSelectSite')"
          color="green"
          icon="mdi-cached"
          @click="multiFlush"
        />

        <NavButton
          :disabled="tableSelected.length === 0"
          color="indigo"
          icon="mdi-open-in-new"
          :text="t('MyData.index.multiOpen')"
          @click="multiOpen"
        />

        <v-divider class="mx-2" vertical />

        <NavButton
          color="green"
          icon="mdi-chart-timeline-variant"
          :text="t('MyData.index.viewTimeline')"
          @click="viewTimeline"
        />
        <NavButton color="green" icon="mdi-equalizer" :text="t('MyData.index.viewStatistic')" @click="viewStatistic" />

        <v-divider class="mx-2" vertical />

        <v-menu :close-on-content-clicks="false">
          <template v-slot:activator="{ props }">
            <NavButton color="blue" icon="mdi-cog" :text="t('MyData.index.setting')" class="mr-1" v-bind="props" />
          </template>
          <v-list>
            <!-- 入站时间显示 -->
            <v-list-item>
              <template v-slot:prepend>
                <v-list-item-action start class="ml-2">
                  <v-icon icon="mdi-calendar-account" class="mr-2" />
                  <span class="text-subtitle-2">{{ t("MyData.index.joinTimeFormat") }}</span>
                </v-list-item-action>
              </template>

              <v-btn-toggle
                v-model="configStore.myDataTableControl.joinTimeFormat"
                density="compact"
                hide-details
                class="ml-2"
                @click.stop
                @update:model-value="() => configStore.$save()"
              >
                <v-btn
                  v-for="type in ['alive', 'aliveWeek', 'added']"
                  :key="type"
                  :value="type"
                  :title="t(`MyData.index.joinTimeFormatOptions.${type}`)"
                  density="compact"
                  hide-details
                >
                  {{ t(`MyData.index.joinTimeFormatOptions.${type}`) }}
                </v-btn>
              </v-btn-toggle>
            </v-list-item>

            <v-divider />

            <!-- 其他开关控制 -->
            <v-list-item v-for="index in filteredTableBooleanControlKeys" :key="index" :value="index">
              <template v-slot:prepend>
                <v-list-item-action start class="ml-2">
                  <v-switch
                    v-model="configStore.myDataTableControl[index]"
                    :label="`&nbsp;${t('MyData.index.' + index)}`"
                    color="success"
                    density="compact"
                    hide-details
                    @click.stop
                    @update:model-value="() => configStore.$save()"
                  />
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-combobox
          v-model="configStore.tableBehavior.MyData.columns"
          :items="fullTableHeader"
          :return-object="false"
          chips
          class="table-header-filter-clear"
          density="compact"
          hide-details
          item-value="key"
          max-width="200"
          multiple
          prepend-inner-icon="mdi-filter-cog"
          @update:model-value="(v) => configStore.updateTableBehavior('MyData', 'columns', v)"
        >
          <template #chip="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ item.title }}</span>
            </v-chip>
            <span v-if="index === 1" class="text-grey caption">
              (+{{ configStore.tableBehavior.MyData.columns!.length - 1 }})
            </span>
          </template>
        </v-combobox>

        <v-spacer />

        <v-text-field
          v-model="tableWaitFilterRef"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          :label="t('common.search')"
          max-width="500"
          single-line
          @click:clear="buildFilterDictFn('')"
        >
          <template #prepend-inner>
            <v-menu min-width="100">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-filter" variant="plain" />
              </template>
              <v-list class="pa-0">
                <v-list-item-subtitle class="ma-2">
                  {{ t("MyData.index.siteStatus") }}
                </v-list-item-subtitle>

                <v-list-item
                  :title="t('MyData.index.filter.todayNotUpdated')"
                  @click.stop="
                    () => {
                      advanceFilterDictRef.updateAt = ['', formatDate(currentDate, 'yyyyMMdd')];
                      updateTableFilterValueFn();
                    }
                  "
                />

                <v-list-item
                  :title="t('MyData.index.filter.lastUpdateError')"
                  @click.stop="
                    () => {
                      advanceFilterDictRef.status.required = [
                        EResultParseStatus.parseError,
                        EResultParseStatus.unknownError,
                        EResultParseStatus.needLogin,
                      ].map((item) => item.toString());
                      updateTableFilterValueFn();
                    }
                  "
                />

                <v-list-item
                  :title="t('MyData.index.filter.unreadMessage')"
                  @click.stop="
                    () => {
                      advanceFilterDictRef.messageCount = [1, ' '];
                      updateTableFilterValueFn();
                    }
                  "
                />

                <v-list-item-subtitle class="ma-2">
                  {{ t("MyData.index.siteCategory") }}
                </v-list-item-subtitle>

                <v-list-item
                  v-for="(item, index) in metadataStore.getSitesGroupData"
                  :key="index"
                  :value="index"
                  class="pr-6"
                >
                  <v-checkbox
                    v-model="advanceFilterDictRef[`siteUserConfig.groups`].required"
                    :label="`${index} (${item.length})`"
                    :value="index"
                    density="compact"
                    hide-details
                    indeterminate
                    @click.stop="(v: any) => toggleKeywordStateFn(`siteUserConfig.groups`, index)"
                    @update:model-value="() => updateTableFilterValueFn()"
                  />
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
      </v-row>
    </v-card-title>
    <v-data-table
      v-model="tableSelected"
      :custom-filter="tableFilterFn"
      :filter-keys="['site'] /* 对每个item值只检索一次 */"
      :headers="tableHeader"
      :items="tableData"
      :items-per-page="configStore.tableBehavior.MyData.itemsPerPage"
      :multi-sort="configStore.enableTableMultiSort"
      :search="tableFilterRef"
      :sort-by="computedSortBy"
      class="table-stripe table-header-no-wrap table-no-ext-padding"
      hover
      item-selectable="selectable"
      item-value="site"
      show-select
      @update:itemsPerPage="(v) => configStore.updateTableBehavior('MyData', 'itemsPerPage', v)"
      @update:sortBy="handleSortByUpdate"
    >
      <!-- 站点信息 -->
      <template #item.siteUserConfig.sortIndex="{ item }">
        <div class="d-flex flex-column align-center">
          <v-badge
            :model-value="configStore.myDataTableControl.showUnreadMessage && (item.messageCount ?? 0) > 0"
            :content="(item.messageCount ?? 0) > 10 ? undefined : item.messageCount"
            color="error"
          >
            <div
              class="favicon-hover-wrapper favicon-hover-bg"
              :class="{ 'error-blink': item.status !== EResultParseStatus.success }"
            >
              <SiteFavicon
                :site-id="item.site"
                :size="configStore.myDataTableControl.showSiteName ? 18 : 24"
                @click="() => flushSiteLastUserInfo([item.site])"
              />
            </div>
          </v-badge>

          <SiteName v-if="configStore.myDataTableControl.showSiteName" :site-id="item.site" />
        </div>
      </template>

      <!-- 用户名，用户ID -->
      <template #item.name="{ item }">
        <span :title="item.id as string" class="text-no-wrap">
          {{ configStore.myDataTableControl.showUserName ? (item.name ?? "-") : "******" }}
        </span>
      </template>

      <!-- 等级信息，升级信息 -->
      <template #item.levelName="{ item }">
        <UserLevelRequirementsTd :user-info="item" />
      </template>

      <!-- 上传、下载 -->
      <template #item.uploaded="{ item }">
        <v-container>
          <v-row class="flex-nowrap" justify="end">
            <span class="text-no-wrap">
              {{ typeof item.uploaded !== "undefined" ? formatSize(item.uploaded) : "-" }}
            </span>
            <v-icon color="green-darken-4" icon="mdi-chevron-up" size="small"></v-icon>
          </v-row>
          <v-row class="flex-nowrap" justify="end">
            <span class="text-no-wrap">
              {{ typeof item.downloaded !== "undefined" ? formatSize(item.downloaded) : "-" }}
            </span>
            <v-icon color="red-darken-4" icon="mdi-chevron-down" size="small"></v-icon>
          </v-row>
        </v-container>
      </template>

      <!-- 真实上传、下载 -->
      <template #item.trueUploaded="{ item }">
        <v-container>
          <v-row class="flex-nowrap" justify="end">
            <span class="text-no-wrap">
              {{ typeof item.trueUploaded !== "undefined" ? formatSize(item.trueUploaded) : "-" }}
            </span>
            <v-icon color="green-darken-4" icon="mdi-chevron-up" size="small"></v-icon>
          </v-row>
          <v-row class="flex-nowrap" justify="end">
            <span class="text-no-wrap">
              {{ typeof item.trueDownloaded !== "undefined" ? formatSize(item.trueDownloaded) : "-" }}
            </span>
            <v-icon color="red-darken-4" icon="mdi-chevron-down" size="small"></v-icon>
          </v-row>
        </v-container>
      </template>

      <!-- 分享率 -->
      <template #item.ratio="{ item }">
        <span class="text-no-wrap">{{ formatRatio(item) }}</span>
      </template>

      <!-- 真实分享率 -->
      <template #item.trueRatio="{ item }">
        <span class="text-no-wrap">{{ formatRatio(item, "trueRatio") }}</span>
      </template>

      <!-- 发布数 -->
      <template #item.uploads="{ item }">
        <span class="text-no-wrap">{{ item.uploads ?? "-" }}</span>
      </template>

      <!-- 做种数， H&R 情况  -->
      <template #item.seeding="{ item }">
        <v-container class="py-0">
          <v-row align="center" class="flex-nowrap my-0" justify="end">
            <span class="text-no-wrap">{{ item.seeding ?? "-" }}</span>
          </v-row>
          <v-row v-if="configStore.myDataTableControl.showHnR" align="center" class="flex-nowrap my-0" justify="end">
            <span
              v-if="typeof item.hnrPreWarning !== 'undefined' && item.hnrPreWarning > 0"
              class="d-inline-flex align-center ml-2"
            >
              <v-icon
                :title="t('levelRequirement.hnrPreWarning')"
                color="yellow-darken-4"
                icon="mdi-alert"
                size="small"
              />
              <span class="text-no-wrap">
                {{ item.hnrPreWarning }}
              </span>
            </span>
            <span
              v-if="typeof item.hnrUnsatisfied !== 'undefined' && item.hnrUnsatisfied > 0"
              class="d-inline-flex align-center ml-1"
            >
              <v-icon
                :title="t('levelRequirement.hnrUnsatisfied')"
                color="red-darken-4"
                icon="mdi-alert-circle"
                size="small"
              />
              <span class="text-no-wrap">
                {{ item.hnrUnsatisfied }}
              </span>
            </span>
          </v-row>
        </v-container>
      </template>

      <!-- 做种量 -->
      <template #item.seedingSize="{ item }">
        <span class="text-no-wrap">
          {{ typeof item.seedingSize !== "undefined" ? formatSize(item.seedingSize) : "-" }}
        </span>
      </template>

      <!-- 魔力/积分 -->
      <template #item.bonus="{ item }">
        <v-container>
          <v-row align="center" class="flex-nowrap" justify="end">
            <v-icon :title="t('levelRequirement.bonus')" color="green-darken-4" icon="mdi-currency-usd" size="small" />
            <BonusFormatSpan :num="item.bonus" />
          </v-row>
          <v-row
            v-if="
              configStore.myDataTableControl.showSeedingBonus &&
              item.seedingBonus !== '' &&
              !isUndefined(item.seedingBonus)
            "
            align="center"
            class="flex-nowrap"
            justify="end"
          >
            <v-icon
              :title="t('levelRequirement.seedingBonus')"
              color="green-darken-4"
              icon="mdi-lightning-bolt-circle"
              size="small"
            />
            <BonusFormatSpan :num="item.seedingBonus" />
          </v-row>
        </v-container>
      </template>

      <template #item.bonusPerHour="{ item }">
        <BonusFormatSpan :num="item.bonusPerHour" />
      </template>

      <template #item.invites="{ item }">
        <span class="text-no-wrap">{{ typeof item.invites !== "undefined" ? item.invites : "-" }}</span>
      </template>

      <!-- 入站时间 -->
      <template #item.joinTime="{ item }">
        <span class="text-no-wrap" :title="item.joinTime ? (formatDate(item.joinTime) as string) : '-'">
          {{
            typeof item.joinTime !== "undefined"
              ? configStore.myDataTableControl.joinTimeFormat === "aliveWeek"
                ? formatTimeAgo(item.joinTime, true)
                : configStore.myDataTableControl.joinTimeFormat === "alive"
                  ? formatTimeAgo(item.joinTime)
                  : formatDate(item.joinTime, "yyyy-MM-dd")
              : "-"
          }}
        </span>
      </template>

      <!-- 最近访问时间 -->
      <template #item.lastAccessAt="{ item }">
        <span class="text-no-wrap" :title="item.lastAccessAt ? (formatDate(item.lastAccessAt) as string) : '-'">
          <template v-if="typeof item.lastAccessAt !== 'undefined'">
            {{ formatDate(item.lastAccessAt) }}
            <v-icon
              v-if="item.lastAccessDuration >= 5"
              icon="mdi-alert"
              :color="item.lastAccessDuration >= 15 ? 'red' : 'amber'"
              :title="t('MyData.table.lastAccessDurationNote', [item.lastAccessDuration])"
            />
          </template>
          <template v-else>-</template>
        </span>
      </template>

      <!-- 更新时间 -->
      <template #item.updateAt="{ item }">
        <template v-if="item.status === EResultParseStatus.success">
          <v-container v-if="item.historyUpdateAt" class="py-0">
            <v-row class="flex-nowrap my-0" justify="center">
              <span class="text-wrap" :title="item.updateAt ? (formatDate(item.updateAt) as string) : '-'">
                {{
                  item.updateAt
                    ? configStore.myDataTableControl.updateAtFormatAsAlive
                      ? formatTimeAgo(item.updateAt)
                      : formatDate(item.updateAt)
                    : "-"
                }}
              </span>
            </v-row>
            <v-row class="flex-nowrap my-0" justify="center">
              <span
                class="text-caption text-wrap text-grey"
                :title="item.historyUpdateAt ? (formatDate(item.historyUpdateAt) as string) : '-'"
              >
                {{
                  item.historyUpdateAt
                    ? configStore.myDataTableControl.updateAtFormatAsAlive
                      ? formatTimeAgo(item.historyUpdateAt)
                      : formatDate(item.historyUpdateAt)
                    : "-"
                }}
              </span>
            </v-row>
          </v-container>
          <span v-else class="text-wrap" :title="item.updateAt ? (formatDate(item.updateAt) as string) : '-'">
            {{
              item.updateAt
                ? configStore.myDataTableControl.updateAtFormatAsAlive
                  ? formatTimeAgo(item.updateAt)
                  : formatDate(item.updateAt)
                : "-"
            }}
          </span>
        </template>
        <template v-else>
          <v-container class="py-0">
            <v-row class="flex-nowrap my-0" justify="center">
              <v-chip density="compact" label size="small" class="error-blink-chip">
                <ResultParseStatus :status="item.status" />
              </v-chip>
            </v-row>
            <v-row v-if="item.historyUpdateAt" class="flex-nowrap my-0" justify="center">
              <span
                class="text-caption text-wrap"
                :title="item.historyUpdateAt ? (formatDate(item.historyUpdateAt) as string) : '-'"
              >
                {{
                  item.historyUpdateAt
                    ? configStore.myDataTableControl.updateAtFormatAsAlive
                      ? formatTimeAgo(item.historyUpdateAt)
                      : formatDate(item.historyUpdateAt)
                    : "-"
                }}
              </span>
            </v-row>
          </v-container>
        </template>
      </template>

      <!-- 操作 -->
      <template #item.action="{ item }">
        <v-btn-group class="table-action" density="compact" variant="plain">
          <v-btn
            :title="t('MyData.table.action.viewHistoryData')"
            color="blue"
            icon="mdi-view-list"
            size="small"
            @click="() => viewHistoryData(item.site)"
          >
          </v-btn>
          <v-btn
            :disabled="runtimeStore.userInfo.flushPlan[item.site]"
            :loading="runtimeStore.userInfo.flushPlan[item.site]"
            :title="t('MyData.table.action.flushData')"
            color="green"
            icon="mdi-cached"
            size="small"
            @click="() => flushSiteLastUserInfo([item.site])"
          ></v-btn>
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <HistoryDataViewDialog v-model="showHistoryDataViewDialog" :site-id="historyDataViewDialogSiteId!" />
</template>

<style scoped lang="scss">
.favicon-hover-wrapper {
  cursor: pointer;
}

.favicon-hover-bg {
  border-radius: 50%;
  transition: background 0.2s;
  display: inline-flex;
  padding: 4px;
}

.favicon-hover-bg:hover {
  background: rgba(0, 0, 0, 0.3);
}

.error-blink {
  animation: errorBlink 1.5s infinite;
  border-radius: 50%;
  padding: 4px;
}

.error-blink-chip {
  animation: errorBlinkChip 1.5s infinite;
}

@keyframes errorBlink {
  0%,
  100% {
    background-color: rgba(244, 67, 54, 0);
  }
  50% {
    background-color: rgba(244, 67, 54, 0.4);
  }
}

@keyframes errorBlinkChip {
  0%,
  100% {
    background-color: rgba(244, 67, 54, 0.2);
    border-color: rgba(244, 67, 54, 0.3);
  }
  50% {
    background-color: rgba(244, 67, 54, 0.6);
    border-color: rgba(244, 67, 54, 0.8);
  }
}
</style>
