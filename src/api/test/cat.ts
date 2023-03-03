import type { IAnyObj } from '@/types/common';
import request from '@/utils/http';

export const getCatImg = (data: IAnyObj) => {
  return request.http({
    url: 'https://api.thecatapi.com/v1/images/search',
    method: 'GET',
    header: {},
    data: data
  });
};
