<script setup lang="ts">
import { NList, NListItem, NWatermark, NUl, NLi, NThing, NSpace, NCard, NScrollbar } from 'naive-ui';
import MyMenu from '@/components/MyMenu.vue';
</script>

<template>
  <NWatermark show content="HIT | SoS: AirRescue" cross fullscreen :font-size="16" :line-height="16" :width="384"
    :height="384" :x-offset="12" :y-offset="60" :rotate="-15" />
  <MyMenu />
  <NSpace justify="center">
    <NCard style="width: 600px;">
      <NScrollbar style="max-height: 600px; height: 100%;">
        <NList>
          <NListItem>
            <NThing title="2023-8-11">
              <NUl>
                <NLi>添加航空器优先计算页面</NLi>
              </NUl>
            </NThing>
          </NListItem>
          <NListItem>
            <NThing title="2023-8-7">
              <NUl>
                <NLi>校赛位置信息变更</NLi>
              </NUl>
            </NThing>
          </NListItem>
          <NListItem>
            <NThing title="2023-8-7">
              <NUl>
                <NLi>更新页面优化</NLi>
                <NLi>浮点数显示优化</NLi>
                <NLi>更改地点“三门”类型</NLi>
              </NUl>
            </NThing>
          </NListItem>
          <NListItem>
            <NThing title="2023-8-4">
              <NUl>
                <NLi>修复航空器选择生成器添加按钮逻辑异常</NLi>
                <NLi>航空器选择生成器页面增加当前金额显示</NLi>
              </NUl>
            </NThing>
          </NListItem>
          <NListItem>
            <NThing title="2023-8-4">
              <NUl>
                <NLi>航空器选择生成器</NLi>
              </NUl>
            </NThing>
          </NListItem>
          <NListItem>
            <NThing title="2023-8-2">
              <NUl>
                <NLi>修复在连续距离计算中选择飞机类型，然后关闭详细计算，数据展示界面表格仍然为详细计算类型样式的 bug</NLi>
                <NLi>更改 Menu 样式</NLi>
                <NLi>部分按钮增加图标</NLi>
              </NUl>
            </NThing>
          </NListItem>
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
      </NScrollbar>
    </NCard>
  </NSpace>
</template>