<script lang="ts" setup>
import { ref } from "vue";
import { definitionList } from "@ptd/site";
import { getSiteConfig, getSiteFavicon, getSiteInstance } from "@/shared/adapters/site";

const selectedSite = ref();
const useCustomerConfig = ref(true);

const piniaStoreContent = import.meta.glob<Record<string,Function>>("@/shared/store/*.ts");
const piniaStoreName: Array<{ title: string, value: string }> = Object.keys(piniaStoreContent).map(x => (
  {
    title: x.replace(/^.+\//, "").replace(/\.ts$/, ""),
    value: x
  }
));
const selectedPiniaStore = ref();

async function getPiniaStore(storeName: string) {
  const storeModule = await piniaStoreContent[storeName]();
  const storeFunction = Object.keys(storeModule).filter(f => /use.+Store/.test(f));
  if (storeFunction.length > 0) {
    return storeModule[storeFunction[0]]();
  }
}

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
                <v-col class="d-flex align-center">
                  <v-btn
                    class="mr-2" :disabled="!selectedSite"
                    @click="() => log(getSiteConfig(selectedSite, useCustomerConfig))"
                  >
                    输出配置信息
                  </v-btn>
                  <v-btn
                    class="mr-2" :disabled="!selectedSite"
                    @click="() => log(getSiteInstance(selectedSite, {flush: true, mergeUserConfig: useCustomerConfig}))"
                  >
                    输出站点实例
                  </v-btn>
                  <v-btn
                    class="mr-2" :disabled="!selectedSite"
                    @click="() => log(getSiteFavicon(selectedSite, true))"
                  >
                    输出Favicon
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </td>
        </tr>
        <tr>
          <td>
            <div class="d-flex justify-center align-center text-body-2">
              调试Pinia
            </div>
          </td>
          <td>
            <v-container>
              <v-row dense>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="selectedPiniaStore" label="piniaStore"
                    :items="piniaStoreName"
                    hide-details
                  />
                </v-col>
                <v-col class="d-flex align-center">
                  <v-btn
                    class="mr-2" :disabled="!selectedPiniaStore"
                    @click="() => log(getPiniaStore(selectedPiniaStore))"
                  >
                    输出Pinia信息
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
