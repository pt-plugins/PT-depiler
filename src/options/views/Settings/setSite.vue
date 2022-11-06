<script lang="ts" setup>
import { provide, ref } from "vue";
import AddDialog from "@/options/components/Settings/setSite/AddDialog.vue";

const showAddDialog = ref<boolean>(false);
provide("showAddDialog", showAddDialog);

const showEditDialog = ref<boolean>(false);
provide("showEditDialog", showEditDialog);
</script>

<template>
  <v-alert type="info">
    {{ $t("route.Settings.setSite") }}
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
  </v-card>

  <AddDialog />
</template>

<style scoped></style>
