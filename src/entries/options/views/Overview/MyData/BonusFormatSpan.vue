<script setup lang="ts">
import { computed } from "vue";
import { useConfigStore } from "@/options/stores/config.ts";
import { formatNumber, simplifyNumber } from "@/options/utils.ts";

const props = defineProps<{
  num: number | string | undefined;
}>();

const configStore = useConfigStore();

const normalizedValue = computed<{ type: "number"; value: number } | { type: "text"; value: string }>(() => {
  if (typeof props.num === "number" && Number.isFinite(props.num)) {
    return { type: "number", value: props.num };
  }

  return {
    type: "text",
    value: typeof props.num === "string" ? props.num : typeof props.num === "undefined" ? "-" : "N/A",
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

// Toggle function for double-click to switch number simplification
function toggleNumberSimplification() {
  configStore.myDataTableControl.simplifyBonusNumbers = !configStore.myDataTableControl.simplifyBonusNumbers;
}
</script>

<template>
  <span
    class="text-no-wrap"
    :title="titleText"
    @dblclick="toggleNumberSimplification"
    style="cursor: pointer; user-select: none"
  >
    {{ displayText }}
  </span>
</template>

<style scoped lang="scss"></style>
