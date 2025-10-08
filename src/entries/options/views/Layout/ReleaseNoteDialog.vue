<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "@/options/stores/config.ts";
import { REPO_URL } from "~/helper.ts";

const showDialog = defineModel<boolean>();
const configStore = useConfigStore();
const { t } = useI18n();

interface ParsedVersion {
  versionNumbers: number[]; // 版本号数字部分
  buildHash: string; // 构建哈希值
  fullVersion: string; // 完整版本字符串
}

function parseVersion(versionString: string): ParsedVersion {
  const versionPart = versionString.slice(1); // 移除前缀 v 后的部分
  const [mainVersion, buildHash = ""] = versionPart.split("+"); // 分割版本号和构建哈希

  // 解析版本号数字部分
  const versionNumbers = mainVersion
    .split(".")
    .map((numStr) => parseInt(numStr, 10))
    .filter((num) => !isNaN(num));

  return {
    versionNumbers,
    buildHash,
    fullVersion: versionString,
  };
}

const storeVersion = parseVersion(configStore.version);
const currentVersion = parseVersion(__EXT_VERSION__);
const failbackVersion = parseVersion("v0.0.5.1147+23f758f7"); // 这个版本号为引入更新窗口时间点前的发布送审版本号
const storeBuildHash = computed<string>(() => storeVersion.buildHash || failbackVersion.buildHash);

// const isFirstInstall = computed<boolean>(() => configStore.version === "");

function dialogLeave() {
  configStore.version = __EXT_VERSION__;
  configStore.$save();
}
</script>

<template>
  <v-dialog v-model="showDialog" eager persistent width="600" @after-leave="dialogLeave">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 欢迎使用 {{ t("manifest.extName") }} </v-toolbar-title>
        </v-toolbar>
      </v-card-title>

      <v-card-text class="text-center d-flex">
        <v-container class="pa-0">
          <v-row>
            <v-col>
              <v-img inline src="/icons/logo/128.png" width="128"></v-img>
              <br />
              <div class="d-inline-flex">
                <span class="text-body-1 text--secondary">{{ currentVersion.fullVersion }}（当前版本）</span>&nbsp;
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="text-body-1">
                <a :href="`${REPO_URL}/compare/${storeBuildHash}...${currentVersion.buildHash}`" target="_blank">
                  更新日志
                </a>
                <v-divider vertical class="mx-2" />
                <a :href="`${REPO_URL}/releases`" target="_blank">Wiki 帮助</a>
                <v-divider vertical class="mx-2" />
                <a :href="`${REPO_URL}/discussions/316`" target="_blank">常见问题</a>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn block variant="elevated" color="green" @click="showDialog = false">开始使用</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
