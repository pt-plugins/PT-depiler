import {Ref, shallowRef, ref, unref} from "vue";
import browser from "webextension-polyfill";
import {StorageOptions, watchWithFilter} from "@vueuse/core";


export function useBrowserStore<T>(
  key: string,
  initialValue?: T | Ref<T>,
  storage: "local" | "sync" | "managed" = "local",
  options: Omit<StorageOptions<T>, "window" | "serializer"> = {}
): Ref<T> {
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    shallow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    },
  } = options;

  const data = (shallow ? shallowRef : ref)(initialValue) as Ref<T>;

  async function persistent(newValue: T) {
    await browser.storage[storage].set({[key]: JSON.parse(JSON.stringify(newValue))});
  }

  async function read(value ?: T) {
    try {
      const rawValue = value ? value : await browser.storage[storage].get(key).then(s => s[key] ?? null);
      if (rawValue === null) {
        const rawInit: T = unref(initialValue)!;
        data.value = rawInit;
        if (writeDefaults && rawInit !== null) {
          await persistent(rawInit);
        }
      } else {
        data.value = rawValue;
      }

    } catch (e: any) {
      onError(e);
    }
  }

  read();

  if (listenToStorageChanges) {
    browser.storage.onChanged.addListener((item, changeStorage) => {
      if (changeStorage === storage && item?.[key]?.newValue) {
        read(item[key].newValue);
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
          await persistent(data.value);
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

