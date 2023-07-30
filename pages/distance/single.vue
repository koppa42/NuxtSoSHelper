<template>
  <NWatermark show content="HIT | SoS: AirRescue" cross fullscreen :font-size="16" :line-height="16" :width="384"
    :height="384" :x-offset="12" :y-offset="60" :rotate="-15" />
  <MyMenu />
  <NGrid x-gap="12" :cols="9" layout-shift-disabled>
    <NGridItem span="4" offset="2">
      <SingleInput @cal-less="handleLess" @cal-more="handleMore" />
    </NGridItem>
    <NGridItem span="3" offset="1">
      <SingleOutput :show="show" :detail="detail" :distance="distance" :time="time" :fuel="fuel"
        :percentage="percentage" />
    </NGridItem>
  </NGrid>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NGrid, NGridItem, useMessage, NWatermark } from 'naive-ui';
import SingleInput from '@/components/distance/SingleInput.vue';
import SingleOutput from '@/components/distance/SingleOutput.vue';
import { usePositionStore } from '@/store/position';
import { useAircraftStore } from '@/store/aircraft';
import MyMenu from '@/components/MyMenu.vue';

const show = ref<boolean>(false);
const detail = ref<boolean>(false);
const distance = ref<number>(0);
const time = ref<number>(0);
const fuel = ref<number>(0);
const percentage = ref<number>(0);

const message = useMessage();
const positionStore = usePositionStore();
const aircraftStore = useAircraftStore();

const handleLess = (from: string, to: string) => {
  detail.value = false;
  show.value = true;

  const posFrom = positionStore.getByName(from);
  const posTo = positionStore.getByName(to);
  if (posFrom === undefined || posTo === undefined) {
    message.error('未找到地点数据，请稍后重试');
    return;
  }

  console.log(posFrom, posTo);
  distance.value = calDistance(posFrom.longitude, posFrom.latitude, posTo.longitude, posTo.latitude);
}

const handleMore = (from: string, to: string, aircraft: string) => {
  detail.value = true;
  show.value = true;

  const posFrom = positionStore.getByName(from);
  const posTo = positionStore.getByName(to);
  const ac = aircraftStore.getByName(aircraft);
  if (posFrom === undefined || posTo === undefined) {
    message.error('未找到地点数据，请稍后重试');
    return;
  }
  if (ac === undefined) {
    message.error('未找到飞机数据，请稍后重试');
    return;
  }

  distance.value = calDistance(posFrom.longitude, posFrom.latitude, posTo.longitude, posTo.latitude);
  time.value = distance.value / ac.cruising_speed;
  fuel.value = time.value * ac.fuel_consumption_per_unit_time;
  percentage.value = fuel.value / ac.max_fuel;
}
</script>