<script setup lang="ts">
import {useVModel} from "@vueuse/core";
import {useSiteStore} from "@/shared/store/site.ts";

const props = defineProps<{
  modelValue: boolean,
  toDeleteId: string,
}>();

const showDialog = useVModel(props, "modelValue");

const siteStore = useSiteStore();

function confirmDelete() {
  siteStore.removeSearchSolution(props.toDeleteId);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" width="300">
    <v-card>
      <v-card-title class="bg-red-lighten-2">
        {{ $t('common.dialog.title.confirmAction') }}
      </v-card-title>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="info" @click="showDialog=false">
          <v-icon icon="mdi-close-circle" />
          <span class="ml-1">{{ $t('common.dialog.cancel') }}</span>
        </v-btn>
        <v-btn variant="text" color="error" @click="confirmDelete">
          <v-icon icon="mdi-check-circle-outline" />
          <span class="ml-1">{{ $t('common.dialog.ok') }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
