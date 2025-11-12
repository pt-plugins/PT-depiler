<script setup lang="ts">
import { useAttrs, Transition, computed, type TransitionProps, useTemplateRef } from "vue";
import { useElementHover } from "@vueuse/core";
import { type VBtn } from "vuetify/components";

import { useConfigStore } from "@/options/stores/config.ts";
import { type Writeable } from "@/shared/types/extends.ts";

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

const configStore = useConfigStore();
const attrs = useAttrs();

const myHoverableElement = useTemplateRef<HTMLButtonElement>("btn");
const isHovered = useElementHover(myHoverableElement);

const btnProp = computed(() => {
  // Use Writeable to allow modification of the VBtn properties
  const btnProps: Writeable<Partial<VBtn>> = { ...attrs };

  if (configStore.contentScript.stackedButtons) {
    btnProps.prependIcon = icon;
    btnProps.stacked = true;
    btnProps.variant = isHovered.value ? "elevated" : "tonal";
  } else {
    btnProps.icon = icon;
  }

  return btnProps;
});

const shouldFadeEnter = computed<boolean>(
  () =>
    !configStore.contentScript.stackedButtons && // 大图标时的 hover 透明性由 btnProps.variant 属性控制
    configStore.contentScript.fadeEnterStyle,
);
</script>

<template>
  <Transition v-bind="transition">
    <v-btn
      ref="btn"
      v-bind="btnProp"
      :class="{
        'ptd-fade-enter': shouldFadeEnter,
      }"
      :color="color"
      :title="title"
      :text="btnProp.stacked ? title : undefined"
    />
  </Transition>
</template>

<style scoped lang="scss"></style>
