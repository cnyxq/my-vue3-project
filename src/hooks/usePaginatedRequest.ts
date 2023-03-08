import { ref, watch } from 'vue';
import { useRequest } from '@/hooks/useRequest';
import type { OptionsType } from '@/hooks/useRequest';

type PaginationParamsType = unknown[];

type PaginationResultType = {
  total: number;
  data: unknown;
};

type PaginatedCombineService = (
  ...args: PaginationParamsType
) => Promise<PaginationResultType>;

interface UsePaginatedRequestOptions
  extends OptionsType<PaginationResultType, PaginationParamsType> {
  defaultPagination: {
    current: number;
    pageSize: number;
  };
}

const defaultPagination = {
  current: 1,
  pageSize: 10
};
export function usePaginatedRequest(
  service: PaginatedCombineService,
  options: Partial<UsePaginatedRequestOptions> = {}
) {
  const finalOptions = { defaultPagination, ...options };

  const pagination = ref({
    current: finalOptions.defaultPagination.current,
    pageSize: finalOptions.defaultPagination.pageSize,
    total: 0,
    totalPage: 0
  });

  const { data, params, run } = useRequest<
    PaginationResultType,
    PaginationParamsType
  >(service, {
    ...finalOptions,
    defaultParams: [
      {
        current: pagination.value.current,
        pageSize: pagination.value.pageSize
      },
      ...finalOptions.defaultParams!
    ],
    onSuccess: (data, params) => {
      pagination.value.total = 10;
      pagination.value.totalPage = 1;
      if (finalOptions.onSuccess) finalOptions.onSuccess(data, params);
    }
  });

  watch(
    [() => pagination.value.current, () => pagination.value.pageSize],
    () => {
      run(
        {
          current: pagination.value.current,
          pageSize: pagination.value.pageSize
        },
        ...params.value.slice(1)
      );
    }
  );

  return { data, pagination, params };
}
