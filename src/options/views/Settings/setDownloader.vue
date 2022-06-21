<script lang="ts" setup>
import {ref, provide} from "vue";
import {useDownloaderStore} from "@/shared/store/downloader";
import {getDownloaderIcon} from "@ptpp/downloader";
import AddDialog from "@/options/components/Settings/setDownloader/AddDialog.vue";
import EditDialog from "@/options/components/Settings/setDownloader/EditDialog.vue";
import DeleteDialog from "@/options/components/Settings/setDownloader/DeleteDialog.vue";

const downloaderStore = useDownloaderStore();

const clientConfig = ref<any>({});
provide("clientConfig", clientConfig);

const showAddDialog = ref<boolean>(false);
provide("showAddDialog", showAddDialog);

const showEditDialog = ref<boolean>(false);
provide("showEditDialog", showEditDialog);

function editDownloader(perEditClientConfig: any) {
  clientConfig.value = perEditClientConfig;
  showEditDialog.value = true;
}

const showSetDefaultDownloaderSnackbar = ref<boolean>(false);
function setDefaultDownloader(clientId:string) {
  downloaderStore.defaultDownloaderId = clientId;
  showSetDefaultDownloaderSnackbar.value = true;
}

const showDeleteDialog = ref<boolean>(false);
provide("showDeleteDialog", showDeleteDialog);

const toDeleteDownloaderIds = ref<string[]>([]);
provide("toDeleteDownloaderIds", toDeleteDownloaderIds);

function deleteDownloader(clientId: string) {
  toDeleteDownloaderIds.value.push(clientId);
  showDeleteDialog.value = true;
}

</script>

<template>
  <v-alert type="info">
    {{ $t("route.Settings.setDownloader") }}
  </v-alert>
  <v-card>
    <v-card-title>
      <v-btn
        color="success" prepend-icon="mdi-plus"
        class="mr-2"
        @click="showAddDialog = true"
      >
        {{ $t("common.btn.add") }}
      </v-btn>
      <!-- TODO 批量禁用 after: v-data-table -->
      <v-btn color="error" prepend-icon="mdi-minus" disabled>
        {{ $t("common.btn.remove") }}
      </v-btn>
      <v-spacer />
      <!-- TODO 搜索 after: v-data-table -->
    </v-card-title>

    <!-- FIXME 使用 v-data-table 替代 -->
    <v-table>
      <thead>
        <tr>
          <th>{{ $t("setDownloader.index.table.header.type") }}</th>
          <th>{{ $t("setDownloader.index.table.header.name") }}</th>
          <th>{{ $t("setDownloader.index.table.header.id") }}</th>
          <th>{{ $t("setDownloader.index.table.header.address") }}</th>
          <th>{{ $t("setDownloader.index.table.header.action") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="client in downloaderStore.clients" :key="client.id"
          :class="{ 'bg-lime': downloaderStore.isDefaultDownloader(client.id)} "
        >
          <td>
            <v-avatar :image="getDownloaderIcon(client.type)" :alt="client.type" />
          </td>
          <td>{{ client.name }}</td>
          <td><code>{{ client.id }}</code></td>
          <td>
            <a :href="client.address" target="_blank" rel="noopener noreferrer nofollow">
              {{ client.address }}
              <v-icon icon="mdi-page-next" size="small" />
            </a>
          </td>
          <td>
            <v-btn
              size="small" icon="mdi-home"
              variant="plain" class="mr-2"
              :disabled="downloaderStore.isDefaultDownloader(client.id)"
              :title="$t('setDownloader.index.table.action.setDefault')"
              @click="setDefaultDownloader(client.id)"
            />
            <v-btn
              size="small" icon="mdi-pencil"
              variant="plain"
              @click="editDownloader(client)"
            />
            <v-btn
              size="small" icon="mdi-delete"
              variant="plain" color="error"
              @click="deleteDownloader(client.id)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-alert v-if="downloaderStore.clients.length === 0">
      {{ $t('setDownloader.index.emptyNotice') }}
    </v-alert>
  </v-card>

  <!-- Components -->
  <AddDialog />
  <EditDialog />
  <DeleteDialog />

  <!-- 设置默认下载器 -->
  <v-snackbar v-model="showSetDefaultDownloaderSnackbar">
    {{ $t('setDownloader.index.changeDefaultDownloader') }}
  </v-snackbar>
</template>

<style scoped></style>
