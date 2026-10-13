<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref, shallowRef, watch } from "vue";
import { EResultParseStatus, ISiteUserConfig, TSiteID } from "@ptd/site";
import type { ISiteMetadataIndexEntry } from "@ptd/site/metadataIndex";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useResetableRef } from "@/options/directives/useResetableRef.ts";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import CheckSwitchButton from "@/options/components/CheckSwitchButton.vue";

import { getCanAddedSiteIndexEntries } from "./utils.ts";

const showDialog = defineModel<boolean>();

interface IImportStatus {
  isWorking: boolean;
  toWork: TSiteID[];
  working: TSiteID;
  success: TSiteID[];
  failed: TSiteID[];
}

const { ref: importStatus, reset: resetImportStatus } = useResetableRef<IImportStatus>(() => ({
  isWorking: false,
  toWork: [],
  working: "",
  success: [],
  failed: [],
}));

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

// 待添加的站点列表：数据来自构建期轻量索引（见 utils.ts），一次同步取全，不需要渐进加载
const canAddSites = shallowRef<ISiteMetadataIndexEntry[]>([]);

// 卡片高度（两行 v-list-item + 边框），供 v-lazy 占位使用，避免懒加载过程中滚动条来回抖动
const SITE_CARD_MIN_HEIGHT = 72;

const siteMetadataById = computed(
  () => new Map<TSiteID, ISiteMetadataIndexEntry>(canAddSites.value.map((site) => [site.id, site])),
);

// 是否把 public 站点也列出来（public 站点不经过搜索校验就会被直接添加，所以默认不列）
const includePublicSite = ref<boolean>(false);

// 开关直接决定列表里有没有 public 站点的卡片：不显示即不参与「全选」，也不参与导入
const displayedSites = computed(() =>
  includePublicSite.value ? canAddSites.value : canAddSites.value.filter((site) => site.type === "private"),
);

// 供开关的 label 显示，否则这类站点被默认藏起来后完全看不出存在
const publicSiteCount = computed(() => canAddSites.value.filter((site) => site.type === "public").length);

watch(includePublicSite, (include) => {
  if (include) return;
  // 关掉开关后 public 卡片会消失，已选中的也要一并移出「已选择」，避免看不见却被导入
  importStatus.value.toWork = importStatus.value.toWork.filter(
    (siteId) => siteMetadataById.value.get(siteId)?.type !== "public",
  );
});

// 把 3 个数组换成 3 个 Set：模板里每张卡片都要查「是否已选中/已成功/已失败」，
// 用 Array.includes 是 O(n)，300+ 张卡片 × 每次状态变化会被重复扫描很多遍
const toWorkSiteIds = computed(() => new Set(importStatus.value.toWork));
const successSiteIds = computed(() => new Set(importStatus.value.success));
const failedSiteIds = computed(() => new Set(importStatus.value.failed));

// 「全选」的可选范围：当前列出的站点里，不需要手动录入、也还没导入成功的那些
const selectableSiteIds = computed(() =>
  displayedSites.value
    .filter((site) => !site.hasUserInputSettingMeta && !successSiteIds.value.has(site.id))
    .map((site) => site.id),
);

// 普通函数即可：模板渲染函数会读取 importStatus/这些 Set，依赖收集照旧；
// 原来写成 computed 会在每次渲染时给每个站点新建一个 computed 再丢掉
function statusIconProp(site: ISiteMetadataIndexEntry) {
  let progressIcon = "progress-helper"; // 默认
  let progressColor = "grey";
  let progressTitle = "";
  if (site.hasUserInputSettingMeta) {
    progressIcon = "progress-close"; // 需要手动添加
    progressColor = "purple";
    progressTitle = t("SetSite.oneClickImportDialog.status.manual");
  } else if (importStatus.value.working === site.id) {
    progressIcon = "progress-wrench"; // 正在尝试中
    progressColor = "blue";
    progressTitle = t("SetSite.oneClickImportDialog.status.trying");
  } else if (successSiteIds.value.has(site.id)) {
    progressIcon = "progress-check"; // 已添加成功
    progressColor = "green";
    progressTitle = t("SetSite.oneClickImportDialog.status.success");
  } else if (failedSiteIds.value.has(site.id)) {
    progressIcon = "progress-alert"; // 添加失败
    progressColor = "red";
    progressTitle = t("SetSite.oneClickImportDialog.status.failed");
  } else if (toWorkSiteIds.value.has(site.id)) {
    progressIcon = "progress-pencil"; // 已选择
    progressColor = "";
    progressTitle = t("SetSite.oneClickImportDialog.status.selected");
  }

  return {
    icon: `mdi-${progressIcon}`,
    color: progressColor,
    title: progressTitle,
  };
}

