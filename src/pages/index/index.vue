<template>
  <view class="content">
    <image class="logo" :src="bg1" />
    <view class="text-area">
      <text class="title">{{ title }}1</text>
    </view>
    <button type="primary" :loading="true">123</button>
    <!-- <SvgIcon name="icon-1" width="50" height="50"></SvgIcon> -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import bg1 from '@images/logo.png';

const title = ref('Hello');

const val = '123';
</script>

<style lang="scss">
.content {
}
</style>
