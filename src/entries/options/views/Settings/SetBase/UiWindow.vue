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
        :label="t('SetBase.ui.showReleaseNote')"
      />

      <v-switch
        v-model="configStore.saveTableBehavior"
        color="success"
        hide-details
        :label="t('SetBase.ui.saveTableBehavior')"
      />

      <v-switch
        v-model="configStore.enableTableMultiSort"
        color="success"
        hide-details
        :label="t('SetBase.ui.enableTableMultiSort')"
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
        <v-label>{{ t("SetBase.ui.contentScript") }}</v-label>
        <v-spacer />
        <v-switch
          v-model="configStore.contentScript.enabled"
          color="success"
          hide-details
          :label="t('common.enable')"
        />
      </div>

      <template v-if="configStore.contentScript.enabled">
        <v-alert type="warning" variant="tonal"> {{ t("SetBase.ui.contentScriptWarning") }} </v-alert>

        <v-row dense>
          <v-col cols="12" md="2" class="d-flex align-center justify-center">
            <v-label>{{ t("SetBase.ui.basicSettings") }}</v-label>
          </v-col>
          <v-col>
            <v-switch
              v-model="configStore.contentScript.allowExceptionSites"
              color="success"
              hide-details
              :label="t('SetBase.ui.allowExceptionSites')"
            />

            <v-switch
              v-model="configStore.contentScript.enabledAtSocialSite"
              color="success"
              hide-details
              :label="t('SetBase.ui.enableOnSocialSite')"
            />

            <v-divider />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="2" class="d-flex align-center justify-center">
            <v-label>{{ t("SetBase.ui.sidebarStyle") }}</v-label>
          </v-col>
          <v-col>
            <v-switch
              v-model="configStore.contentScript.applyTheme"
              color="success"
              hide-details
              :label="`${t('SetBase.ui.respondDisplayMode')}` + t('SetBase.ui.displayMode.index')"
            />

            <v-switch
              v-model="configStore.contentScript.defaultOpenSpeedDial"
              color="success"
              hide-details
              :label="t('SetBase.ui.expandByDefault')"
            />
            <v-switch
              v-model="configStore.contentScript.stackedButtons"
              color="success"
              hide-details
              :label="t('SetBase.ui.useLargeIcon')"
            />
            <v-switch
              v-model="configStore.contentScript.fadeEnterStyle"
              color="success"
              hide-details
              :label="t('SetBase.ui.enableFadeEffect')"
            />
            <v-divider />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="2" class="d-flex align-center justify-center">
            <v-label>{{ t("SetBase.ui.sidebarFunctions") }}</v-label>
          </v-col>
          <v-col>
            <v-switch
              v-model="configStore.contentScript.doubleConfirmAction"
              color="success"
              hide-details
              :label="t('SetBase.ui.confirmTwoStep')"
            />

            <v-switch
              v-model="configStore.contentScript.dragLinkOnSpeedDial"
              color="success"
              hide-details
              :label="t('SetBase.ui.allowDragLink')"
            >
              <template #append>
                <v-tooltip max-width="400" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-icon color="info" icon="mdi-help-circle" v-bind="props" />
                  </template>
                  {{ t("SetBase.ui.dragNote") }}
                </v-tooltip>
              </template>
            </v-switch>

            <v-select
              v-model="configStore.contentScript.socialSiteSearchBy"
              :disabled="!configStore.contentScript.enabledAtSocialSite"
              :items="['id', 'title', 'imdb', 'chosen']"
              :item-title="(item) => t('SetBase.ui.socialSiteSearchBy.' + item)"
              :item-value="(item) => item"
              :label="t('SetBase.ui.socialSiteSearchLabel')"
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
        <v-label>{{ t("SetBase.ui.contextMenu") }}</v-label>
        <v-spacer />
        <v-switch v-model="configStore.contextMenus.enabled" color="success" hide-details :label="t('common.enable')" />
      </div>

      <template v-if="configStore.contextMenus.enabled">
        <v-switch
          v-model="configStore.contextMenus.allowSelectionTextSearch"
          color="success"
          hide-details
          :label="t('SetBase.ui.contextMenuTextSearch')"
        />

        <v-switch
          v-model="configStore.contextMenus.allowSocialLinkSearch"
          color="success"
          hide-details
          :label="t('SetBase.ui.contextMenuSocialSearch')"
        />

        <v-switch
          v-model="configStore.contextMenus.allowLinkDownloadPush"
          :disabled="metadataStore.getEnabledDownloaders.length === 0"
          color="success"
          hide-details
          :label="t('SetBase.ui.contextMenuLinkPush')"
        />
      </template>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
