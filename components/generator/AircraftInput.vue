<script setup lang="ts">
import { NCard, NTabs, NTabPane, NSpace, NButton, NScrollbar, NTag } from 'naive-ui';
import { useAircraftStore } from '@/store/aircraft';

const emit = defineEmits<{
  (e: 'add', aircraft: string): void
}>();

const props = defineProps<{
  total: number,
  now: number,
}>();

const allow = (price: number) => {
  return props.now + price <= props.total;
}

const aircraftStore = useAircraftStore();
const aircraftType = ['Helicopter', 'FixedWing']
const aircraftTypeName = ['直升机', '固定翼飞机']
</script>
<template>
  <NCard title="添加地点">
    <NTabs type="line" animated>
      <NTabPane v-for="(type, index) in aircraftType" :name="type" :tab="aircraftTypeName[index]">
        <NScrollbar style="max-height: 500px;">
          <NSpace>
            <NCard v-for="aircraft in aircraftStore.default.filter((val) => val.type === type)" :key="aircraft.name"
              :title="aircraft.name" bordered hoverable>
              <div class="cbox">
                <NTag type="info">{{ aircraft.price }} 亿</NTag>
              </div>
              <NButton text type="primary" @click="emit('add', aircraft.name)" :disabled="!allow(aircraft.price)">添加</NButton>
            </NCard>
          </NSpace>
        </NScrollbar>
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<style scoped>
/* .n-card .n-card {
  max-width: 220px;
} */

.cbox {
  margin-bottom: 6px;
}
</style>