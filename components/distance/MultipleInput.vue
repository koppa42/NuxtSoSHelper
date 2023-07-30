<script setup lang="ts">
import { NCard, NTabs, NTabPane, NSpace, NButton } from 'naive-ui';
import { usePositionStore } from '@/store/position';

const emit = defineEmits<{
  (e: 'add', position: string): void
}>();

const positionStore = usePositionStore();
const positionType = ['Airport', 'Source', 'Destination', 'DisasterArea', 'Hospital']
const positionTypeName = ['机场', '集结点', '安置点', '灾区', '医院']
</script>
<template>
  <NCard title="添加地点">
    <NTabs type="line" animated>
      <NTabPane v-for="(type, index) in positionType" :name="type" :tab="positionTypeName[index]">
        <NSpace>
          <NCard v-for="position in positionStore.default.filter((val) => val.type === type)" :key="position.name"
            :title="position.name" bordered hoverable>
          <NButton text type="primary" @click="emit('add', position.name)">添加</NButton>
          </NCard>
        </NSpace>
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<style scoped>
/* .n-card .n-card {
  max-width: 220px;
} */
</style>