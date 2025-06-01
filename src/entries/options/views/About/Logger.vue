<script setup lang="ts">
import { onMounted, shallowRef, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { sendMessage } from "@/messages.ts";
import { ILoggerItem } from "@/shared/types.ts";
import { formatDate } from "@/options/utils.ts";

const { t } = useI18n();
const logger = shallowRef<ILoggerItem[]>([]);

const tableHeader = [
  { title: "ID", value: "id", width: 150 },
  { title: "Time", value: "time", width: 100 },
  { title: "Message", value: "msg" },
  { title: t("common.action"), value: "action", width: 150 },
] as DataTableHeader[];

const showLogDataDialog = ref<boolean>(false);
const logData = ref<ILoggerItem | null>(null);

function showLogDataDialogHandler(item: ILoggerItem) {
  logData.value = item;
  showLogDataDialog.value = true;
}

function loadLogger() {
  sendMessage("getLogger", undefined).then((res) => {
    logger.value = res;
  });
}

onMounted(() => {
  setInterval(() => loadLogger(), 1000);
});
</script>

<template>
  <v-alert :title="t('route.About.Logger')" type="info" />

  <v-data-table
    :headers="tableHeader"
    :items="logger"
    :sort-by="[{ key: 'time', order: 'desc' }]"
    class="table-stripe table-header-no-wrap"
    hover
    must-sort
  >
    <template #item.id="{ item }">
      <code class="text-no-wrap">{{ item.id }}</code>
    </template>

    <template #item.time="{ item }">
      <span class="text-no-wrap">{{ formatDate(item.time!) }}</span>
    </template>

    <template #item.action="{ item }">
      <v-btn-group class="table-action" density="compact" variant="plain">
        <v-btn
          :disabled="typeof item.data === 'undefined'"
          color="info"
          size="small"
          icon="mdi-archive-search"
          @click="showLogDataDialogHandler(item.data)"
        />
      </v-btn-group>
    </template>
  </v-data-table>

  <v-dialog v-model="showLogDataDialog" max-width="800px">
    <v-card>
      <v-card-text>
        <pre>{{ logData }}</pre>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
