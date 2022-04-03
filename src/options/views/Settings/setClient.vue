<script lang="ts" setup>
import { h, ref, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@/options/store';

const { t } = useI18n();
const store = useStore();

const clientConfig = ref<any>({});
provide('clientConfig', clientConfig);

const showAddModal = ref(false);
provide('showAddModal', showAddModal);

const showEditModal = ref(false);
provide('showEditModal', showEditModal);

/*
const setClientColumn = [
  {
    type: 'selection'
  },
  {
    key: 'name',
    title: () => t('setClient.index.tableHeader.name'),
    defaultSortOrder: 'ascend',
    sorter: 'default',
    render (row: { type: string; name: string }) {
      const renderRows = [];
      if (row.type !== 'Local') {
        renderRows.push(
          h('img', { src: `/assets/icons/${row.type}.png`, style: { width: '16px' }, title: `icon-${row.type}` }),
          ' '
        );
      }
      renderRows.push(h(NText, null, { default: () => row.name }));

      return renderRows;
    }
  },
  {
    key: 'type',
    title: () => t('setClient.index.tableHeader.type'),
    filter: true,
    sorter: 'default'
  },
  {
    key: 'address',
    title: () => t('setClient.index.tableHeader.address'),
    sorter: 'default',
    render (row: { address: string }) {
      return h(NA, { target: '_blank' }, { default: () => row.address });
    }
  },
  {
    title: () => t('setClient.index.tableHeader.action'),
    render (row: { id: string }): any[] {
      return [
        h(
          NButton,
          {
            text: true,
            type: 'primary',
            onClick: () => {
              clientConfig.value = row;
              showEditModal.value = true;
            }
          },
          {
            icon: h(NIcon, null, { default: () => h(EditSharp) })
          }
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => {
              return store.removeClient(row.id);
            }
          },
          {
            default: () => t('setClient.index.remove.single'),
            trigger: h(
              NButton,
              {
                text: true,
                type: 'error'
              },
              {
                icon: h(NIcon, null, { default: () => h(DeleteSharp) })
              }
            )
          }
        )
      ];
    }
  }
];

const checkedRowKeysRef = ref<Array<string>>([]);

function deleteMultiClientsDialog () {
  dialog.warning({
    title: t('common.dialog.title.warning'),
    content: t('setClient.index.remove.multi', { count: checkedRowKeysRef.value.length }),
    positiveText: t('common.dialog.positive'),
    negativeText: t('common.dialog.negative'),
    onPositiveClick: () => {
      while (checkedRowKeysRef.value.length > 0) {
        const i = checkedRowKeysRef.value.pop();
        i && store.removeClient(i);
      }
    }
  });
}
*/
</script>

<template>
<div></div>
<!--
  <n-space vertical>
    <n-alert
      type="info"
      :title="$t('route.Settings.setClient')"
    />
    <n-card>
      <n-space vertical>
        <n-grid
          :cols="4"
          item-responsive
          responsive="screen"
        >
          <n-grid-item span="4 m:3">
            <n-space>
              <n-button
                type="primary"
                @click="showAddModal = true"
              >
                <n-icon :size="24">
                  <add-sharp />
                </n-icon>
                {{ $t("setClient.index.btn.add") }}
              </n-button>
              <n-button
                type="error"
                :disabled="checkedRowKeysRef.length === 0"
                @click="deleteMultiClientsDialog"
              >
                <n-icon :size="24">
                  <minus-sharp />
                </n-icon>
                {{ $t("setClient.index.btn.remove") }}
              </n-button>
            </n-space>
          </n-grid-item>
          <n-grid-item span="0 m:1">
            <n-auto-complete>Search</n-auto-complete>
          </n-grid-item>
        </n-grid>

        <n-data-table
          ref="clientTable"
          v-model:checked-row-keys="checkedRowKeysRef"
          :row-key="(row) => row.id"
          :columns="setClientColumn"
          :data="store.options.clients"
          :pagination="{}"
        />
        <n-alert
          v-if="store.options.clients.length === 0"
          :title="$t('setClient.index.emptyNotice')"
        />
      </n-space>
    </n-card>
  </n-space>

  <AddClient />
  <EditClient />
  -->
</template>

<style scoped></style>
