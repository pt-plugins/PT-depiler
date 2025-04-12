<script setup lang="ts">
import { ref } from "vue";
import UiWindow from "./UiWindow.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const setTab = ref<string>("ui");
</script>

<template>
  <v-card>
    <v-tabs v-model="setTab" align-tabs="center" bg-color="primary" stacked>
      <v-tab value="ui">
        <v-icon icon="mdi-cog" />
        {{ t("SetBase.tab.ui") }}
      </v-tab>
      <v-tab value="todo"> TODO </v-tab>
    </v-tabs>

    <v-window v-model="setTab">
      <v-window-item value="ui">
        <UiWindow />
      </v-window-item>

      <v-window-item value="todo"> TODO </v-window-item>
    </v-window>
  </v-card>
</template>

<style scoped lang="scss"></style>
