import {
  computed,
  nextTick,
  onScopeDispose,
  shallowRef,
  toValue,
  watch,
  type ComponentPublicInstance,
  type MaybeRefOrGetter,
} from "vue";
import type { DataTableHeader } from "vuetify";

import { useConfigStore } from "@/options/stores/config.ts";

/** 表头单元格上标记列 key 的属性，用于在 DOM 中找到对应的 <th> */
const KEY_ATTR = "data-fit-key";

/**
 * 统一处理数据表格的列（见 SetBase - UI 中的「数据表格」）：
 *
 * 1. 操作列（key 为 `action`）：
 *    - `tableActionColumnPosition`：操作列位于行首还是行尾
 *    - `tableActionColumnFixed`：表格过宽（横向滚动）时固定操作列，固定方向与所在位置一致
 * 2. `tableColumnFit`：列宽适应内容。按内容（表头文字与当前渲染出的各行单元格）测出每列的理想宽度，
 *    再把它们铺满表格的宽度：
 *    - 内容比表格窄时，剩余的宽度按各列宽度的比例分给所有列；
 *    - 内容比表格宽时，窄的列保持内容宽度，只把最宽的几列截成同一个宽度。
 *
 *    表格加载、行变化（翻页、排序、筛选、数据增减）与显示的列变化时自动重新适应；
 *    结果以百分比保存，窗口宽度变化时由浏览器按比例缩放，不重新测量。
 *
 * 用法：
 * ```ts
 * const { tableRef, fittedHeaders, tableClass } = useTableColumnFit(tableHeader);
 * ```
 * ```vue
 * <v-data-table ref="tableRef" :headers="fittedHeaders" :class="tableClass" />
 * ```
 */
export function useTableColumnFit(headers: MaybeRefOrGetter<readonly DataTableHeader[]>) {
  const configStore = useConfigStore();
  const tableRef = shallowRef<ComponentPublicInstance | null>(null);
  const fitted = shallowRef<{ signature: string; widths: Record<string, string> } | null>(null);

  const arrangedHeaders = computed(() =>
    arrangeActionColumn(toValue(headers), configStore.tableActionColumnPosition, configStore.tableActionColumnFixed),
  );

  const signature = computed(() => arrangedHeaders.value.map((header) => header.key).join("\n"));
  const isFitted = computed(() => configStore.tableColumnFit && fitted.value?.signature === signature.value);

  const fittedHeaders = computed<DataTableHeader[]>(() =>
    arrangedHeaders.value.map((header) => {
      const next: DataTableHeader = {
        ...header,
        headerProps: { ...header.headerProps, [KEY_ATTR]: header.key },
      };
      const width = isFitted.value && header.key ? fitted.value!.widths[header.key] : undefined;
      if (width) {
        next.width = width;
        delete next.minWidth;
        delete next.maxWidth;
      }
      return next;
    }),
  );

  const tableClass = computed(() => ({ "table-column-fitted": isFitted.value }));

  function fitColumns() {
    const root = tableRef.value?.$el as HTMLElement | undefined;
    const wrapper = root?.querySelector<HTMLElement>(".v-table__wrapper");
    const headerRow = wrapper?.querySelector<HTMLElement>("thead tr");
    if (!root || !wrapper || !headerRow) return;

    const cells = Array.from(headerRow.children) as HTMLElement[];
    // Vuetify 内置的勾选、展开等列（key 以 data-table- 开头）与固定列保持原宽：
    // 多个固定列时 Vuetify 要求列宽为数值，不能改成百分比
    const definitions = new Map(
      arrangedHeaders.value
        .filter((header) => header.key && !header.key.startsWith("data-table-") && !header.fixed)
        .map((header) => [header.key!, header]),
    );
    const fitCells = cells.filter((cell) => definitions.has(cell.getAttribute(KEY_ATTR) ?? ""));
    if (fitCells.length === 0) return;

    const tableWidth = wrapper.clientWidth;
    // 表格未显示（如在关闭的对话框、未激活的页签里）时无从测量
    if (tableWidth <= 0) return;

    // 测量期间让表格按内容的 max-content 排版，此时每个 <th> 的宽度即该列最宽内容的宽度（含内边距）。
    // 同步完成，期间浏览器不会绘制。
    // 不参与适应的列（如勾选列、展开列）也在此时量，用其内容宽度而不是当前宽度，
    // 否则上次适应留给它们的余量会被当成它们的宽度，每点一次就变宽一些。
    root.classList.add("table-column-fit-measure");
    const contentWidths = fitCells.map((cell) => Math.ceil(cell.getBoundingClientRect().width));
    const fixedWidth = cells
      .filter((cell) => !fitCells.includes(cell))
      .reduce(
        // 勾选、展开列在样式里有固定宽度（如 48px），取两者中较大的一个
        (sum, cell) => sum + Math.max(Math.ceil(cell.getBoundingClientRect().width), parseFloat(cell.style.width) || 0),
        0,
      );
    root.classList.remove("table-column-fit-measure");

    // 先按每列的 maxWidth 限制理想宽度，分配时也遵守，避免分配后再限制导致总宽溢出。
    // 不遵守表头的 minWidth：它是为默认排版设的（如标题列的 30rem），放不下时应由宽列（标题）让出空间。
    // 操作列（key 为 action，见 useTableActionColumn）里是按钮，裁掉就点不到，所以保持内容宽度。
    const limits = fitCells.map((cell, index) => {
      const header = definitions.get(cell.getAttribute(KEY_ATTR)!)!;
      return {
        min: header.key === "action" ? contentWidths[index] : 0,
        max: toPixels(header.maxWidth, wrapper) ?? Infinity,
      };
    });
    const ideal = contentWidths.map((width, index) => clamp(width, limits[index]));
    const widths = spreadWithin(ideal, limits, tableWidth - fixedWidth);

    const result: Record<string, string> = {};
    fitCells.forEach((cell, index) => {
      const width = widths[index];
      result[cell.getAttribute(KEY_ATTR)!] = `${((width / tableWidth) * 100).toFixed(3)}%`;
    });
    // 结果不变时不更新，避免表头重新渲染
    if (isFitted.value && JSON.stringify(fitted.value!.widths) === JSON.stringify(result)) return;
    fitted.value = { signature: signature.value, widths: result };
  }

  // 只在 tbody 的行增减或被替换时重新适应；单元格内容的更新（如下载器的实时速度）不触发
  let observer: MutationObserver | undefined;
  let frame = 0;
  function scheduleFit() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(fitColumns);
  }

  watch(
    [() => configStore.tableColumnFit, tableRef, signature],
    async ([enabled, table]) => {
      observer?.disconnect();
      observer = undefined;
      cancelAnimationFrame(frame);
      if (!enabled || !table) return;

      await nextTick();
      const element = (table.$el as HTMLElement | undefined)?.querySelector(".v-table__wrapper > table");
      if (!element) return;
      observer = new MutationObserver((mutations) => {
        if (mutations.some((mutation) => ["TABLE", "TBODY"].includes((mutation.target as Element).tagName))) {
          scheduleFit();
        }
      });
      observer.observe(element, { childList: true, subtree: true });
      scheduleFit();
    },
    { immediate: true, flush: "post" },
  );

  onScopeDispose(() => {
    observer?.disconnect();
    cancelAnimationFrame(frame);
  });

  return { tableRef, fittedHeaders, tableClass };
}

