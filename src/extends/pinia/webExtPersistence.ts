/**
 * 自研的 Pinia → `chrome.storage` 持久化插件（`config` / `metadata` 两个 store 用它）。
 *
 * 仓库里同时还在用上游的 `pinia-plugin-state-persistence`（`stores/runtime.ts` 的 sessionStorage）。
 * 两份实现相比：
 *
 * - 我们这份**独有**的是「跨上下文实时同步」—— `chrome.storage.onChanged` → `$patch`，
 *   上游完全没有存储事件处理（options / offscreen / SW 之间共享状态全靠这个）；
 * - 下面这些是照上游补齐、原先缺的：
 *   1. **写入队列**：同一 storage key 的写入串行化，避免两次重叠保存乱序（旧状态覆盖新状态）。
 *      上游见其 `utils.js` 的 `enqueue()`；我们此前是裸并发保存，而全仓 46 处 `$save()` 里
 *      有 18 处连 `await` 都没有。
 *   2. **恢复完成前不写**：`$save()` 先等 `restorePromise`，否则会把默认状态写回存储、覆盖已存数据。
 *   3. **回声抑制**：写完之后 `storage.onChanged` 会把自己的写入回灌一次；用写入时的序列化结果比对跳过它。
 *      以前的做法是 `removeListener` → 写 → `addListener`：窗口期内到达的外部变更会丢，
 *      而且写失败时监听器**永久丢失**（空 catch），跨 tab 同步从此失效。
 *   4. **恢复期指纹守卫**：异步恢复期间应用可能已经改过状态，这些字段不要用存储里的旧值覆盖。
 *      上游见其 `index.js` 的 `stateBeforeRestore` 比对。
 */
import type { Ref } from "vue";
import { ref, unref } from "vue";
// 这两个都只是类型：标成 `import type`，否则纯 ESM 工具链（Node 的类型擦除、esbuild 单文件转换）
// 会把它当成运行时导入 → "does not provide an export named 'PiniaPluginContext'"
import type { MutationType, PiniaPluginContext } from "pinia";

/** `JSON.stringify` 的安全版本：拿不到指纹（循环引用等）时返回 undefined */
function fingerprint(value: unknown): string | undefined {
  try {
    return JSON.stringify(value);
  } catch {
    return undefined;
  }
}

/** 同一 key 的写入排队，前一次失败不阻塞后一次；队列空后删表项，避免 Map 无上限增长 */
const writeQueues = new Map<string, Promise<void>>();

function enqueue(queueKey: string, operation: () => Promise<void>): Promise<void> {
  const previous = writeQueues.get(queueKey) ?? Promise.resolve();
  const current = previous.then(operation, operation);
  const settled = current.then(
    () => {},
    () => {},
  );
  writeQueues.set(queueKey, settled);
  void settled.then(() => {
    if (writeQueues.get(queueKey) === settled) {
      writeQueues.delete(queueKey);
    }
  });
  return current;
}

export async function persistent<T>(key: string, newValue: T, storage: chrome.storage.AreaName = "local") {
  // JSON 往返是为了深拷贝、去掉 Vue 的响应式包装（chrome.storage 存不了 Proxy）。
  // 这里**不吞错**：失败要抛给调用方（`$save`）记日志，否则就是静默丢数据。
  await chrome.storage[storage].set({ [key]: JSON.parse(JSON.stringify(newValue)) });
}

export interface restoreOptions<T = any> {
  initialValue?: T | Ref<T>;
  storage?: chrome.storage.AreaName;
  writeDefaults?: boolean;
  onError?: null | ((e: any) => void);
}

export async function restore<T>(key: string, options: restoreOptions<T> = {}): Promise<T> {
  const { initialValue, storage = "local", writeDefaults = true, onError = null } = options;

  const rawInit: T = unref(initialValue)!;

  try {
    console.debug("Restoring state for key:", key, "from storage:", storage);
    const { [key]: fromStorage } = await chrome.storage[storage].get(key);
    // ⚠️ 不能用真值判断：`false` / `0` / `""` 都是合法状态，
    // 旧写法 `if (fromStorage)` 会把它们当成「没存过」，然后用默认值覆盖掉
    if (fromStorage !== undefined) {
      return fromStorage as T;
    } else {
      if (writeDefaults && rawInit !== null) {
        await persistent(key, rawInit, storage);
      }
      return rawInit;
    }
  } catch (e) {
    onError?.(e);
    return rawInit;
  }
}

export interface PersistedStateOptions {
  /**
   * Storage key to use.
   * @default $store.id
   */
  key?: string;

  /**
   * Where to store persisted state.
   * @default 'local'
   */
  storageArea?: chrome.storage.AreaName;

  writeDefaultState?: boolean;
  autoSaveType?: boolean | MutationType[];

