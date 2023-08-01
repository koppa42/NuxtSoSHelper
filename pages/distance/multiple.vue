<script setup lang="ts">
import { NWatermark, NSwitch, SelectGroupOption, NSelect, SelectOption, NModal, useMessage, NButton, useDialog, NButtonGroup, NIcon, NDrawer, NDrawerContent } from 'naive-ui';
import MyMenu from '@/components/MyMenu.vue';
import MultipleShow from '@/components/distance/MultipleShow.vue';
import TaskChoice from '@/components/distance/TaskChoice.vue';
import MultipleInput from '@/components/distance/MultipleInput.vue';
import MultipleDisplay, { DataItem } from '@/components/distance/MultipleDisplay.vue';
import MultipleHistory, { HistoryItem } from '@/components/distance/MultipleHistory.vue';
import { ref } from 'vue';
import { Aircraft, TaskType, useAircraftStore } from '@/store/aircraft';
import { usePositionStore } from '@/store/position';
import { HourglassOutline } from '@vicons/ionicons5';
import { useStorage } from '@vueuse/core';

export interface ShowDataItem {
  name: string,
  doTask?: boolean,
  taskType?: TaskType,
  value?: number
}

const airTaskType = ['绞车投放', '吊运', '卸载', '绞车转移', '绞车转运', '取水', '灭火', '侦查搜寻'];
const message = useMessage();
const positionStore = usePositionStore();
const dialog = useDialog();

const data = ref<ShowDataItem[]>([]);
const aircraft = ref<string | undefined>(undefined);
aircraft.value = 'AW169 医疗型';

const handleUp = (idx: number) => {
  const temp = data.value[idx];
  data.value[idx] = data.value[idx - 1];
  data.value[idx - 1] = temp;
}

const handleDown = (idx: number) => {
  const temp = data.value[idx];
  data.value[idx] = data.value[idx + 1];
  data.value[idx + 1] = temp;
}

const handleDelete = (idx: number) => {
  data.value.splice(idx, 1);

  if (showDetail.value && data.value[0].doTask && data.value[0]?.taskType !== '加油保障') {
    data.value[idx].taskType = undefined;
    data.value[idx].value = undefined;
    data.value[idx].doTask = false;

    message.error('出发地点只能进行加油保障任务');
  }
}

const handleAddTask = (idx: number) => {
  if (idx === 0) {
    data.value[0].doTask = true;
    data.value[0].taskType = '加油保障';
    return;
  }
  currentPosition.value = data.value[idx].name;
  currentPosIndex.value = idx;
  showModal.value = true;
}

const handleChangeTask = (idx: number) => {
  currentPosition.value = data.value[idx].name;
  currentPosIndex.value = idx;
  showModal.value = true;
}

const handleDeleteTask = (idx: number) => {
  data.value[idx].taskType = undefined;
  data.value[idx].value = undefined;
  data.value[idx].doTask = false;
}

const handleModalSure = (task: string, dat: number) => {
  showModal.value = false;

  if (task === '加油保障') {
    data.value[currentPosIndex.value].doTask = true;
    data.value[currentPosIndex.value].taskType = '加油保障';
    return;
  } else {
    if (dat === 0) {
      message.error('所选数据不能为 0');
      return;
    } else {
      data.value[currentPosIndex.value].doTask = true;
      data.value[currentPosIndex.value].taskType = task as TaskType;
      data.value[currentPosIndex.value].value = dat;
    }
  }
}

const handleClear = () => {
  dialog.error({
    title: "注意",
    content: "确定要清空所有的地点吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      data.value = [];
      message.success('清空成功');
    },
    onNegativeClick: () => { }
  })
}

const showModal = ref<boolean>(false);
const showResult = ref<boolean>(false);


const currentPosIndex = ref<number>(0);
const currentPosition = ref<string | undefined>(undefined);
const showDetail = ref<boolean>(false);
const aircraftValue = ref<string | undefined>(undefined);
const aircraftStore = useAircraftStore();
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
const useAircraft = computed(() => showDetail.value === true && aircraftValue.value !== undefined);

const handleAdd = (name: string) => {
  if (positionStore.getByName(name) === undefined) {
    message.error('不存在的地点');
    return;
  }
  data.value.push({
    name
  });
}

