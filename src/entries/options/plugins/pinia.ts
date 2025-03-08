/**
 * this plugin is edit from ohmree/pinia-plugin-webext-storage
 */
import { ref, type Ref, shallowRef, unref } from "vue";
import { PiniaPluginContext, MutationType } from "pinia";
import { type UseStorageOptions, watchWithFilter } from "@vueuse/core";
import { createPinia } from "pinia";

export async function persistent<T>(key: string, newValue: T, storage: chrome.storage.AreaName = "local") {
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
    const { [key]: fromStorage } = await chrome.storage[storage].get(key);
    if (fromStorage) {
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

export function useBrowserStore<T>(
  key: string,
  initialValue?: T | Ref<T>,
  storage: chrome.storage.AreaName = "local",
  options: Omit<UseStorageOptions<T>, "window" | "serializer"> = {},
): Ref<T> {
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    shallow,
    eventFilter,
    onError = (e: any) => {
      console.error(e);
    },
  } = options;

  const data = (shallow ? shallowRef : ref)(initialValue) as Ref<T>;

  restore(key, { initialValue, storage, onError, writeDefaults }).then((v) => (data.value = v));

  if (listenToStorageChanges) {
    chrome.storage.onChanged.addListener((item, changeStorage) => {
      if (changeStorage === storage && item?.[key]?.newValue) {
        data.value = item[key].newValue;
      }
    });
  }

  watchWithFilter(
    data,
    async () => {
      try {
        if (data.value === null) {
          await chrome.storage[storage].remove(key);
        } else {
          await persistent(key, data.value, storage);
        }
      } catch (e: any) {
        onError(e);
      }
    },
    {
      flush,
      deep,
      eventFilter,
    },
  );

  return data;
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
    persist?: boolean | PersistedStateOptions;
  }

  export interface PiniaCustomProperties {
    $save(): Promise<void>;

    readonly $ready: Ref<boolean>;
  }
}

export function piniaBridgePlugin(context: PiniaPluginContext) {
  const {
    options: { persist },
    store,
  } = context;

  if (!persist) {
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
  } = typeof persist !== "boolean" ? persist : {};

  const $ready = ref(false);

  beforeRestore?.(context);
  restore(key, {
    initialValue: store.$state,
    storage: storageArea,
    writeDefaults: writeDefaultState,
    onError: onRestoreError,
  }).then((value) => {
    store.$patch(value as unknown as typeof store.$state);
    $ready.value = true;
    afterRestore?.(context);
  });

  function onChanged(changes: Record<string, chrome.storage.StorageChange>, areaName: string) {
    if (areaName === storageArea && Object.hasOwn(changes, key)) {
      store.$patch(changes[key].newValue);
    }
  }

  chrome.storage.onChanged.addListener(onChanged);

  const $save = async (newState = store.$state) => {
    try {
      chrome.storage.onChanged.removeListener(onChanged);
      // HACK: we might want to find a better way of deeply unwrapping a reactive object.
      await persistent(key, newState, storageArea);
      chrome.storage.onChanged.addListener(onChanged);
    } catch (_error) {}
  };

  if (autoSaveType && Array.isArray(autoSaveType)) {
    store.$subscribe((mutation, state: any) => {
      console.log("Store `" + store.$id + "` change subscribed: ", mutation);
      if (autoSaveType.includes(mutation.type)) {
        $save(state);
      }
    });
  }

  const $dispose = () => {
    chrome.storage.onChanged.removeListener(onChanged);
    store.$dispose();
  };

  return { $dispose, $save, $ready };
}

export const piniaInstance = createPinia();

piniaInstance.use(piniaBridgePlugin);
