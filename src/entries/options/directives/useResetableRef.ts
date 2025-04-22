import { type Ref, type MaybeRefOrGetter, ref as deepRef, shallowRef, toValue } from "vue";

interface IResetableRefOptions {
  shallow?: boolean;
}

export function useResetableRef<T = any>(initialValue: MaybeRefOrGetter<T>, options: IResetableRefOptions = {}) {
  const { shallow = false } = options;
  const originValue = toValue(initialValue);

  const ref = (shallow ? shallowRef(originValue) : deepRef(originValue)) as Ref<T>;
  const reset = (newVal: MaybeRefOrGetter<T> = initialValue) => {
    ref.value = toValue(newVal);
  };

  return { ref, reset };
}
