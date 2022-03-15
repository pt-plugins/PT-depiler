<script lang="ts" setup>
import { inject } from 'vue';
import { Ref } from '@vue/reactivity';
import Editor from './Editor.vue';
import {
  CancelSharp,
  CheckCircleOutlineSharp
} from '@vicons/material';
import { useStore } from '@/options/store';
import type { BittorrentClientBaseConfig } from '@ptpp/downloader';

const store = useStore();
const showEditModal = inject<Ref<boolean>>('showEditModal')!;
const clientConfig = inject('clientConfig') as Ref<BittorrentClientBaseConfig>;

function patchClient () {
  store.patchClient(clientConfig.value);
  showEditModal.value = false;
}
</script>

<template>
  <n-modal v-model:show="showEditModal">
    <n-card
      style="max-width: 800px;"
      :title="$t('setClient.edit.title')"
      :bordered="false"
      size="huge"
    >
      <n-card>
        <Editor />
      </n-card>
      <template #footer>
        <n-space justify="end">
          <n-button
            quaternary
            type="warning"
            @click="showEditModal = false"
          >
            <template #icon>
              <n-icon>
                <cancel-sharp />
              </n-icon>
            </template>
            {{ $t("common.dialog.negative") }}
          </n-button>
          <n-button
            quaternary
            type="primary"
            @click="patchClient"
          >
            <template #icon>
              <n-icon>
                <check-circle-outline-sharp />
              </n-icon>
            </template>
            {{ $t("common.dialog.positive") }}
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>
