<script setup lang="ts">
import { NList, NListItem, NWatermark, NUl, NLi, NThing, NSpace, NCard } from 'naive-ui';
import MyMenu from '@/components/MyMenu.vue';
</script>

<template>
  <NWatermark show content="HIT | SoS: AirRescue" cross fullscreen :font-size="16" :line-height="16" :width="384"
    :height="384" :x-offset="12" :y-offset="60" :rotate="-15" />
  <MyMenu />
  <NSpace justify="center">
    <NCard  style="width: 600px;">
      <NList>
        <NListItem>
          <NThing title="2023-8-2">
            <NUl>
              <NLi>更改取水和灭火标签显示的单位</NLi>
            </NUl>
          </NThing>
        </NListItem>
        <NListItem>
          <NThing title="2023-8-2">
            <NUl>
              <NLi>连续距离计算结果历史记录</NLi>
              <NLi>修复灭火和取水计算错误</NLi>
            </NUl>
          </NThing>
        </NListItem>
        <NListItem>
          <NThing title="2023-7-30">
            <NUl>
              <NLi>连续距离计算</NLi>
            </NUl>
          </NThing>
        </NListItem>
        <NListItem>
          <NThing title="2023-7-29">
            <NUl>
              <NLi>单次距离计算</NLi>
            </NUl>
          </NThing>
        </NListItem>
      </NList>
    </NCard>
  </NSpace>
</template>