const handleCalculate = () => {
  showData.value = []
  if (data.value.length === 0) return;

  const detail = showDetail.value && aircraftValue.value !== undefined;
  let aircraft: Aircraft | undefined = undefined;
  if (detail) {
    aircraft = aircraftStore.getByName(aircraftValue.value as string)
    if (aircraft === undefined) {
      message.error('无法找到飞机数据');
      return;
    }
  }

  let total_fuel = 0
  let total_time = 0
  let total_distance = 0
  let total_fly_time = 0
  let last_position = positionStore.getByName(data.value[0].name);
  if (last_position === undefined) {
    message.error('无法找到地点数据');
    return;
  }

  for (let i = 0; i < data.value.length; i++) {
    const position = positionStore.getByName(data.value[i].name);
    if (position === undefined) {
      message.error('无法找到地点数据');
      return;
    }
    if (i === 0) {
      // 第一个地点
      if (detail) {
        // 是否执行任务
        if (data.value[0].doTask === true) {
          showData.value.push({
            name: position.name,
            position: {
              longitude: position.longitude,
              latitude: position.latitude
            },
            flyTime: 0,
            flyTotalTime: 0,
            doTask: true,
            taskType: '加油保障',
            taskTime: aircraft!.fuel_fill_time,
            taskTotalTime: aircraft!.fuel_fill_time,
          })
          total_time += aircraft!.fuel_fill_time;
        } else {
          showData.value.push({
            name: position.name,
            position: {
              longitude: position.longitude,
              latitude: position.latitude
            },
            flyTime: 0,
            flyTotalTime: 0,
          })
        }
      } else {
        showData.value.push({
          name: position.name,
          position: {
            longitude: position.longitude,
            latitude: position.latitude
          }
        })
      }
    } else {
      // 其他地点
      const distance = calDistance(last_position.longitude, last_position.latitude, position.longitude, position.latitude);
      if (detail) {
        total_distance += distance;
        const time = distance / aircraft!.cruising_speed * 3600;
        total_time += time;
        const fuel = time * aircraft!.fuel_consumption_per_unit_time / 3600;
        total_fuel += fuel;
        const flyTime = time;
        total_fly_time += flyTime;
        if (data.value[i].doTask) {
          // 执行任务
          let task_time = 0;
          switch (data.value[i].taskType) {
            case '装载':
            case '卸货':
              task_time = aircraft!.supply_load_time * data.value[i].value!;
              break;
            case '运送':
            case '投放':
            case '转移':
            case '安置':
              task_time = aircraft!.person_on_off_time * data.value[i].value!;
              break;
            case '绞车投放':
            case '绞车转移':
              task_time = aircraft!.winch_person_time * data.value[i].value!;
              break;
            case '吊运':
            case '卸载':
              task_time = aircraft!.device_load_time * data.value[i].value!;
              break;
            case '转运':
            case '交接':
              task_time = aircraft!.patient_on_off_time * data.value[i].value!;
              break;
            case '绞车转运':
              task_time = aircraft!.winch_patient_time * data.value[i].value!;
              break;
            case '取水':
              task_time = aircraft!.water_load_time / (aircraft!.max_external_load / 1000) * data.value[i].value!;
              break;
            case '灭火':
              task_time = aircraft!.extinguishing_time / (aircraft!.max_external_load / 1000) * data.value[i].value!;
              break;
            case '加油保障':
              task_time = aircraft!.fuel_fill_time;
              break;
            case '侦查搜寻':
              task_time = aircraft!.search_time * data.value[i].value!;
              break;
            default:
              return 0;
          }
          showData.value.push({
            name: position.name,
            position: {
              longitude: position.longitude,
              latitude: position.latitude
            },
            flyTime: flyTime,
            flyTotalTime: total_fly_time,
            distance: distance,
            totalDistance: total_distance,
            fuel: fuel,
            total_fuel: total_fuel,
            time: time,
            total_time: total_time,
            doTask: true,
            taskType: data.value[i].taskType as TaskType,
            taskTime: task_time,
            taskTotalTime: task_time + total_time,
            taskFuel: airTaskType.includes(data.value[i].taskType!) ? task_time * aircraft!.fuel_consumption_per_unit_time / 3600 : undefined,
            taskTotalFuel: airTaskType.includes(data.value[i].taskType!) ? task_time * aircraft!.fuel_consumption_per_unit_time / 3600 + total_fuel : undefined,
            taskFlyTime: airTaskType.includes(data.value[i].taskType!) ? task_time : undefined,
            taskTotalFlyTime: airTaskType.includes(data.value[i].taskType!) ? task_time + total_time : undefined,
          })
          total_time += task_time;
          if (airTaskType.includes(data.value[i].taskType!)) {
            total_fuel += task_time * aircraft!.fuel_consumption_per_unit_time / 3600;
            total_fly_time += task_time;
          }
          if (data.value[i].taskType === '加油保障') {
            total_fuel = 0;
          }
        } else {
          // 不执行任务
          showData.value.push({
            name: position.name,
            position: {
              longitude: position.longitude,
              latitude: position.latitude
            },
            distance: distance,
            totalDistance: total_distance,
            fuel: fuel,
            total_fuel: total_fuel,
            time: time,
            total_time: total_time,
            flyTime: flyTime,
            flyTotalTime: total_fly_time,
          })
        }
      } else {
        total_distance += distance;
        showData.value.push({
          name: position.name,
          position: {
            longitude: position.longitude,
            latitude: position.latitude
          },
          distance: distance,
          totalDistance: total_distance,
        })
      }
    }
    last_position = position;
  }

  showResult.value = true;
}

