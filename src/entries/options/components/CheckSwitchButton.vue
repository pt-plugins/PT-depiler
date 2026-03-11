<script setup lang="ts">
import { useI18n } from "vue-i18n";

import NavButton from "./NavButton.vue";

type T = any;
const { t } = useI18n();

const selected = defineModel<T[]>({ required: true, default: [] });
const { all } = defineProps<{
  all: T[];
}>();
const emit = defineEmits<{
  (e: "update:model", value: T[]): void;
}>();

function updateSelected(value: T[]) {
  selected.value = value;
  emit("update:model", value);
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