  /**
   * Hook called before state is hydrated from storage.
   * @default undefined
   */
  beforeRestore?: (context: PiniaPluginContext) => void;

  /**
   * Hook called after state is hydrated from storage.
   * @default undefined
   */
  afterRestore?: (context: PiniaPluginContext) => void;

  onRestoreError?: (e: any) => void;
}

declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * Persist store in storage.
     */
    persistWebExt?: boolean | PersistedStateOptions;
  }

  export interface PiniaCustomProperties {
    readonly $ready: Ref<boolean>;

    $save(): Promise<void>;
    $onReady(callback?: () => void): Promise<void>;

    /** 只注销本插件注册的存储监听器（不要覆盖 Pinia 内建的 `$dispose`） */
    $disposeWebExt(): void;
  }
}

export function piniaWebExtPersistencePlugin(context: PiniaPluginContext) {
  const {
    options: { persistWebExt },
    store,
  } = context;

  if (!persistWebExt) {
    return {};
  }

  const {
    key = store.$id,
    storageArea = "local",
    writeDefaultState = true,
    autoSaveType = false,
    beforeRestore = null,
    afterRestore = null,
    onRestoreError = null,
  } = typeof persistWebExt !== "boolean" ? persistWebExt : {};

  const $ready = ref(false);

  /** 最近一次自己写进存储的序列化结果，用于识别 `storage.onChanged` 里自己的回声 */
  let lastWritten: string | undefined;

  /** 恢复开始时的状态指纹：恢复完成时跳过「等待期间被应用改过」的字段 */
  const fingerprintsBeforeRestore = Object.fromEntries(
    Object.entries(store.$state as Record<string, unknown>).map(([stateKey, value]) => [stateKey, fingerprint(value)]),
  );

  beforeRestore?.(context);
  const restorePromise = restore(key, {
    initialValue: store.$state,
    storage: storageArea,
    writeDefaults: writeDefaultState,
    onError: onRestoreError,
  }).then((value) => {
    const restored: Record<string, unknown> = { ...(value as Record<string, unknown>) };
    for (const stateKey of Object.keys(restored)) {
      const changedWhileRestoring =
        stateKey in fingerprintsBeforeRestore &&
        fingerprint((store.$state as Record<string, unknown>)[stateKey]) !== fingerprintsBeforeRestore[stateKey];
      if (changedWhileRestoring) {
        delete restored[stateKey]; // 应用已经改过 → 以应用为准
      }
    }

    // 存储里可能是非对象值（早期版本 / 手工写入），别把 $patch 打崩
    if (restored && typeof restored === "object") {
      store.$patch(restored as typeof store.$state);
    }

    $ready.value = true;
    afterRestore?.(context);
  });

  const $onReady = async (callback?: () => void) => {
    if (callback) {
      restorePromise.then(callback);
    }
    return restorePromise;
  };

  function onChanged(changes: Record<string, chrome.storage.StorageChange>, areaName: string) {
    if (areaName !== storageArea || !Object.hasOwn(changes, key)) {
      return;
    }

    const newValue = changes[key].newValue;
    // 自己刚写进去的值会被回灌一次；不跳过的话，会用旧快照覆盖这期间用户/应用的新改动
    if (fingerprint(newValue) === lastWritten) {
      return;
    }

    if (newValue && typeof newValue === "object") {
      store.$patch(newValue as Parameters<typeof store.$patch>[0]);
    }
  }

  chrome.storage.onChanged.addListener(onChanged);

  const $save = async (newState = store.$state) => {
    // 恢复完成前不要写：此时 store 还是默认状态，写进去就把存储里的数据覆盖了
    await restorePromise;

    // 同一 key 的写入排队，避免并发保存乱序互相覆盖
    return enqueue(`${storageArea}:${key}`, async () => {
      const serialized = JSON.stringify(newState);
      lastWritten = serialized; // 复用这次序列化结果做回声指纹，不额外开销
      await chrome.storage[storageArea].set({ [key]: JSON.parse(serialized) });
    }).catch((e) => {
      console.error(`[PTD] 保存 store "${store.$id}" 失败：`, e);
    });
  };

  if (autoSaveType && Array.isArray(autoSaveType)) {
    store.$subscribe((mutation, state: any) => {
      if (autoSaveType.includes(mutation.type)) {
        $save(state);
      }
    });
  }

  /**
   * 只移除本插件注册的监听器。
   * ⚠️ 不要把它叫 `$dispose`：那会覆盖 Pinia 内建的 `$dispose`，而实现里又调用 `store.$dispose()`
   * → 无限递归（现在没有调用点，但一旦有人清理 store 就栈溢出）。
   */
  const $disposeWebExt = () => {
    chrome.storage.onChanged.removeListener(onChanged);
  };

  return { $disposeWebExt, $save, $ready, $onReady };
}
