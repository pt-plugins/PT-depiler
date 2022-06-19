<script lang="ts" setup>
import {ref, provide} from "vue";
import {useDownloaderStore} from "@/shared/store/downloader";
import {getDownloaderIcon} from "@ptpp/downloader";
import AddDownloader from "@/options/components/Settings/setDownloader/AddDownloader.vue";

const downloaderStore = useDownloaderStore();

const clientConfig = ref<any>({});
provide("clientConfig", clientConfig);

const showAddDownloaderModal = ref(false);
provide("showAddDownloaderModal", showAddDownloaderModal);

const showEditDownloaderModal = ref(false);
provide("showEditDownloaderModal", showEditDownloaderModal);
</script>

<template>
  <v-alert type="info">
    {{ $t("route.Settings.setDownloader") }}
  </v-alert>
  <v-card>
    <v-card-title>
      <v-btn color="success" prepend-icon="mdi-plus" @click="showAddDownloaderModal = true">
        {{ $t("setDownloader.index.btn.add") }}
      </v-btn>
      <!-- TODO 批量禁用 after: v-data-table -->
      <v-btn color="error" prepend-icon="mdi-minus" disabled>
        {{ $t("setDownloader.index.btn.remove") }}
      </v-btn>
      <v-spacer />
      <!-- TODO 搜索 after: v-data-table -->
    </v-card-title>

    <!-- FIXME 使用 v-data-table 替代 -->
    <v-table>
      <thead>
        <tr>
          <th>{{ $t("setDownloader.index.tableHeader.name") }}</th>
          <th>{{ $t("setDownloader.index.tableHeader.type") }}</th>
          <th>{{ $t("setDownloader.index.tableHeader.address") }}</th>
          <th>{{ $t("setDownloader.index.tableHeader.action") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in downloaderStore.clients" :key="client.id">
          <td>
            <v-avatar :image="getDownloaderIcon(client.type)" :alt="client.type" />{{ client.name }}
          </td>
          <td>{{ client.type }}</td>
          <td><a :href="client.address">{{ client.address }}</a></td>
          <td>Action</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>

  <AddDownloader />
</template>

<style scoped></style>
