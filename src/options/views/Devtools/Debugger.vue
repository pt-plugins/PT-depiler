<script lang="ts" setup>

import { definitionList } from "@ptpp/site";
import { ref } from "vue";
import { getSiteConfig, getSiteFavicon, getSiteInstance } from "@/shared/adapters/site";

const selectedSite = ref();
const useCustomerConfig = ref(true);

const log = async (v: any) => {
  console.log(await v);
};
</script>


<template>
  <v-alert type="warning" style="margin-bottom: 10px;">
    <v-alert-title>
      调试页面！！！！
    </v-alert-title>
    所有输出均在console面板！！！
  </v-alert>
  <v-card class="mb-2">
    <v-table>
      <tbody>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">
              调试内置站点
            </div>
          </td>
          <td>
            <v-container>
              <v-row dense>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="selectedSite" label="site"
                    :items="definitionList"
                    hide-details
                  />
                </v-col>
                <v-col cols="2">
                  <v-checkbox v-model="useCustomerConfig" label="合并用户配置" hide-details />
                </v-col>
                <v-col class="d-flex justify-space-around align-center">
                  <v-btn
                    :disabled="!selectedSite"
                    @click="() => log(getSiteConfig(selectedSite, useCustomerConfig))"
                  >
                    生成配置信息
                  </v-btn>
                  <v-btn
                    :disabled="!selectedSite"
                    @click="() => log(getSiteInstance(selectedSite, {flush: true, mergeUserConfig: useCustomerConfig}))"
                  >
                    生成站点实例
                  </v-btn>
                  <v-btn
                    :disabled="!selectedSite"
                    @click="() => log(getSiteFavicon(selectedSite, true))"
                  >
                    获取Favicon
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<style scoped>

</style>
