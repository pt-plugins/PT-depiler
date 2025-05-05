<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { buildInPtGenApi } from "@ptd/social";

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();

async function save() {
  await configStore.$save();
  runtimeStore.showSnakebar("保存成功", { color: "success" });
}
</script>

<template>
  <v-card>
    <v-card-text>
      <v-label class="my-2">基本配置</v-label>

      <v-row>
        <v-col md="6">
          <v-number-input
            v-model="configStore.socialSiteInformation.cacheDay"
            :label="`缓存有效期（天）`"
            :min="3"
            messages="缓存时间过短会导致频繁请求，过长会导致数据不及时"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6">
          <v-number-input v-model="configStore.socialSiteInformation.timeout" :label="`请求超时时间 (毫秒)`" />
        </v-col>
      </v-row>

      <v-label class="my-2">PtGen 配置</v-label>
      <v-row>
        <v-col md="6">
          <v-switch
            v-model="configStore.socialSiteInformation.preferPtGen"
            :label="`优先使用 PtGen 提供的数据`"
            color="success"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row v-if="configStore.socialSiteInformation.preferPtGen">
        <v-col md="6">
          <v-combobox
            v-model="configStore.socialSiteInformation.ptGenEndpoint"
            :items="buildInPtGenApi"
            :return-object="false"
            item-title="provider"
            item-value="url"
            label="PtGen API 地址"
            messages="选择内置地址或输入类似 https://example.com/ptgen?site=<site>&sid=<sid> 的地址"
          />
        </v-col>
      </v-row>

      <v-label class="my-2">各媒体评分站点配置</v-label>

      <v-row>
        <v-col md="6">
          <v-text-field
            v-model="configStore.socialSiteInformation.socialSite!.anidb.client"
            :label="`AniDB Client ID`"
            clearable
            messages="请在 https://anidb.net/perl-bin/animedb.pl?show=client 中申请 Client ID， 并按照 `Name/Version` 的格式填写"
          >
            <template #prepend>
              <v-avatar image="/icons/social/anidb.png" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6">
          <v-text-field
            v-model="configStore.socialSiteInformation.socialSite!.bangumi.apikey"
            :label="`Bangumi API Key`"
            clearable
            messages="你可以在 https://next.bgm.tv/demo/access-token 生成一个 Access Token"
          >
            <template #prepend>
              <v-avatar image="/icons/social/bangumi.png" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-row class="ml-2 my-1">
        <v-btn color="green" prepend-icon="mdi-check-circle-outline" variant="elevated" @click="save">
          {{ t("common.save") }}
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss"></style>
