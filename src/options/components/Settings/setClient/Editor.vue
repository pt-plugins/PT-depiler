<script lang="ts" setup>
import { Ref } from '@vue/reactivity';
import { inject, ref } from 'vue';
import { BittorrentClientBaseConfig } from '@/resource/btClients/types';
import btClients from '@/background/factory/btClients';
import { useMessage } from 'naive-ui';

const message = useMessage();
const clientConfig = inject('clientConfig') as Ref<BittorrentClientBaseConfig>;

enum connectStatus {
  success, default, checking, failed
}
const connectStatusRef = ref<connectStatus>(connectStatus.default);

async function checkConnect () {
  connectStatusRef.value = connectStatus.checking;
  const client = await btClients.getClient(clientConfig.value);
  try {
    connectStatusRef.value = await client.ping() ? connectStatus.success : connectStatus.failed;
  } catch (e) {
    connectStatusRef.value = connectStatus.failed;
  }

  if (connectStatusRef.value === connectStatus.failed) {
    message.error("can't connect");
  }
}

</script>

<template>
  <n-form :model="clientConfig">
    <n-form-item path="name" :label="$t('setClient.editor.serverName')">
      <n-input v-model:value="clientConfig.name" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="address" :label="$t('setClient.editor.serverAddress')">
      <n-input v-model:value="clientConfig.address" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="username" :label="$t('setClient.editor.username')" v-if="typeof clientConfig.username !== 'undefined'">
      <n-input v-model:value="clientConfig.username" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="password" :label="$t('setClient.editor.password')">
      <n-input v-model:value="clientConfig.password" type="password" show-password-on="click" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="type" :label="$t('setClient.editor.type')">
      <n-input v-model:value="clientConfig.type" disabled @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="uuid" label="ID">
      <n-input v-model:value="clientConfig.uuid" disabled @keydown.enter.prevent />
    </n-form-item>
    <n-form-item>
      <n-button secondary :type="connectStatusRef === -1 ? 'error' : 'info'" :loading="connectStatusRef === 0" style="width: 100%" @click="checkConnect">Info</n-button>
    </n-form-item>
  </n-form>
</template>

<style scoped>

</style>
