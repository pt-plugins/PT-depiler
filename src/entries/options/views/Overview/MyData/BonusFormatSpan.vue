<script setup lang="ts">
import { computed } from "vue";
import { useConfigStore } from "@/options/stores/config.ts";
import { formatNumber, simplifyNumber } from "@/options/utils.ts";

const { num } = defineProps<{
  num: number | string | undefined;
}>();

const configStore = useConfigStore();

const normalizedValue = computed<{ type: "number"; value: number } | { type: "text"; value: string }>(() => {
  if (typeof num === "number" && Number.isFinite(num)) {
    return { type: "number", value: num };
  }

  return {
    type: "text",
    value: typeof num === "string" ? num : typeof num === "undefined" ? "-" : "N/A",
  };
});

const titleText = computed(() =>
  normalizedValue.value.type === "number" ? formatNumber(normalizedValue.value.value) : normalizedValue.value.value,
);

const displayText = computed(() =>
  normalizedValue.value.type === "number"
    ? configStore.myDataTableControl.simplifyBonusNumbers
      ? simplifyNumber(normalizedValue.value.value)
      : formatNumber(normalizedValue.value.value)
    : normalizedValue.value.value,
);

function toggleNumberSimplification() {
  if (normalizedValue.value.type !== "number") return;

  configStore.myDataTableControl.simplifyBonusNumbers = !configStore.myDataTableControl.simplifyBonusNumbers;
}
</script>

<template>
  <span
    class="text-no-wrap"
    :title="titleText"
    @dblclick="toggleNumberSimplification"
    :style="{ cursor: normalizedValue.type === 'number' ? 'pointer' : 'default', userSelect: 'none' }"
  >
    {{ displayText }}
  </span>
</template>

<style scoped lang="scss"></style>
