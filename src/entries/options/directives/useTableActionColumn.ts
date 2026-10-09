import type { DataTableHeader } from "vuetify";

import { useConfigStore } from "@/options/stores/config.ts";

/**
 * 根据设置调整表头中 key 为 `action` 的操作列（见 SetBase - UI 中的「数据表格」）：
 * - `tableActionColumnPosition`：操作列位于行首还是行尾
 * - `tableActionColumnFixed`：表格过宽（横向滚动）时固定操作列，固定方向与所在位置一致
 *
 * 注意：本函数会读取 configStore 中的配置，需要在 computed 中调用，
 * 配置变更后才能让表格的表头同步刷新。
 */
export function useTableActionColumn(headers: readonly DataTableHeader[]): DataTableHeader[] {
  const actionIndex = headers.findIndex((header) => header.key === "action");
  if (actionIndex === -1) {
    return [...headers];
  }

  const { tableActionColumnPosition: position, tableActionColumnFixed: fixed } = useConfigStore();

  // 复制一份，避免修改调用方传入的表头定义
  const actionHeader: DataTableHeader = { ...headers[actionIndex] };
  if (fixed) {
    actionHeader.fixed = position;
  }

  const otherHeaders = headers.filter((_, index) => index !== actionIndex);

  return position === "start" ? [actionHeader, ...otherHeaders] : [...otherHeaders, actionHeader];
}
