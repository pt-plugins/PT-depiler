<script setup lang="ts">
import { useConfigStore } from "@/options/stores/config.ts";

const configStore = useConfigStore();
</script>

<template>
  <v-row>
    <v-col md="6">
      <v-label>基本配置</v-label>
      <v-text-field v-model="configStore.backup.encryptionKey" :label="`备份文件加密、解密密钥`" />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
