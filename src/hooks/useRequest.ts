import type { Ref } from 'vue';
import { ref, watch } from 'vue';
import { debounce, throttle } from 'lodash';

export type Service<T, R extends unknown[]> = (...args: R) => Promise<T>;
export type OptionsType<T, R extends unknown[]> = IDefaultOptions<T, R>;
export interface IDefaultOptions<T = unknown, R extends unknown[] = unknown[]> {
  ready: Ref<boolean>;
  defaultLoading: boolean;
  initialData: T;
  manual: boolean;
  defaultParams: R;
  throttleInterval: number;
  debounceInterval: number;
  loadingDelay: number;
  pollingInterval: number;
  pollingErrorRetryCount: number;
  pollingSinceLastFinished: boolean;
  formatResult: (res: unknown) => T;
  onSuccess: (data: T, params: R) => void;
  onError: (err: Error, params: R) => void;
  onFinally: () => void;
}

const DefaultOptions: IDefaultOptions = {
  ready: ref(true),
  defaultLoading: false,
  initialData: undefined,
  manual: false,
  defaultParams: [] as unknown[],
  throttleInterval: 0,
  debounceInterval: 0,
  loadingDelay: 0,
  pollingInterval: 0,
  pollingErrorRetryCount: -1,
  pollingSinceLastFinished: true,
  formatResult: (res) => res,
  onSuccess: () => {
    //
  },
  onError: () => {
    //
  },
  onFinally: () => {
    //
  }
};

/**
 * useRequest
 * @param service 必须是一个返回值为Promise的函数
 * @param options
 *  defaultLoading: 默认加载状态
    initialData: 默认service的返回值
    ready: 是否准备好了，准备好了就可以执行service了
    manual: 是否手动执行service,设置为true后需要通过run()手动执行service
    defaultParams: service的参数
    throttleInterval: 节流间隔
    debounceInterval: 防抖间隔
    loadingDelay: 设置loading为true的延时时间（有些请求时间过短，没必要将loading为true，这样能无感刷新页面，避免屏幕闪烁）
    pollingInterval: 轮询间隔
    pollingErrorRetryCount: 允许轮询连续失败次数，达到后停止轮询，-1为无限次
    pollingSinceLastFinished: 轮询的开始时机，true为上一次执行完成后开始轮训，false为直接开始轮询
    formatResult: 数据格式化再返回出来
    onSuccess: service成功后触发
    onError: service报错后触发
    onFinally: service完成后触发（无论是否失败）
 * @returns
 *  loading, data, error, params, refresh, run, cancel
 */
export function useRequest<T, R extends unknown[]>(
  service: Service<T, R>,
  options: Partial<OptionsType<T, R>> = {} // Partial<T> 把接口类型中定义的属性变成可选的
) {
  const finalOptions = { ...DefaultOptions, ...options };
  const {
    defaultLoading,
    initialData,
    ready,
    manual,
    defaultParams,
    throttleInterval,
    debounceInterval,
    loadingDelay,
    pollingInterval,
    pollingErrorRetryCount,
    pollingSinceLastFinished,
    formatResult,
    onSuccess,
    onError,
    onFinally
  } = finalOptions;
  const loading = ref<boolean>(defaultLoading);
  const data = ref<T>(initialData as T) as Ref<T>;
  const params = ref<R>(defaultParams as R); // 保存初始参数，便于refresh的时候参数为初始参数
  const error = ref<Error>();

  let promiseService: (...args: R) => Promise<unknown>;
  if (['string', 'object'].includes(typeof service)) {
    // promiseService = requestMethod(service);
  } else {
    promiseService = (...args: R) => {
      return new Promise((resolve, reject) => {
        const returnedService = service(...args);
        const fn = returnedService;

        // 如果不是一个Promise
        if (!returnedService.then) {
          // fn = requestMethod(returnedService);
        }

        (fn as Promise<unknown>).then(resolve).catch(reject);
      });
    };
  }

  let loadingDelayTimer: ReturnType<typeof setTimeout>;
  let pollingTimer: ReturnType<typeof setInterval>;
  let pollingSinceFinishedTimer: ReturnType<typeof setInterval>;
  const errCount = ref(0); // 记录连续报错次数，用来中断轮询

  // function _run(): Promise<void | T>;
  function _run(...args: unknown[]) {
    if (!args.length) args = params.value;

    if (!ready.value) return Promise.resolve();

    if (loadingDelayTimer) clearTimeout(loadingDelayTimer);
    if (loadingDelay) {
      loadingDelayTimer = setTimeout(() => {
        loading.value = true;
      }, loadingDelay);
    } else {
      loading.value = true;
    }

    return promiseService(...(args as R))
      .then((res) => {
        const result = formatResult(res) as T;
        data.value = result;
        errCount.value = 0; // 重置错误次数
        error.value = undefined;
        onSuccess(result, params.value);
        return result;
      })
      .catch((err) => {
        error.value = err;
        errCount.value++;
        onError(err, params.value);
      })
      .finally(() => {
        if (loadingDelayTimer) clearTimeout(loadingDelayTimer);

        // 轮询方式二：根据上一次请求结束后开始轮询
        if (pollingInterval && pollingSinceLastFinished) {
          if (
            pollingErrorRetryCount === -1 ||
            errCount.value < pollingErrorRetryCount
          ) {
            pollingSinceFinishedTimer = setTimeout(() => {
              _run(...args);
            }, pollingInterval);
          }
        }

        loading.value = false;
        onFinally();
      });
  }

  let run = _run;
  // 节流
  if (throttleInterval) {
    const throttleRun = throttle(_run, throttleInterval);
    run = (...args) => {
      return Promise.resolve(throttleRun(...args));
    };
  }
  // 防抖
  if (debounceInterval) {
    const debounceRun = debounce(_run, debounceInterval);
    run = (...args) => {
      return Promise.resolve(debounceRun(...args));
    };
  }

  // 轮询方式一：根据时间间隔发起轮询
  if (pollingInterval && !pollingSinceLastFinished) {
    pollingTimer = setInterval(() => {
      run(...params.value);
    }, pollingInterval);
  }

  // 手动取消轮询
  function cancel() {
    if (loadingDelayTimer) clearTimeout(loadingDelayTimer);
    if (pollingTimer) clearInterval(pollingTimer);
    if (pollingSinceFinishedTimer) clearTimeout(pollingSinceFinishedTimer);
    loading.value = false;
  }

  // 重新执行service
  function refresh() {
    run(...params.value);
  }

  if (!manual) {
    watch(
      ready,
      () => {
        if (ready.value) run(...(defaultParams as R));
      },
      { immediate: true }
    );
  }

  // 轮询连续报错后，终止轮询操作
  watch(errCount, (newVal) => {
    if (pollingErrorRetryCount !== -1 && newVal >= pollingErrorRetryCount) {
      if (pollingTimer) clearInterval(pollingTimer);
    }
  });

  return { loading, data, error, params, refresh, run, cancel };
}