/** 按设置调整操作列（key 为 `action`）的位置与固定，不修改传入的表头定义 */
function arrangeActionColumn(
  headers: readonly DataTableHeader[],
  position: "start" | "end",
  fixed: boolean,
): DataTableHeader[] {
  const actionIndex = headers.findIndex((header) => header.key === "action");
  if (actionIndex === -1) {
    return [...headers];
  }

  const actionHeader: DataTableHeader = { ...headers[actionIndex] };
  if (fixed) {
    actionHeader.fixed = position;
  }

  const otherHeaders = headers.filter((_, index) => index !== actionIndex);
  if (position === "start") {
    return [actionHeader, ...otherHeaders];
  }
  // 放在行尾时，仍排在 Vuetify 内置的展开列等（key 以 data-table- 开头）之前
  let insertAt = otherHeaders.length;
  while (insertAt > 0 && String(otherHeaders[insertAt - 1].key ?? "").startsWith("data-table-")) {
    insertAt -= 1;
  }
  return [...otherHeaders.slice(0, insertAt), actionHeader, ...otherHeaders.slice(insertAt)];
}

/**
 * 在 `spread` 的基础上遵守每列的最小 / 最大宽度：分配结果越界的列固定为边界值，
 * 剩余空间再分给其他列，直到没有列越界。
 */
function spreadWithin(ideal: number[], limits: { min: number; max: number }[], room: number): number[] {
  const widths = [...ideal];
  const free = new Set(ideal.keys());
  while (free.size > 0) {
    const indices = [...free];
    const taken = widths.reduce((sum, width, index) => (free.has(index) ? sum : sum + width), 0);
    const spreadWidths = spread(
      indices.map((index) => ideal[index]),
      room - taken,
    );
    let changed = false;
    indices.forEach((index, position) => {
      const width = clamp(spreadWidths[position], limits[index]);
      if (width !== spreadWidths[position]) {
        free.delete(index);
        changed = true;
      }
      widths[index] = width;
    });
    if (!changed) break;
  }
  return widths;
}

/**
 * 把各列的理想宽度分配到 `room` 上：总宽不足时按比例放大；
 * 超出时按「注水」处理：从窄到宽，宽度不超过剩余空间均分值的列保持原宽，其余列都取该均分值。
 */
function spread(ideal: number[], room: number): number[] {
  const total = ideal.reduce((sum, width) => sum + width, 0);
  if (total <= 0 || room <= 0) return ideal;
  if (total <= room) {
    return ideal.map((width) => (width * room) / total);
  }

  let left = room;
  let count = ideal.length;
  let cap = room / count;
  for (const width of [...ideal].sort((a, b) => a - b)) {
    cap = left / count;
    if (width > cap) break;
    left -= width;
    count -= 1;
  }
  return ideal.map((width) => Math.min(width, cap));
}

function clamp(width: number, { min, max }: { min: number; max: number }): number {
  return Math.min(Math.max(width, min), max);
}

/** 把表头定义里的宽度（数字、px、rem、vw、% 等）换算为像素，% 相对于表格容器 */
function toPixels(value: string | number | undefined, container: HTMLElement): number | undefined {
  if (value === undefined || value === "") return undefined;
  if (typeof value === "number" || /^\d+(\.\d+)?(px)?$/.test(value)) return parseFloat(String(value));

  const probe = document.createElement("div");
  probe.style.cssText = "visibility:hidden;height:0;overflow:hidden;";
  probe.style.width = value;
  container.appendChild(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}
