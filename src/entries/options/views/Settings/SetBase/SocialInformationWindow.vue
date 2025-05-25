<script setup lang="ts">
import { buildInPtGenApi } from "@ptd/social";

import { useConfigStore } from "@/options/stores/config.ts";

const configStore = useConfigStore();
</script>

<template>
  <v-row>
    <v-col md="6">
      <v-label>基本配置</v-label>
      <v-number-input
        v-model="configStore.socialSiteInformation.cacheDay"
        :label="`缓存有效期（天）`"
        :min="3"
        messages="缓存时间过短会导致频繁请求，过长会导致数据不及时"
      />
      <v-number-input v-model="configStore.socialSiteInformation.timeout" :label="`请求超时时间 (毫秒)`" hide-details />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="6">
      <v-label>PtGen 配置</v-label>
      <v-switch
        v-model="configStore.socialSiteInformation.preferPtGen"
        :label="`优先使用 PtGen 提供的数据`"
        color="success"
        hide-details
      />
      <v-combobox
        v-if="configStore.socialSiteInformation.preferPtGen"
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

  <v-row>
    <v-col md="6">
      <v-label>各媒体评分站点配置</v-label>
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
</template>

<style scoped lang="scss"></style>
