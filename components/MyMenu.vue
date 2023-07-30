<script setup lang="ts">
import { NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { h, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: '/distance/single' }, {default: () => '单次距离计算'}),
    key: '/distance/single'
  },
  {
    label: () => h(RouterLink, { to: '/distance/multiple' }, {default: () => '连续距离计算'}),
    key: '/distance/multiple'
  }
]

const activeKey = ref<string | null>(null);
const router = useRouter();
router.isReady().then(() => {
  activeKey.value = router.currentRoute.value.fullPath;
  // console.log(router.currentRoute.value.fullPath)
});
</script>

<template>
  
  <NMenu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
</template>