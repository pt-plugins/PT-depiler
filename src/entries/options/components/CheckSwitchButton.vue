<script setup lang="ts">
import NavButton from "./NavButton.vue";

type T = any;

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
  <NavButton icon="mdi-checkbox-marked" size="small" text="全选" v-bind="$attrs" @click="() => updateSelected(all)" />
  <NavButton
    icon="mdi-checkbox-blank-off-outline"
    size="small"
    text="全不选"
    v-bind="$attrs"
    @click="() => updateSelected([])"
  />
  <NavButton
    icon="mdi-checkbox-intermediate-variant"
    size="small"
    text="反选"
    v-bind="$attrs"
    @click="() => updateSelected(all.filter((site) => !selected.includes(site)))"
  />
</template>

<style scoped lang="scss"></style>
