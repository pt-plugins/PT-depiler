<script setup generic="T" lang="ts">
import { useI18n } from "vue-i18n";

import NavButton from "./NavButton.vue";

const { t } = useI18n();

const selected = defineModel<T[]>({ required: true });
const { all } = defineProps<{
  all: T[];
}>();

function updateSelected(value: T[]) {
  selected.value = value;
}
</script>

<template>
  <NavButton
    :text="t('common.checkbox.all')"
    icon="mdi-checkbox-marked"
    size="small"
    v-bind="$attrs"
    @click="() => updateSelected(all)"
  />
  <NavButton
    :text="t('common.checkbox.none')"
    icon="mdi-checkbox-blank-off-outline"
    size="small"
    v-bind="$attrs"
    @click="() => updateSelected([])"
  />
  <NavButton
    :text="t('common.checkbox.invert')"
    icon="mdi-checkbox-intermediate-variant"
    size="small"
    v-bind="$attrs"
    @click="() => updateSelected(all.filter((site) => !selected.includes(site)))"
  />
</template>

<style scoped lang="scss"></style>
