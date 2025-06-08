<script setup lang="ts">
import { type VBtn } from "vuetify/components";

import { useConfigStore } from "@/options/stores/config.ts";
import { type Writeable } from "@/shared/types/extends.ts";
import { useAttrs, Transition, type TransitionProps } from "vue";

const {
  title,
  icon,
  color = "white",
  transition = { name: "fade-transition", appear: true, mode: "out-in" },
} = defineProps<{
  title: string;
  icon: string;
  color?: string;
  transition?: TransitionProps;
}>();

const attrs = useAttrs();
const btnProp = { ...attrs } as Writeable<Partial<VBtn>>;

const configStore = useConfigStore();

if (configStore.contentScript.stackedButtons) {
  btnProp.prependIcon = icon;
  btnProp.stacked = true;
  btnProp.variant = "tonal";
} else {
  btnProp.icon = icon;
}
</script>

<template>
  <Transition v-bind="transition">
    <v-btn v-bind="btnProp" :color="color" :title="title" :text="btnProp.stacked ? title : undefined" />
  </Transition>
</template>

<style scoped lang="scss"></style>
