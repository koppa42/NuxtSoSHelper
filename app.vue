<script setup lang="ts">
import { NConfigProvider, darkTheme, NGlobalStyle, NWatermark, NMessageProvider } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { NMenu } from 'naive-ui';
import { h, ref } from 'vue';
import { useRouter } from '.nuxt/vue-router';
const menuOptions: MenuOption[] = [
  {
    label: () => h('a', { to: '/distance/single' }, '单次距离计算'),
    key: '/distance/single'
  },
  {
    label: () => h('a', { to: '/distance/multiple' }, '连续距离计算'),
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
  <NuxtLayout>
    <NConfigProvider :theme="darkTheme">
      <NGlobalStyle />
      <NWatermark :show="true" content="HIT | SoS: AirRescue" cross fullscreen :font-size="16" :line-height="16" :width="384"
        :height="384" :x-offset="12" :y-offset="60" :rotate="-15" />
      <NMenu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
      <NMessageProvider>
        <NuxtPage />
      </NMessageProvider>
    </NConfigProvider>
  </NuxtLayout>
</template>

<style>
body {
  background-color: rgb(16, 16, 20);
}
</style>