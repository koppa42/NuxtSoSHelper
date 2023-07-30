<script setup lang="ts">
import { NSelect, SelectGroupOption, SelectOption, NInputNumber, NButtonGroup, NButton, NCard } from 'naive-ui';
import { usePositionStore } from '@/store/position';
import { useAircraftStore } from '@/store/aircraft';

const positionStore = usePositionStore();
const aircraftStore = useAircraftStore();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'confirm', task: string, data: number): void
}>();

const airTaskType = ['绞车投放', '吊运', '卸载', '绞车转移', '绞车转运', '取水', '灭火', '侦查搜寻'];
const landTaskType = ['装载', '卸货', '运送', '投放', '转移', '安置', '转运', '交接', '加油保障'];

const props = defineProps({
  position: {
    type: String
  },
  aircraft: {
    type: String
  }
})

const canDoTasks = computed(() => {
  if (props.position === undefined || props.aircraft === undefined) {
    return [];
  }
  const position = positionStore.getByName(props.position);
  const aircraft = aircraftStore.getByName(props.aircraft);
  if (position === undefined || aircraft === undefined) {
    return [];
  }

  const maybeTasks = aircraftStore.getPossibleTaskByName(aircraft.name)!;
  if (position.location == "Sea" && !aircraft.ability.includes("海上")) {
    return []
  }
  return maybeTasks;
})

const selectOptions = computed(() => {
  const options: Array<SelectOption | SelectGroupOption> = [
    {
      type: 'group',
      label: '地面',
      key: 'land',
      children: canDoTasks.value.filter((item) => landTaskType.includes(item)).map((item) => ({
        label: item,
        value: item
      }))
    },
    {
      type: 'group',
      label: '空中',
      key: 'air',
      children: canDoTasks.value.filter((item) => airTaskType.includes(item)).map((item) => ({
        label: item,
        value: item
      }))
    }
  ]
  return options;
})

const showData = computed(() => {
  if (selectedTask.value === undefined) {
    return false;
  }
  if (selectedTask.value !== "加油保障") {
    return true;
  } else {
    return false;
  }
})

const dataTip = computed(() => {
  if (selectedTask.value === undefined && selectedTask.value !== "加油保障") {
    return undefined;
  }
  switch (selectedTask.value) {
    case '装载':
    case '卸货':
      return '请输入货物数量 (kg)：';
    case '运送':
    case '投放':
    case '绞车投放':
      return '请输入人员数目 (人）：';
    case '吊运':
    case '卸载':
      return '请输入设备数目 (台)：';
    case '转移':
    case '绞车转移':
    case '安置':
      return '请输入灾民数目 (人)：';
    case '转运':
    case '绞车转运':
    case '交接':
      return '请输入伤患数目 (人)：';
    case '取水':
    case '灭火':
      return '请输入水量 (1000 kg)：';
    case '侦查搜寻':
      return '请输入搜寻范围 (km²)：'
    default:
      return '请输入数据：'
  }
})

const selectedTask = ref<string | undefined>(undefined);
const taskValue = ref<number>(0);
const valueMax = computed(() => {
  if (selectedTask.value === undefined) {
    return 0;
  }
  if (props.position === undefined || props.aircraft === undefined) {
    return 0;
  }
  const position = positionStore.getByName(props.position);
  const aircraft = aircraftStore.getByName(props.aircraft);
  if (position === undefined || aircraft === undefined) {
    return 0;
  }
  switch (selectedTask.value) {
    case '装载':
    case '卸货':
      return aircraft.max_internal_load;
    case '运送':
    case '投放':
    case '绞车投放':
      return aircraft.max_capacity;
    case '吊运':
    case '卸载':
      return Math.floor(aircraft.max_external_load / 10000);
    case '转移':
    case '绞车转移':
    case '安置':
      return aircraft.max_capacity;
    case '转运':
    case '绞车转运':
    case '交接':
      return aircraft.max_capacity;
    case '取水':
    case '灭火':
      return aircraft.max_external_load / 10000;
    case '侦查搜寻':
      return 10000;
    default:
      return 0;
  }
})

const dataSuffix = computed(() => {
  if (selectedTask.value === undefined) {
    return undefined;
  }
  switch (selectedTask.value) {
    case '装载':
    case '卸货':
      return 't';
    case '运送':
    case '投放':
    case '绞车投放':
      return '人';
    case '吊运':
    case '卸载':
      return '台';
    case '转移':
    case '绞车转移':
    case '安置':
      return '人';
    case '转运':
    case '绞车转运':
    case '交接':
      return '人';
    case '取水':
    case '灭火':
      return 't';
    default:
      return undefined;
  }
})

</script>

<template>
  <NCard title="添加任务" style="width: 46%;" role="dialog" aria-modal="true">
    <div style="margin-bottom: 16px;">
      <div class="mbox">
        <span>任务类型：</span>
        <NSelect v-model:value="selectedTask" placeholder="请选择任务类型" style="width: 50%;" :options="selectOptions" />
      </div>
      <div class="mbox" v-if="showData">
        <div style="margin-bottom: 8px;">
          <sapn>{{ dataTip }}</sapn>
          <NButton quaternary type="info" @click="taskValue = valueMax">最大</NButton>
        </div>
        <NInputNumber placeholder="请输入数据" style="width: 50%;" :min="0" :max="valueMax" v-model:value="taskValue">
          <template #suffix>
            {{ dataSuffix }}
          </template>
        </NInputNumber>
      </div>
    </div>
    <template #footer>
      <div style="text-align: right;">
        <NButtonGroup>
          <NButton type="error" strong secondary @click="$emit('close')">取消</NButton>
          <NButton type="primary" @click="$emit('confirm', selectedTask, taskValue);">确定</NButton>
        </NButtonGroup>
      </div>
    </template>
  </NCard>
</template>

<style scoped>
.mbox {
  margin-bottom: 16px;
}
</style>