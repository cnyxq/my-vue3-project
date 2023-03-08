<template>
  <view class="content">
    <image class="logo" :src="bg1" />
    <view class="text-area">
      <text class="title">{{ title }}1</text>
    </view>
    <view>data:{{ data }}</view>
    <view>params:{{ params }}</view>
    <view>error:{{ error }}</view>
    <button type="primary" :loading="loading">123</button>
    <SvgIcon name="icon-1" width="50" height="50"></SvgIcon>
    <button @click="getCatImgRun()">请求</button>
    <view>{{ count }}</view>
    <button @click="addCount">无防抖</button>
    <button @click="testDebounce">测试防抖</button>
    <view
      >当前页数：{{ pagination.current }}当前分页数量：{{
        pagination.pageSize
      }}</view
    >
    <button @click="pagination.current += 1">分页+1</button>
    <button @click="pagination.pageSize += 1">分页数量+1</button>
  </view>
</template>

<script setup lang="ts">
import { ref, unref } from 'vue';

import bg1 from '@images/logo.png';
import { test } from '@/utils/cookies';
import { useRequest } from '@/hooks/useRequest';
import { usePaginatedRequest } from '@/hooks/usePaginatedRequest';
import { debounce, throttle } from 'lodash';
import { getCatImg } from '@/api/test/cat';

const title = ref('Hello');

const val = '123';

test();

// function testFn2() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject('testFn2: 123');
//     }, 4000);
//   });
// }
// const { data: data1 } = useRequest(testFn2, {
//   pollingInterval: 2000,
//   pollingSinceLastFinished: true,
//   pollingErrorRetryCount: 5,
//   onError: (err, params) => {
//     console.log(err, params);
//   }
// });
const {
  data,
  loading,
  params,
  error,
  run: getCatImgRun
} = useRequest(
  function (limit: number, size: string) {
    return getCatImg({ limit: limit, size: size });
  },
  {
    manual: true,
    defaultParams: [1, 'full']
  }
);

const {
  data: pData,
  pagination,
  params: pparams
} = usePaginatedRequest(
  function (pagination, arg1, arg2) {
    console.log(pagination, arg1, arg2);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ total: 1, data: [] });
      }, 1500);
    });
  },
  {
    defaultParams: [1, 2]
  }
);

let count = ref(0);
function addCount() {
  count.value += 1;
}
const testDebounce = throttle(addCount, 1000);
</script>

<style lang="scss"></style>
