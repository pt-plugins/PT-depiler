import {Ref, shallowRef, ref, unref} from "vue";
import browser, {Storage} from "webextension-polyfill";
import { UseStorageOptions, watchWithFilter } from "@vueuse/core";

export type storageArea = Exclude<keyof Storage.Static, "onChanged">

export function persistent<T>(key: string,newValue: T, storage: storageArea = "local") {
  browser.storage[storage].set({[key]: JSON.parse(JSON.stringify(newValue))});
}

export interface restoreOptions<T = any> {
  initialValue?: T | Ref<T>,
  storage?: storageArea,
  writeDefaults?: boolean
  onError?: null | ((e: any) => void),
}

export async function restore<T>(key: string, options: restoreOptions<T> = {}): Promise<T> {
  const {
    initialValue,
    storage = "local",
    writeDefaults = true,
    onError = null
  } = options;

  const rawInit: T = unref(initialValue)!;

  try {
    const {[key]: fromStorage} = await browser.storage[storage].get(key);
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
  storage: storageArea = "local",
  options: Omit<UseStorageOptions<T>, "window" | "serializer"> = {}
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

  restore(key, {initialValue, storage, onError, writeDefaults})
    .then((v) => data.value = v);

  if (listenToStorageChanges) {
    browser.storage.onChanged.addListener((item, changeStorage) => {
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
          await browser.storage[storage].remove(key);
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
    }
  );

  return data;
}
