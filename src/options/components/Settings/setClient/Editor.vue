<script lang="ts" setup>
import { Ref } from "@vue/reactivity";
import { inject, ref } from "vue";
import { BittorrentClientBaseConfig, getDownloader } from "@ptpp/downloader";
import { useMessage } from "naive-ui";

const message = useMessage();
const clientConfig = inject<Ref<BittorrentClientBaseConfig>>("clientConfig")!;
const canSave = inject<Ref<boolean>>("canSave");

enum connectStatus {
  success,
  default,
  checking,
  failed,
}

const connectStatusRef = ref<connectStatus>(connectStatus.default);

async function checkConnect () {
  canSave && (canSave.value = true);
  connectStatusRef.value = connectStatus.checking;
  const client = await getDownloader(clientConfig.value);
  try {
    connectStatusRef.value = (await client.ping()) ? connectStatus.success : connectStatus.failed;
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
    <n-form-item
      path="name"
      :label="$t('setClient.editor.serverName')"
    >
      <n-input
        v-model:value="clientConfig.name"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item
      path="address"
      :label="$t('setClient.editor.serverAddress')"
    >
      <n-input
        v-model:value="clientConfig.address"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item
      v-if="typeof clientConfig.username !== 'undefined'"
      path="username"
      :label="$t('setClient.editor.username')"
    >
      <n-input
        v-model:value="clientConfig.username"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item
      path="password"
      :label="$t('setClient.editor.password')"
    >
      <n-input
        v-model:value="clientConfig.password"
        type="password"
        show-password-on="click"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item
      path="type"
      :label="$t('setClient.editor.type')"
    >
      <n-input
        v-model:value="clientConfig.type"
        disabled
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item
      path="uuid"
      label="ID"
    >
      <n-input
        v-model:value="clientConfig.id"
        disabled
        :placeholder="$t('setClient.editor.idPlaceholder')"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item>
      <n-button
        secondary
        :type="
          connectStatusRef === connectStatus.success
            ? 'success'
            : connectStatusRef === connectStatus.failed
              ? 'error'
              : 'info'
        "
        :loading="connectStatusRef === connectStatus.checking"
        style="width: 100%"
        @click="checkConnect"
      >
        {{
          connectStatusRef === connectStatus.success
            ? $t('setClient.editor.connect.success')
            : connectStatusRef === connectStatus.failed
              ? $t('setClient.editor.connect.fail')
              : $t('setClient.editor.checkConnect')
        }}
      </n-button>
    </n-form-item>
  </n-form>
</template>

<style scoped></style>
