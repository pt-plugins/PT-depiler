<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { supportTheme } from "@/shared/types.ts";
import { definedLangMetaData } from "@/options/plugins/i18n.ts";

import { useConfigStore } from "@/options/stores/config.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { isEmpty } from "es-toolkit/compat";

const { t } = useI18n();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

function initContentScriptExceptionSites() {
  Object.keys(metadataStore.sites).forEach((site) => {
    if (typeof metadataStore.sites[site].allowContentScript === "undefined") {
      metadataStore.sites[site].allowContentScript = true;
    }
  });
  metadataStore.$save();
}

function beforeSave() {
  // 对从低版本升级上来的用户，在启用例外站点时，补全缺失选项
  if (
    configStore.contentScript.enabled &&
    configStore.contentScript.allowExceptionSites &&
    !isEmpty(metadataStore.sites)
  ) {
    initContentScriptExceptionSites();
  }
}

defineExpose({
  beforeSave,
});
</script>

<template>
  <v-row>
    <v-col md="10" lg="8">
      <!-- 插件语言设置 -->
      <v-select v-model="configStore.lang" :label="t('SetBase.ui.changeLanguage')" :items="definedLangMetaData" />

      <!-- 明亮模式设置 -->
      <v-select v-model="configStore.theme" :label="t('SetBase.ui.displayMode.index')" :items="supportTheme">
        <template #selection="{ item }">
          {{ t("SetBase.ui.displayMode." + item.raw) }}
        </template>

        <template #item="{ item, props }">
          <v-list-item v-bind="props" :title="t('SetBase.ui.displayMode.' + item.raw)" />
        </template>
      </v-select>

      <v-switch
        v-model="configStore.showReleaseNoteOnVersionChange"
        color="success"
        hide-details
        label="插件更新时显示更新日志窗口"
      />

      <v-switch
        v-model="configStore.saveTableBehavior"
        color="success"
        hide-details
        label="记忆部分表格的 表头列展示、排序、分页 等信息"
      />

      <v-switch
        v-model="configStore.enableTableMultiSort"
        color="success"
        hide-details
        label="启用部分表格的多列排序功能"
      >
        <template #append>
          <v-tooltip max-width="400" location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon color="info" icon="mdi-help-circle" v-bind="props" />
            </template>
            {{ t("SetBase.ui.tableMultiSortNote") }}
          </v-tooltip>
        </template>
      </v-switch>

      <v-divider />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="10" lg="8">
      <div class="d-flex align-center">
        <v-label>内容脚本（站点侧边栏等）</v-label>
        <v-spacer />
        <v-switch v-model="configStore.contentScript.enabled" color="success" hide-details label="启用" />
      </div>

      <template v-if="configStore.contentScript.enabled">
        <v-alert type="warning" variant="tonal"> 启用或禁用相关功能后需要保存设置，并刷新站点页面才能生效。 </v-alert>

        <v-row dense>
          <v-col cols="12" md="2" class="d-flex align-center justify-center">
            <v-label>基本设置</v-label>
          </v-col>
          <v-col>
            <v-switch
              v-model="configStore.contentScript.allowExceptionSites"
              color="success"
              hide-details
              label="允许设置不启用侧边栏的例外站点（启用后需在站点设置中对应关闭）"
            />

            <v-switch
              v-model="configStore.contentScript.enabledAtSocialSite"
              color="success"
              hide-details
              label="在社交站点（如豆瓣、IMDb）启用侧边栏"
            />

            <v-divider />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="2" class="d-flex align-center justify-center">
            <v-label>侧边栏样式</v-label>
          </v-col>
          <v-col>
            <v-switch
              v-model="configStore.contentScript.applyTheme"
              color="success"
              hide-details
              :label="`响应插件设置中的 ` + t('SetBase.ui.displayMode.index')"
            />

            <v-switch
              v-model="configStore.contentScript.defaultOpenSpeedDial"
              color="success"
              hide-details
              label="默认展开侧边栏按钮"
            />
            <v-switch
              v-model="configStore.contentScript.stackedButtons"
              color="success"
              hide-details
              label="使用大图标按键"
            />
            <v-switch
              v-model="configStore.contentScript.fadeEnterStyle"
              color="success"
              hide-details
              label="启用淡入效果（即默认半透明，当鼠标移入时显示）"
            />
            <v-divider />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="2" class="d-flex align-center justify-center">
            <v-label>侧边栏功能</v-label>
          </v-col>
          <v-col>
            <v-switch
              v-model="configStore.contentScript.doubleConfirmAction"
              color="success"
              hide-details
              label="对种子列表页批量复制、本地下载等操作需要二步确认"
            />

            <v-switch
              v-model="configStore.contentScript.dragLinkOnSpeedDial"
              color="success"
              hide-details
              label="允许拖拽链接到侧边栏按钮"
            >
              <template #append>
                <v-tooltip max-width="400" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-icon color="info" icon="mdi-help-circle" v-bind="props" />
                  </template>
                  拖拽时的下载链接不一定能被正确识别！
                </v-tooltip>
              </template>
            </v-switch>

            <v-select
              v-model="configStore.contentScript.socialSiteSearchBy"
              :disabled="!configStore.contentScript.enabledAtSocialSite"
              :items="['id', 'title', 'imdb', 'chosen']"
              :item-title="(item) => t('SetBase.ui.socialSiteSearchBy.' + item)"
              :item-value="(item) => item"
              label="社交站点搜索方式"
            />
          </v-col>
        </v-row>
      </template>

      <v-divider />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="10" lg="8">
      <div class="d-flex align-center">
        <v-label>右键菜单</v-label>
        <v-spacer />
        <v-switch v-model="configStore.contextMenus.enabled" color="success" hide-details label="启用" />
      </div>

      <template v-if="configStore.contextMenus.enabled">
        <v-switch
          v-model="configStore.contextMenus.allowSelectionTextSearch"
          color="success"
          hide-details
          label="启用选中文字搜索"
        />

        <v-switch
          v-model="configStore.contextMenus.allowLinkDownloadPush"
          :disabled="metadataStore.getEnabledDownloaders.length === 0"
          color="success"
          hide-details
          label="启用（下载）链接推送"
        />
      </template>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
