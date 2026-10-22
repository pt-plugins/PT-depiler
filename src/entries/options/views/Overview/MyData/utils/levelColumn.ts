import { computed } from "vue";
import { useDisplay } from "vuetify";

import { useConfigStore } from "@/options/stores/config.ts";

/**
 * 等级列是否限制宽度：用户开启「限制等级栏宽度」，或处于小屏时生效（与搜索结果页的标题列行为一致）。
 *
 * 表格列的 maxWidth 与单元格内容的省略号截断必须使用同一条件，否则会出现
 * “限制宽度但不裁剪（文字溢出）”或 “裁剪但宽度不受限（省略号不出现）”的错位，故集中在此处维护。
 */
export function useLevelNameTdWidthLimit() {
  const configStore = useConfigStore();
  const display = useDisplay();

  return computed(() => configStore.myDataTableControl.limitLevelNameTdWidth || display.smAndDown.value);
}
