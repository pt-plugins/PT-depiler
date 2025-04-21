import { ref as vueRef } from "vue";

export function useResetableRef<T = any>(initialValue: T | any) {
  const ref = vueRef<T>(initialValue);
  const reset = () => {
    ref.value = initialValue;
  };
  return { ref, reset };
}
