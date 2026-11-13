<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <v-btn
    :title="t('common.fitTableColumns')"
    density="comfortable"
    icon="mdi-arrow-expand-horizontal"
    size="small"
    variant="text"
    v-bind="$attrs"
  />
</template>
