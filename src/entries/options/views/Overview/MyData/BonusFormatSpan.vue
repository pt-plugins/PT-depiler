<script setup lang="ts">
import { useConfigStore } from "@/options/stores/config.ts";
import { formatNumber, simplifyNumber } from "@/options/utils.ts";

const { num: numberItem } = defineProps<{
  num: number;
}>();

const configStore = useConfigStore();

// Toggle function for double-click to switch number simplification
function toggleNumberSimplification() {
  configStore.myDataTableControl.simplifyBonusNumbers = !configStore.myDataTableControl.simplifyBonusNumbers;
}
</script>

<template>
  <span
    class="text-no-wrap"
    :title="typeof numberItem !== 'undefined' ? formatNumber(numberItem) : '-'"
    @dblclick="toggleNumberSimplification"
    style="cursor: pointer; user-select: none"
  >
    {{
      typeof numberItem !== "undefined"
        ? configStore.myDataTableControl.simplifyBonusNumbers
          ? simplifyNumber(numberItem)
          : formatNumber(numberItem)
        : "-"
    }}
  </span>
</template>

<style scoped lang="scss"></style>
