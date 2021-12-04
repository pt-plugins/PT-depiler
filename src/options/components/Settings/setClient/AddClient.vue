<script lang="ts" setup>
import { Ref } from '@vue/reactivity';
import { ref, inject, watch, h, provide } from 'vue';
import { openUrl } from '@/options/utils';
import { REPO_URL, REPO_DEV_BRANCH_URL } from '@/shared/constants';
import {
  HelpSharp,
  NavigateBeforeSharp,
  NavigateNextSharp,
  CheckSharp
} from '@vicons/material';
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import Editor from './Editor.vue';
import { useStore } from '@/options/store';
import { types as btClientTypes, clientTypeList, getClientMetaData, getClientDefaultConfig } from '@/resource/btClients';

const message = useMessage();
const { t } = useI18n();
const store = useStore();

const showAddModal = inject<Ref<Boolean>>('showAddModal')!;
const currentStep = ref(1);

const clientTypeOptions = clientTypeList.filter(x => x !== 'Local').map((x) => ({ label: x, value: x }));

function renderSelectLabel (option: { value: string }) {
  const returnNode = [];
  if (option.value.length > 0) {
    returnNode.push(
      h('img', {
        alt: option.value,
        src: `/assets/btclients/${option.value}.png`,
        style: 'width: 16px; height: 16px'
      })
    );
  }

  returnNode.push(' ', option.value);
  return returnNode;
}

const selectedClientType = ref<string | null>(null);
const selectedClientNotice = ref('');

const selectedClientConfig = inject<Ref>('clientConfig')!;

watch(selectedClientType, async () => {
  if (selectedClientType.value) {
    const metadata = getClientMetaData(selectedClientType.value);
    selectedClientNotice.value = metadata.description || '';
    selectedClientConfig.value = getClientDefaultConfig(selectedClientType.value);
  }
});

function handleMoveToStep2 () {
  if (selectedClientType.value) {
    currentStep.value++;
  } else {
    message.error(t('setClient.add.NoneSelectNotice'));
  }
}

// 当model的可见性发生变化时，清空
watch(showAddModal, () => {
  currentStep.value = 1;
  selectedClientType.value = null;
  selectedClientNotice.value = '';
});

const clientConfig = inject('clientConfig') as Ref<btClientTypes.BittorrentClientBaseConfig>;

function saveClient () {
  store.addClient(clientConfig.value);
  showAddModal.value = false;
}

const canSave = ref(false);
provide('canSave', canSave);

</script>

<template>
  <n-modal v-model:show="showAddModal">
    <n-card
      style="max-width: 800px"
      :title="$t('setClient.add.title')"
      :bordered="false"
      size="huge"
    >
      <template #header-extra>
        <n-button
          quaternary
          circle
          type="error"
          @click="openUrl(`${REPO_URL}/wiki/config-download-client`)"
        >
          <template #icon>
            <n-icon><help-sharp /></n-icon>
          </template>
        </n-button>
      </template>
      <n-space vertical>
        <n-card>
          <n-steps :current="currentStep">
            <n-step :title="$t('setClient.add.step.selectType')" />
            <n-step :title="$t('setClient.add.step.setOptions')" />
          </n-steps>
        </n-card>
        <n-card v-if="currentStep === 1">
          <n-select
            v-model:value="selectedClientType"
            filterable
            :options="clientTypeOptions"
            :placeholder="$t('setClient.add.selectTypePlaceHolder')"
            :render-label="renderSelectLabel"
          />
          <n-text depth="3" v-if="selectedClientNotice.length > 0">
            {{ selectedClientNotice }}
          </n-text>
        </n-card>
        <n-card v-else-if="currentStep === 2">
          <Editor />
        </n-card>
      </n-space>
      <template #footer>
        <n-space :justify="currentStep === 2 ? 'end' : 'space-between'">
          <n-button
            v-if="currentStep === 1"
            quaternary
            type="tertiary"
            @click="openUrl(`${REPO_DEV_BRANCH_URL}`)"
          >
            <template #icon>
              <n-icon><help-sharp /></n-icon>
            </template>
            {{ $t("setClient.add.newType") }}
          </n-button>
          <n-space>
            <n-button
              quaternary
              type="warning"
              @click="currentStep--"
              :disabled="currentStep <= 1"
            >
              <template #icon>
                <n-icon>
                  <navigate-before-sharp />
                </n-icon>
              </template>
              {{ $t("common.dialog.previous") }}
            </n-button>
            <n-button
              v-if="currentStep === 2"
              @click="saveClient"
              :disabled="!canSave"
              quaternary
              type="primary"
              icon-placement="right"
            >
              <template #icon>
                <n-icon>
                  <check-sharp />
                </n-icon>
              </template>
              {{ $t("common.dialog.positive") }}
            </n-button>
            <n-button
              v-else
              quaternary
              type="info"
              icon-placement="right"
              @click="handleMoveToStep2"
            >
              <template #icon>
                <n-icon>
                  <navigate-next-sharp />
                </n-icon>
              </template>
              {{ $t("common.dialog.next") }}
            </n-button>
          </n-space>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped></style>
