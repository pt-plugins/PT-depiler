<script setup lang="ts">
import { computed, onMounted, reactive, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { isUndefined } from "es-toolkit/compat";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";
import { EResultParseStatus, type ISiteUserConfig, IUserInfo, TSiteID } from "@ptd/site";

import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useTableCustomFilter } from "@/options/directives/useAdvanceFilter.ts";
import { formatDate, formatNumber, formatSize, formatTimeAgo } from "@/options/utils.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import ResultParseStatus from "@/options/components/ResultParseStatus.vue";
import NavButton from "@/options/components/NavButton.vue";
import UserLevelRequirementsTd from "./UserLevelRequirementsTd.vue";
import HistoryDataViewDialog from "./HistoryDataViewDialog.vue";

import { cancelFlushSiteLastUserInfo, fixUserInfo, flushSiteLastUserInfo, formatRatio } from "./utils.ts";

const { t } = useI18n();
const router = useRouter();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const fullTableHeader = reactive([
  {
    title: t("MyData.table.site"),
    key: "siteUserConfig.sortIndex",
    align: "center",
    width: 90,
    props: { disabled: true },
  },
  { title: t("MyData.table.username"), key: "name", align: "center", width: 90 },
  { title: t("MyData.table.levelName"), key: "levelName", align: "start", width: 90 },
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
  { title: t("MyData.table.joinTime"), key: "joinTime", align: "center" },
  { title: t("MyData.table.updateAt"), key: "updateAt", align: "center" },
  { title: t("common.action"), key: "action", align: "center", width: 90, sortable: false, props: { disabled: true } },
] as (DataTableHeader & { props?: any })[]);

const tableHeader = computed(() => {
  return fullTableHeader.filter(
    (item) => item?.props?.disabled || configStore.tableBehavior.MyData.columns!.includes(item.key!),
  ) as DataTableHeader[];
});

// 表格字体大小样式计算属性
const tableStyle = computed(() => {
  return {
    fontSize: `${configStore.myDataTableControl.tableFontSize}%`,
  };
});

const tableNonBooleanControlKey = [
  "tableFontSize",
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
}

const {
  tableWaitFilterRef,
  tableFilterRef,
  tableFilterFn,
  advanceFilterDictRef,
  updateTableFilterValueFn,
  resetAdvanceFilterDictFn,
  toggleKeywordStateFn,
} = useTableCustomFilter<IUserInfoItem>({
  parseOptions: {
    keywords: ["site", "status", "siteUserConfig.groups"],
    ranges: ["updateAt", "messageCount"],
  },
  titleFields: ["site", "name", "siteUserConfig.merge.name"],
});

const tableSelected = ref<TSiteID[]>([]); // 选中的站点行
const tableData = shallowRef<IUserInfoItem[]>([]);

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

    const siteUserInfoData = metadataStore.lastUserInfo[siteId] ?? {};
    allPrivateSiteUserInfoData.push({
      ...fixUserInfo(siteUserInfoData),
      site: siteId,
      siteUserConfig,
      // 对 isDead 或者 isOffline 的站点不允许选择（ https://github.com/pt-plugins/PT-depiler/pull/140 ）
      selectable: !(siteMeta.isDead || siteUserConfig.isOffline),
    });
  }

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
          :disabled="tableSelected.length === 0"
          :text="t('MyData.index.flushSelectSite')"
          color="green"
          icon="mdi-cached"
          @click="() => flushSiteLastUserInfo(tableSelected)"
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
            <!-- 表格字体大小控制 -->
            <v-list-item>
              <template v-slot:prepend>
                <v-list-item-action start class="ml-2">
                  <v-icon icon="mdi-format-font-size-increase" class="mr-2" />
                  <v-btn
                    class="text-subtitle-2 pa-0"
                    variant="text"
                    :title="t('common.dialog.reset')"
                    @click.stop="configStore.myDataTableControl.tableFontSize = 100"
                  >
                    {{ t("MyData.index.tableFontSize") }}
                  </v-btn>
                </v-list-item-action>
              </template>
              <v-slider
                v-model="configStore.myDataTableControl.tableFontSize"
                :min="75"
                :max="125"
                :step="1"
                density="compact"
                hide-details
                :ticks="[100]"
                show-ticks="always"
                @click.stop
                @update:model-value="() => configStore.$save()"
              >
                <template #tick-label></template>
                <template v-slot:thumb-label="{ modelValue }"> {{ modelValue }}% </template>
              </v-slider>
            </v-list-item>

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
          @click:clear="resetAdvanceFilterDictFn"
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
                      advanceFilterDictRef.updateAt.value = ['', formatDate(new Date(), 'yyyyMMdd')];
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
                      advanceFilterDictRef.messageCount.value = [1, ' '];
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
      :sort-by="configStore.tableBehavior.MyData.sortBy"
      :style="tableStyle"
      class="table-stripe table-header-no-wrap table-no-ext-padding"
      hover
      item-selectable="selectable"
      item-value="site"
      show-select
      @update:itemsPerPage="(v) => configStore.updateTableBehavior('MyData', 'itemsPerPage', v)"
      @update:sortBy="(v) => configStore.updateTableBehavior('MyData', 'sortBy', v)"
    >
      <!-- 站点信息 -->
      <template #item.siteUserConfig.sortIndex="{ item }">
        <div class="d-flex flex-column align-center">
          <v-badge
            :model-value="configStore.myDataTableControl.showUnreadMessage && (item.messageCount ?? 0) > 0"
            :content="item.messageCount"
            :max="10"
            color="error"
          >
            <div class="favicon-hover-wrapper favicon-hover-bg">
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
        <v-container
          v-if="
            configStore.myDataTableControl.showSeedingBonus &&
            item.seedingBonus !== '' &&
            !isUndefined(item.seedingBonus)
          "
        >
          <v-row align="center" class="flex-nowrap" justify="end">
            <v-icon :title="t('levelRequirement.bonus')" color="green-darken-4" icon="mdi-currency-usd" size="small" />
            <span class="text-no-wrap">
              {{ typeof item.bonus !== "undefined" ? formatNumber(item.bonus) : "-" }}
            </span>
          </v-row>
          <v-row align="center" class="flex-nowrap" justify="end">
            <v-icon
              :title="t('levelRequirement.seedingBonus')"
              color="green-darken-4"
              icon="mdi-lightning-bolt-circle"
              size="small"
            />
            <span class="text-no-wrap">
              {{ formatNumber(item.seedingBonus) }}
            </span>
          </v-row>
        </v-container>
        <template v-else>
          <v-icon :title="t('levelRequirement.bonus')" color="green-darken-4" icon="mdi-currency-usd" size="small" />
          <span class="text-no-wrap">
            {{ typeof item.bonus !== "undefined" ? formatNumber(item.bonus) : "-" }}
          </span>
        </template>
      </template>

      <template #item.bonusPerHour="{ item }">
        <span class="text-no-wrap">
          {{ typeof item.bonusPerHour !== "undefined" ? formatNumber(item.bonusPerHour) : "-" }}
        </span>
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

      <!-- 更新时间 -->
      <template #item.updateAt="{ item }">
        <template v-if="item.status === EResultParseStatus.success">
          <span class="text-wrap" :title="item.updateAt ? (formatDate(item.updateAt) as string) : '-'">
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
          <v-chip label>
            <ResultParseStatus :status="item.status" />
          </v-chip>
        </template>
      </template>

      <!-- 操作 -->
      <template #item.action="{ item }">
        <v-btn-group variant="text">
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
</style>