const showData = ref<DataItem[]>([]);

const showHistory = ref<boolean>(false);
const history = useStorage<HistoryItem[]>('history', []);

const handleHistoryView = (index: number) => {
  data.value = [];

  showDetail.value = history.value[index].aircraft ? true : false;
  aircraftValue.value = history.value[index].aircraft;
  data.value = history.value[index].data;
}
const handleHistoryDelete = (index: number) => {
  history.value.splice(index, 1);
}
const handleHistorySave = (name?: string) => {
  if (data.value.length === 0) {
    dialog.error({
      title: '错误',
      content: '不能保存空的记录'
    })
    return;
  } else {
    history.value.push({
      time: new Date().toLocaleString(),
      aircraft: showDetail.value ? aircraftValue.value : undefined,
      name: name,
      data: data.value,
    })
  }
}
</script>

<template>
  <NWatermark show content="HIT | SoS: AirRescue" cross fullscreen :font-size="16" :line-height="16" :width="384"
    :height="384" :x-offset="12" :y-offset="60" :rotate="-15" />
  <MyMenu />
  <div class="father">
    <div class="container">
      <div class="left">
        <div>
          <div class="m-container">
            <div class="left">
              更详细的计算：
              <NSwitch v-model:value="showDetail" />
              <NSelect v-if="showDetail" :options="aircraftOptions" v-model:value="aircraftValue" placeholder="请选择飞机类型" />
            </div>
            <div>
              <NButtonGroup>
                <NButton type="primary" @click="showHistory = true;">
                  <template #icon>
                    <NIcon>
                      <HourglassOutline />
                    </NIcon>
                  </template>
                </NButton>
                <NButton type="primary" @click="handleCalculate">计算</NButton>
                <NButton type="error" @click="handleClear">清空</NButton>
              </NButtonGroup>
            </div>
          </div>
          <MultipleShow :position="data" :aircraft="aircraft" @item-up="handleUp" @item-down="handleDown"
            @item-delete="handleDelete" @add-task="handleAddTask" :use-aircraft="useAircraft"
            @delete-task="handleDeleteTask" @change-task="handleChangeTask" />
        </div>
      </div>
      <div class="right">
        <MultipleInput @add="handleAdd" />
      </div>
    </div>
  </div>
  <NModal v-model:show="showModal" :mask-closable="false">
    <TaskChoice :aircraft="aircraftValue" :position="currentPosition" @close="showModal = false;"
      @confirm="handleModalSure" />
  </NModal>
  <NModal v-model:show="showResult">
    <MultipleDisplay :data="showData" :aircraft="aircraftValue" @close="showResult = false" />
  </NModal>
  <NDrawer v-model:show="showHistory" placement="right" style="width: 40%;">
    <NDrawerContent title="计算历史">
      <MultipleHistory :data="history" @view="handleHistoryView" @save="handleHistorySave"
        @delete="handleHistoryDelete" />
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.father {
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: center;
}

.container {
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: center;
  width: 90%;
}

.left {
  width: 46%;
  margin-right: 16px;
}

.right {
  width: 41%;
  /* background-color: aliceblue; */
}

.m-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>