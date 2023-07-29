<script setup lang="ts">
import { NEmpty, NIcon, NRow, NCol, NStatistic } from 'naive-ui';
import { Airplane } from '@vicons/ionicons5';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  detail: {
    type: Boolean,
    default: false
  },
  distance: {
    type: Number,
    default: 0
  },
  time: {
    type: Number,
    default: 0
  },
  fuel: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  }
})

const distance = computed(() => props.distance.toFixed(2))
const time = computed(() => props.time.toFixed(3))
const timeMinutes = computed(() => (props.time * 60).toFixed(2))
const fuel = computed(() => props.fuel.toFixed(2))
const percentage = computed(() => (props.percentage * 100).toFixed(2))
</script>

<template>
  <div>
    <NEmpty description="暂无数据" v-if="!props.show">
      <template #icon>
        <NIcon>
          <Airplane />
        </NIcon>
      </template>
    </NEmpty>
    <template v-else>
      <NRow>
        <NCol :span="12">
          <NStatistic label="飞行距离" :value="distance">
            <template #suffix> km</template>
          </NStatistic>
        </NCol>
      </NRow>
      <NRow>
        <NCol :span="12" v-if="props.detail">
          <NStatistic label="飞行时间">
            {{ time }} h
          </NStatistic>
        </NCol>
        <NCol :span="12" v-if="props.detail">
          <NStatistic label="飞行时间">
            {{ timeMinutes }} min
          </NStatistic>
        </NCol>
      </NRow>
      <NRow>
        <NCol :span="12" v-if="props.detail">
          <NStatistic label="所需燃料">
            {{ fuel }} kg
          </NStatistic>
        </NCol>
        <NCol :span="12" v-if="props.detail">
          <NStatistic label="所需燃料">
            {{ percentage }}%
          </NStatistic>
        </NCol>
      </NRow>
    </template>
  </div>
</template>
