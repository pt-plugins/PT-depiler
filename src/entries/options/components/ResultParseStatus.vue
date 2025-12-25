<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { EResultParseStatus } from "@ptd/site";

const { status } = defineProps<{
  status: EResultParseStatus;
}>();

const { t } = useI18n();
</script>

<template>
  <span v-if="status === EResultParseStatus.unknownError" class="text-red">
    {{ t("resultParseStatus.unknownError") }}
  </span>
  <span v-else-if="status === EResultParseStatus.waiting" class="text-indigo">
    {{ t("resultParseStatus.waiting") }}
  </span>
  <span v-else-if="status === EResultParseStatus.working" class="text-indigo">
    {{ t("resultParseStatus.working") }}
  </span>
  <span v-else-if="status === EResultParseStatus.success" class="text-green">
    {{ t("resultParseStatus.success") }}
  </span>
  <span v-else-if="status === EResultParseStatus.parseError" class="text-red">
    {{ t("resultParseStatus.parseError") }}
  </span>
  <span v-else-if="status === EResultParseStatus.passParse" class="text-yellow-darken-2">
    {{ t("resultParseStatus.passParse") }}
  </span>
  <span v-else-if="status === EResultParseStatus.CFBlocked" :title="t('resultParseStatus.CFBlockedNotes')">
    {{ t("resultParseStatus.CFBlocked") }}
  </span>
  <span v-else-if="status === EResultParseStatus.needLogin" class="text-red">
    {{ t("resultParseStatus.needLogin") }}
  </span>
  <span v-else-if="status === EResultParseStatus.noResults" class="text-red">
    {{ t("resultParseStatus.noResults") }}
  </span>
  <span v-else class="text-blue-grey">{{ t("resultParseStatus.unknown") }}</span>
</template>

<style scoped lang="scss"></style>
