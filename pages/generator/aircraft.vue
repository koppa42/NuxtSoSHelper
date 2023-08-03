<script setup lang="ts">
import { NWatermark, NCard, NInputNumber, NThing, useDialog, NButton } from 'naive-ui';
import { useAircraftStore } from '@/store/aircraft';
import MyMenu from '@/components/MyMenu.vue';
import AircraftInput from '@/components/generator/AircraftInput.vue';
import AircraftList, { AircraftItem } from '@/components/generator/AircraftList.vue';
import { v4 as uuidv4 } from 'uuid';

const aircraftStore = useAircraftStore();
const dialog = useDialog();

const total = ref<number>(10);
const now = ref<number>(0);
const value = ref<AircraftItem[]>([]);

const handleAdd = (name: string) => {
  const aircraft = aircraftStore.default.find((val) => val.name === name);
  if (aircraft === undefined) {
    dialog.error({
      title: '错误',
      content: '飞机不存在',
      positiveText: "确定",
      onPositiveClick: () => { }
    });
    return;
  }

  value.value.push({
    uuid: uuidv4(),
    name: aircraft.name,
    locked: false,
    price: aircraft.price,
  });
  now.value += aircraft.price;
}

const handleDelete = (idx: number) => {
  const aircraft = value.value[idx];
  if (aircraft.locked) {
    dialog.error({
      title: '错误',
      content: '该飞机已被锁定',
      positiveText: "确定",
      onPositiveClick: () => { }
    });
    return;
  }

  value.value.splice(idx, 1);
  now.value -= aircraft.price;
}

const handleLock = (idx: number) => {
  value.value[idx].locked = !value.value[idx].locked;
}

const generate = () => {
  // 删除未锁定的所有飞机
  value.value = value.value.filter((val) => val.locked);
  const lockMoney = value.value.reduce((prev, cur) => prev + cur.price, 0);
  let leftMoney = total.value - lockMoney;

  const allAircraft = aircraftStore.default;

  while (leftMoney > 0) {
    // 获取比剩余预算小的飞机
    const lowAircrafts = allAircraft.filter((val) => val.price <= leftMoney);
    if (lowAircrafts.length <= 0) {
      break;
    } else {
      const idx = Math.floor(Math.random() * lowAircrafts.length);
      const aircraft = lowAircrafts[idx];
      value.value.push({
        uuid: uuidv4(),
        name: aircraft.name,
        locked: false,
        price: aircraft.price,
      });
      leftMoney -= aircraft.price;
    }
  }
  now.value = value.value.reduce((prev, cur) => prev + cur.price, 0);
}

const handleRandom = () => {
  dialog.info({
    title: '提示',
    content: '确定要开生成吗？',
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      generate();
    },
    onNegativeClick: () => { }
  })
}

const handleSiwtch = (val: number | null) => {
  const all = value.value.reduce((prev, cur) => prev + cur.price, 0);
  if (val === null) {
    dialog.error({
      title: '错误',
      content: '总预算不能为空',
      positiveText: "确定",
      onPositiveClick: () => { }
    })
    total.value = all;
    return;
  }
  if (val < all) {
    dialog.error({
      title: '错误',
      content: '总预算不能小于已选飞机的总价',
      positiveText: "确定",
      onPositiveClick: () => { }
    })
    total.value = all;
    return;
  }
  total.value = val;
}
</script>

<template>
  <NWatermark show content="HIT | SoS: AirRescue" cross fullscreen :font-size="16" :line-height="16" :width="384"
    :height="384" :x-offset="12" :y-offset="60" :rotate="-15" />
  <MyMenu />

  <div>
    <div class="hcenter">
      <div class="lbox">
        <NButton type="primary" @click="handleRandom">
          开始生成
        </NButton>
        <span style="margin-right: 16px; margin-left: 16px;">总预算</span>
        <NInputNumber v-model:value="total" :min="0" style="display: inline-block; width: 200px;" :clearable="false"
          :on-update:value="(val) => handleSiwtch(val)" :precision="2">
          <template #prefix>¥</template>
          <template #suffix>亿</template>
        </NInputNumber>
        <sapn style="margin-left: 16px;">当前金额：{{ now.toFixed(2) }} 亿</sapn>
        <AircraftList :aircraft-list="value" style="margin-top: 16px;" @delete="handleDelete" @lock="handleLock" />
      </div>
      <div class="rbox">
        <AircraftInput :total="total" :now="now" @add="handleAdd" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hcenter {
  display: flex;
  justify-content: center;
}

.lbox {
  width: 34%;
  margin-right: 8px;
}

.rbox {
  width: 36%;
}
</style>