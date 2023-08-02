<script setup lang="ts">
import { NMenu, NIcon } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { h, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { PaperPlaneOutline, BookmarkOutline, RepeatOutline, ReturnUpForwardOutline } from '@vicons/ionicons5';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: 'SoSHelper',
    key: '/',
    disabled: true,
  },
  {
    label: '距离计算',
    key: '/distance',
    icon: renderIcon(PaperPlaneOutline),
    children: [
      {
        label: () => h(RouterLink, { to: '/distance/single' }, { default: () => '单次距离计算' }),
        key: '/distance/single',
        icon: renderIcon(ReturnUpForwardOutline)
      },
      {
        label: () => h(RouterLink, { to: '/distance/multiple' }, { default: () => '连续距离计算' }),
        key: '/distance/multiple',
        icon: renderIcon(RepeatOutline)
      },
    ]
  },
  {
    label: () => h(RouterLink, { to: '/update' }, { default: () => '更新日志' }),
    key: '/update',
    icon: renderIcon(BookmarkOutline)
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