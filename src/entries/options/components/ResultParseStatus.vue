<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { EResultParseStatus } from "@ptd/site";

const { status } = defineProps<{
  status: EResultParseStatus;
}>();

const { t } = useI18n();
</script>

<template>
  <template v-if="status === EResultParseStatus.unknownError">{{ t("resultParseStatus.unknownError") }}</template>
  <template v-else-if="status === EResultParseStatus.waiting">{{ t("resultParseStatus.waiting") }}</template>
  <template v-else-if="status === EResultParseStatus.working">{{ t("resultParseStatus.working") }}</template>
  <template v-else-if="status === EResultParseStatus.success">{{ t("resultParseStatus.success") }}</template>
  <template v-else-if="status === EResultParseStatus.parseError">{{ t("resultParseStatus.parseError") }}</template>
  <template v-else-if="status === EResultParseStatus.passParse">{{ t("resultParseStatus.passParse") }}</template>
  <template v-else-if="status === EResultParseStatus.CFBlocked">
    <span :title="t('resultParseStatus.CFBlockedNotes')">{{ t("resultParseStatus.CFBlocked") }}</span>
  </template>
  <template v-else-if="status === EResultParseStatus.needLogin">{{ t("resultParseStatus.needLogin") }}</template>
  <template v-else-if="status === EResultParseStatus.noResults">{{ t("resultParseStatus.noResults") }}</template>
  <template v-else>{{ t("resultParseStatus.unknown") }}</template>
</template>

<style scoped lang="scss"></style>
