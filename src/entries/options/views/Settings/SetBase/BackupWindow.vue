<script setup lang="ts">
import { nanoid } from "nanoid";
import { useConfigStore } from "@/options/stores/config.ts";

const configStore = useConfigStore();

function randomEncryptionKey() {
  if (configStore.backup.encryptionKey !== "" && confirm("重置密钥？")) {
    configStore.backup.encryptionKey = nanoid();
  }
}
</script>

<template>
  <v-row>
    <v-col md="6">
      <v-label>基本配置</v-label>
      <v-text-field
        v-model="configStore.backup.encryptionKey"
        :label="`备份文件加密、解密密钥`"
        :messages="`请妥善保存`"
        append-icon="mdi-key"
        @click:append="() => randomEncryptionKey()"
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