async function doAutoImport() {
  importStatus.value.isWorking = true;
  importStatus.value.failed = [];

  // 遍历所有需要添加的站点，在遍历过程中我们不更新 siteHostMap 和 siteNameMap
  for (const site of importStatus.value.toWork) {
    if (successSiteIds.value.has(site)) {
      continue; // 如果已经添加成功，则跳过
    }

    importStatus.value.working = site;

    try {
      let isThisSiteSuccess = false;

      // 索引条目里已经有 type 与 urls（导入本身由 offscreen 用完整定义去做）
      const siteMetadata = siteMetadataById.value.get(site) as ISiteMetadataIndexEntry;
      const siteUserConfig = (await metadataStore.getSiteUserConfig(site, true)) as ISiteUserConfig;

      // 对于 public 站点，不需要额外测试是否能够搜索
      if (siteMetadata.type === "public") {
        // 直接将该站点设置存入 metadataStore
        await metadataStore.addSite(site, siteUserConfig, { reBuildMap: false }); // 抑制 site{Name, Host}Map 更新
        isThisSiteSuccess = true;
      } else {
        // 遍历所有 private site 预设的 urls ，找到用户实际使用的 url
        for (const siteUrl of siteMetadata.urls) {
          siteUserConfig.url = siteUrl;
          // 临时将该设置存入 metadataStore
          await metadataStore.addSite(site, siteUserConfig, { reBuildMap: false });
          const { status: testStatus } = await sendMessage("getSiteSearchResult", { siteId: site });
          if (testStatus === EResultParseStatus.success) {
            isThisSiteSuccess = true; // 如果搜索成功，说明该站点可以自动添加
            break;
          }
        }
      }

      if (isThisSiteSuccess) {
        importStatus.value.success.push(site);
      } else {
        importStatus.value.failed.push(site);
        // 如果搜索失败，说明该站点不能自动添加，移除在 metadataStore 中临时添加的配置项
        await metadataStore.removeSite(site, { reBuildMap: false });
      }
    } catch (e) {
      importStatus.value.failed.push(site);
    }
  }

  importStatus.value.working = "";
  importStatus.value.isWorking = false;
  importStatus.value.toWork = [];

  // 所有导入完成，重构 site{Host, Name}Map
  await metadataStore.buildSiteMapCache(true);

  runtimeStore.showSnakebar(
    t("SetSite.oneClickImportDialog.importComplete", { count: importStatus.value.success.length }),
    { color: "success" },
  );
}

function dialogEnter() {
  resetImportStatus(); // 重置状态
  includePublicSite.value = false;
  // 轻量索引是一次同步取全的，所以这里不再需要「边读边渲染」那套（分批刷入 / token 作废）
  canAddSites.value = getCanAddedSiteIndexEntries().filter((site) => !site.isDead); // 已离线的站点不参与导入
}
</script>

