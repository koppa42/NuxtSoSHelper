<template>
  <div class="mbox">
    出发地点：
    <NSelect :options="positionOptions" v-model:value="fromValue" placeholder="请选择出发地点" />
  </div>
  <div class="mbox">
    目的地点：
    <NSelect :options="positionOptions" v-model:value="toValue" placeholder="请选择到目的地"/>
  </div>
  <div class="mbox">
    更详细的计算：
    <NSwitch v-model:value="showDetail" />
  </div>
  <div class="mbox" v-if="showDetail">
    飞机类型：
    <NSelect :options="aircraftOptions" v-model:value="aircraftValue" placeholder="请选择飞机类型"/>
  </div>
  <div class="mbox last">
    <NButton type="primary" @click="handleClick">
      计算
    </NButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMessage, NSelect, SelectOption, SelectGroupOption, NSwitch, NButton } from 'naive-ui';
import { usePositionStore } from '@/store/position';
import { useAircraftStore } from '@/store/aircraft';

const positionStore = usePositionStore();
const aircraftStore = useAircraftStore();

const fromValue = ref<string | undefined>(undefined);
const toValue = ref<string | undefined>(undefined);
const showDetail = ref<boolean>(false);
const aircraftValue = ref<string | undefined>(undefined);

const message = useMessage();

const emit = defineEmits<{
  (e: 'calLess', from: string, to: string): void,
  (e: 'calMore', from: string, to: string, aircraft: string): void
}>();

const positionOptions = computed(() => {
  const options: Array<SelectOption | SelectGroupOption> = [
    {
      type: 'group',
      label: '机场',
      key: 'airport',
      children: positionStore.default.filter((item) => item.type === 'Airport').map((item) => ({
        label: item.name,
        value: item.name
      }))
    },
    {
      type: 'group',
      label: '集结点',
      key: 'source',
      children: positionStore.default.filter((item) => item.type === 'Source').map((item) => ({
        label: item.name,
        value: item.name
      }))
    },
    {
      type: 'group',
      label: '安置点',
      key: 'destination',
      children: positionStore.default.filter((item) => item.type === 'Destination').map((item) => ({
        label: item.name,
        value: item.name
      }))
    },
    {
      type: 'group',
      label: '灾区',
      key: 'disasterArea',
      children: positionStore.default.filter((item) => item.type === 'DisasterArea').map((item) => ({
        label: item.name,
        value: item.name
      }))
    }, {
      type: 'group',
      label: '医院',
      key: 'hospital',
      children: positionStore.default.filter((item) => item.type === 'Hospital').map((item) => ({
        label: item.name,
        value: item.name
      }))
    }
  ]
  return options;
})

const aircraftOptions = computed(() => {
  const options: Array<SelectOption | SelectGroupOption> = [
    {
      type: 'group',
      label: '直升机',
      key: 'Helicopter',
      children: aircraftStore.default.filter((item) => item.type === 'Helicopter').map((item) => ({
        label: item.name,
        value: item.name
      }))
    },
    {
      type: 'group',
      label: '固定翼飞机',
      key: 'FixedWing',
      children: aircraftStore.default.filter((item) => item.type === 'FixedWing').map((item) => ({
        label: item.name,
        value: item.name
      }))
    }
  ]
  // console.log(options)
  return options;
})

const handleClick = () => {
  if (fromValue.value === undefined) {
    message.error('请选择出发地点');
    return;
  }
  if (toValue.value === undefined) {
    message.error('请选择目的地点');
    return;
  }
  if (showDetail.value && aircraftValue.value === undefined) {
    message.error('请选择飞机类型');
    return;
  }
  if (showDetail.value) {
    emit('calMore', fromValue.value, toValue.value, aircraftValue.value!);
  } else {
    emit('calLess', fromValue.value, toValue.value);
  }
}

</script>

<style scoped>
.mbox {
  margin-top: 16px;
}

.last {
  text-align: right;
}
</style>