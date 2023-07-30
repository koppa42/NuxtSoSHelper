<script setup lang="ts">
import { NWatermark, NSwitch, SelectGroupOption, NSelect, SelectOption, NModal, useMessage, NButton, useDialog } from 'naive-ui';
import MyMenu from '@/components/MyMenu.vue';
import MultipleShow from '@/components/distance/MultipleShow.vue';
import TaskChoice from '@/components/distance/TaskChoice.vue';
import MultipleInput from '@/components/distance/MultipleInput.vue';
import { ref } from 'vue';
import { TaskType, useAircraftStore } from '@/store/aircraft';
import { usePositionStore } from '@/store/position';

type ShowDataItem = {
  name: string,
  doTask?: boolean,
  taskType?: TaskType,
  value?: number
}

const message = useMessage();
const positionStore = usePositionStore();
const dialog = useDialog();

const data = ref<ShowDataItem[]>([
  {
    name: '三门（安置）',
  },
  {
    name: '永嘉（安置）'
  }
]);
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
              <NButton type="error" @click="handleClear">清空</NButton>
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
  margin-bottom: 6px;
}
</style>