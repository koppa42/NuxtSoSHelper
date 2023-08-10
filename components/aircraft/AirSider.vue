<script setup lang="ts">
import { NList, NListItem, NScrollbar, NTabs, NTabPane, NIcon, NTooltip } from 'naive-ui';
import { type VNodeChild, h } from 'vue';
import { AirplaneOutline, TimeOutline } from '@vicons/ionicons5';
import AircraftShow from '@/components/aircraft/AircraftShow.vue';
import { useEditorStore } from '@/store/editor';
import AircraftTimeline from '@/components/aircraft/AircraftTimeline.vue';

const editorStore = useEditorStore();
</script>

<template>
  <div class="mcontainer">
    <NTabs animated placement="left" type="line">
      <NTabPane name="aircraft">
        <template #tab>
          <NTooltip placement="right" trigger="hover">
            <template #trigger>
              <NIcon size="24">
                <AirplaneOutline />
              </NIcon>
            </template>
            航空器列表
          </NTooltip>
        </template>
        <AircraftShow />
      </NTabPane>
      <NTabPane name="test">
        <template #tab>
          <NTooltip placement="right" trigger="hover">
            <template #trigger>
              <NIcon size="24">
                <TimeOutline />
              </NIcon>
            </template>
            时间轴
          </NTooltip>
        </template>
        <AircraftTimeline />
      </NTabPane>
    </NTabs>
  </div>
</template>

<style scoped>
.mcontainer {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
</style>