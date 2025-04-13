<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";

import { useUIStore } from "@/options/stores/ui.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import { formatRatio, flushSiteLastUserInfo, fixUserInfo } from "./utils.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import UserLevelRequirementsTd from "./UserLevelRequirementsTd.vue";

import { type ISiteUserConfig, IUserInfo, TSiteID } from "@ptd/site";

import { formatDate, formatNumber, formatSize } from "@/options/utils.ts";
import HistoryDataViewDialog from "@/options/views/Overview/MyData/HistoryDataViewDialog.vue";

const { t } = useI18n();
const uiStore = useUIStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const fullTableHeader = reactive([
  { title: t("MyData.table.site"), key: "siteUserConfig.sortIndex", align: "center", width: 90, alwaysShow: true },
  { title: t("MyData.table.username"), key: "name", align: "center", width: 90, alwaysShow: true },
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
  { title: t("MyData.table.joinTime"), key: "joinTime", align: "center" },
  { title: t("MyData.table.updateAt"), key: "updateAt", align: "center", alwaysShow: true },
  { title: t("common.action"), key: "action", align: "center", width: 90, sortable: false, alwaysShow: true },
]);

const tableHeader = computed(() => {
  return fullTableHeader.filter((item) => item.alwaysShow || uiStore.tableBehavior.MyData.columns!.includes(item.key));
});

const tableData = computedAsync<Array<IUserInfo & { siteUserConfig: ISiteUserConfig }>>(async () => {
  const allSite = metadataStore.getAddedSiteIds;
  const allPrivateSiteUserInfoData = [];
  for (const site of allSite) {
    // noinspection BadExpressionStatementJS
    metadataStore.lastUserInfo[site]; // 使得 computedAsync 能够收集依赖以便触发数据更新
  }

  for (const [siteId, siteUserConfig] of Object.entries(metadataStore.sites)) {
    console.log(siteId, siteUserConfig);
    // 判断之前有无个人信息，没有则从siteMetadata中根据 type = 'private' 判断是否能获取个人信息
    let canHanSiteUserInfo = !!metadataStore.lastUserInfo[siteId];
    if (!canHanSiteUserInfo) {
      const siteMeta = await metadataStore.getSiteMetadata(siteId);
      canHanSiteUserInfo = siteMeta?.type === "private";
    }

    if (canHanSiteUserInfo) {
      const siteUserInfoData = metadataStore.lastUserInfo[siteId] ?? { site: siteId, siteUserConfig };
      allPrivateSiteUserInfoData.push({ ...fixUserInfo(siteUserInfoData), siteUserConfig });
    }
  }

  return allPrivateSiteUserInfoData;
}, []);
const tableSelected = ref<TSiteID[]>([]); // 选中的站点行

const showHistoryDataViewDialog = ref<boolean>(false);
const historyDataViewDialogSiteId = ref<TSiteID | null>(null);
function viewHistoryData(siteId: TSiteID) {
  showHistoryDataViewDialog.value = true;
  historyDataViewDialogSiteId.value = siteId;
}
</script>

