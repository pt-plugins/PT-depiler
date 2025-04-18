<script setup lang="ts">
import { useConfigStore } from "@/options/stores/config.ts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const configStore = useConfigStore();
</script>

<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col md="6">
          <v-number-input
            v-model="configStore.searchEntity.queueConcurrency"
            :max="100"
            :min="1"
            controlVariant="default"
            label="请求队列长度"
          ></v-number-input>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-row class="ml-2 my-1">
        <v-btn
          color="green"
          variant="elevated"
          prepend-icon="mdi-check-circle-outline"
          @click="() => configStore.$save()"
        >
          {{ t("common.save") }}
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss"></style>
