import type { Ref } from 'vue';
import { ref, watch } from 'vue';

// 重载签名
export function useLocalStorageState<T>(key: string): Ref<T | undefined>;
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T | (() => T)
): Ref<T>;
// 实现签名
export function useLocalStorageState<T>(
  key: string,
  defaultValue?: T | (() => T)
): Ref<T> {
  const state = ref(getState());
  function getState() {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (error) {
        //
      }
    }
    if (typeof defaultValue === 'function') {
      return (defaultValue as () => T)();
    }
    return defaultValue;
  }
  function setState() {
    localStorage.setItem(key, state.value);
  }

  watch(
    state,
    () => {
      setState();
    },
    { immediate: true, deep: true }
  );

  return state;
}