<template>
  <v-alert type="info" :title="t('route.Overview.MyData')" />
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-btn
          prepend-icon="mdi-cached"
          color="green"
          :disabled="runtimeStore.userInfo.isFlush || tableSelected.length === 0"
          @click="() => flushSiteLastUserInfo(tableSelected)"
          >{{ t("MyData.index.flushSelectSite") }}
        </v-btn>

        <v-divider vertical class="mx-2" />

        <v-combobox
          multiple
          chips
          v-model="uiStore.tableBehavior.MyData.columns"
          :items="fullTableHeader.map((item) => item.key)"
          max-width="240"
          density="compact"
          hide-details
          class="table-header-filter-clear"
          prepend-inner-icon="mdi-filter-cog"
        >
          <template #chip="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ fullTableHeader.find((x) => x.key == item.title)?.title }}</span>
            </v-chip>
            <span v-if="index === 1" class="text-grey caption">
              (+{{ uiStore.tableBehavior.MyData.columns!.length - 1 }} others)
            </span>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item>
              <v-checkbox
                v-model="uiStore.tableBehavior.MyData.columns"
                density="compact"
                hide-details
                :value="item.title"
                :disabled="fullTableHeader.find((x) => x.key == item.title)?.alwaysShow"
                :label="fullTableHeader.find((x) => x.key == item.title)?.title"
              ></v-checkbox>
            </v-list-item>
          </template>
        </v-combobox>
      </v-row>
    </v-card-title>
    <v-data-table
      v-model="tableSelected"
      :headers="tableHeader"
      :items="tableData"
      item-value="site"
      show-select
      hover
      :sort-by="uiStore.tableBehavior.MyData.sortBy"
    >
      <!-- 站点信息 -->
      <template #item.siteUserConfig.sortIndex="{ item }">
        <div class="d-flex flex-column align-center">
          <SiteFavicon :site-id="item.site" :size="18" />
          <SiteName :site-id="item.site" />
        </div>
      </template>

      <!-- 用户名，用户ID -->
      <template #item.name="{ item }">
        <span :title="item.id" class="text-no-wrap">{{ item.name ?? "-" }}</span>
      </template>

      <!-- 等级信息，升级信息 -->
      <template #item.levelName="{ item }">
        <UserLevelRequirementsTd :user-info="item" />
      </template>

      <!-- 上传、下载 -->
      <template #item.uploaded="{ item }">
        <v-container>
          <v-row justify="end">
            <span class="text-no-wrap">
              {{ typeof item.uploaded !== "undefined" ? formatSize(item.uploaded) : "-" }}
            </span>
            <v-icon small color="green-darken-4" icon="mdi-chevron-up"></v-icon>
          </v-row>
          <v-row justify="end">
            <span class="text-no-wrap">
              {{ typeof item.downloaded !== "undefined" ? formatSize(item.downloaded) : "-" }}
            </span>
            <v-icon small color="red-darken-4" icon="mdi-chevron-down"></v-icon>
          </v-row>
        </v-container>
      </template>

      <!-- 真实上传、下载 -->
      <template #item.trueUploaded="{ item }">
        <v-container>
          <v-row justify="end">
            <span class="text-no-wrap">
              {{ typeof item.trueUploaded !== "undefined" ? formatSize(item.trueUploaded) : "-" }}
            </span>
            <v-icon small color="green-darken-4" icon="mdi-chevron-up"></v-icon>
          </v-row>
          <v-row justify="end">
            <span class="text-no-wrap">
              {{ typeof item.trueDownloaded !== "undefined" ? formatSize(item.trueDownloaded) : "-" }}
            </span>
            <v-icon small color="red-darken-4" icon="mdi-chevron-down"></v-icon>
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

      <!-- TODO 做种数， H&R 情况  -->
      <template #item.seeding="{ item }">
        <span class="text-no-wrap">{{ item.seeding ?? "-" }}</span>
      </template>

      <!-- 做种体积 -->
      <template #item.seedingSize="{ item }">
        <span class="text-no-wrap">
          {{ typeof item.seedingSize !== "undefined" ? formatSize(item.seedingSize) : "-" }}
        </span>
      </template>

      <!-- 魔力/积分 -->
      <template #item.bonus="{ item }">
        <span class="text-no-wrap">{{ typeof item.bonus !== "undefined" ? formatNumber(item.bonus) : "-" }}</span>
      </template>

      <!-- 入站时间 -->
      <template #item.joinTime="{ item }">
        <span class="text-no-wrap">{{ typeof item.joinTime !== "undefined" ? formatDate(item.joinTime) : "-" }}</span>
      </template>

      <!-- 更新时间 -->
      <template #item.updateAt="{ item }">
        {{ item.updateAt ? formatDate(item.updateAt) : "-" }}
      </template>

      <!-- 操作 -->
      <template #item.action="{ item }">
        <v-btn-group variant="text">
          <v-btn
            icon="mdi-view-list"
            color="blue"
            size="small"
            :title="t('MyData.table.action.viewHistoryData')"
            @click="() => viewHistoryData(item.site)"
          >
          </v-btn>
          <v-btn
            icon="mdi-cached"
            color="green"
            size="small"
            :title="t('MyData.table.action.flushData')"
            :loading="runtimeStore.userInfo.flushPlan[item.site]?.isFlush"
            :disabled="runtimeStore.userInfo.flushPlan[item.site]?.isFlush"
            @click="() => flushSiteLastUserInfo([item.site])"
          ></v-btn>
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <HistoryDataViewDialog v-model="showHistoryDataViewDialog" :site-id="historyDataViewDialogSiteId!" />
</template>

<style scoped lang="scss"></style>