<template>
  <v-dialog
    v-model="showDialog"
    max-width="1000"
    scrollable
    @after-enter="dialogEnter"
    :persistent="importStatus.isWorking"
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("SetSite.oneClickImportDialog.title") }}</v-toolbar-title>
          <template #append>
            <v-btn
              icon="mdi-close"
              :title="t('common.dialog.close')"
              @click="showDialog = false"
              :disabled="importStatus.isWorking"
            />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-alert class="mb-2" :title="t('SetSite.oneClickImportDialog.alert1')" type="warning" variant="tonal">
        </v-alert>

        <v-alert class="mb-1 py-2" :title="t('SetSite.oneClickImportDialog.alert2')">
          <template #text>
            {{
              t("SetSite.oneClickImportDialog.stats", {
                count: importStatus.toWork.length,
                success: importStatus.success.length,
                failed: importStatus.failed.length,
              })
            }}
            <span v-if="importStatus.isWorking">
              {{ t("SetSite.oneClickImportDialog.trying", { name: siteMetadataById.get(importStatus.working)?.name }) }}
            </span>
          </template>
          <template #append>
            <v-switch
              v-model="includePublicSite"
              :disabled="importStatus.isWorking"
              :label="t('SetSite.oneClickImportDialog.includePublicSite', { count: publicSiteCount })"
              :title="t('SetSite.oneClickImportDialog.includePublicSiteHint')"
              class="flex-grow-0 mr-2"
              color="blue-lighten-1"
              density="compact"
              hide-details
            />
            <CheckSwitchButton
              v-model="importStatus.toWork"
              :all="selectableSiteIds"
              :size="undefined"
              color="blue-lighten-1"
              variant="tonal"
            />
          </template>
        </v-alert>

        <v-skeleton-loader v-if="!displayedSites.length" type="image"> </v-skeleton-loader>
        <v-list v-else class="overflow-x-hidden overflow-y-hidden px-3 pt-3">
          <!-- Vuetify 4 的 v-row 默认 gap 为 24px，站点卡片间距由 v-col 的 pa-1 控制，需显式 gap="0" -->
          <v-row gap="0">
            <v-col v-for="site in displayedSites" :key="site.id" cols="12" md="4" sm="6" class="pa-1">
              <!-- 300+ 张卡片一次性挂载，会连带触发 300+ 次 favicon 查询（未添加的站点基本都没缓存，
                   会真的去请求站点首页抓 icon），所以只在卡片进入视口后才渲染 -->
              <v-lazy :min-height="SITE_CARD_MIN_HEIGHT">
                <v-list-item border class="bg-grey-lighten-4">
                  <template #prepend>
                    <v-checkbox
                      v-model="importStatus.toWork"
                      :indeterminate="!!site.hasUserInputSettingMeta || successSiteIds.has(site.id)"
                      :indeterminate-icon="successSiteIds.has(site.id) ? 'mdi-check' : 'mdi-close'"
                      :disabled="
                        !!site.hasUserInputSettingMeta || importStatus.isWorking || successSiteIds.has(site.id)
                      "
                      :value="site.id"
                      hide-details
                      multiple
                    />
                    <SiteFavicon :site-id="site.id" class="mr-2" flush-on-click />
                  </template>

                  <template #title>
                    <v-list-item-title>
                      <b>{{ site.name ?? "" }}</b>
                      <!-- 站点类型 -->
                    </v-list-item-title>
                  </template>

                  <template #subtitle>
                    <v-chip :color="site.type === 'private' ? 'primary' : 'secondary'" label size="x-small">
                      {{ site.schema ?? (site.type === "private" ? "AbstractPrivateSite" : "AbstractBittorrentSite") }}
                    </v-chip>
                  </template>

                  <template #append>
                    <v-list-item-action>
                      <a :href="site.urls[0]" target="_blank" rel="noopener noreferrer nofollow">
                        <v-icon v-bind="statusIconProp(site)" class="mr-2" size="x-large"></v-icon>
                      </a>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-lazy>
            </v-col>
          </v-row>
        </v-list>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="importStatus.isWorking"
          color="error"
          prepend-icon="mdi-close-circle"
          variant="text"
          @click="showDialog = false"
        >
          {{ t("common.dialog.cancel") }}
        </v-btn>

        <v-btn
          :disabled="importStatus.isWorking"
          color="success"
          prepend-icon="mdi-import"
          variant="text"
          @click="doAutoImport"
        >
          {{ t("common.import") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
