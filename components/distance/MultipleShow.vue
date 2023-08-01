<script setup lang="ts">
import { NList, NListItem, NThing, NButtonGroup, NButton, NIcon, useMessage, NTag, NSpace, NScrollbar, NEmpty } from 'naive-ui';
import { TaskType } from '@/store/aircraft';
import { ArrowUp, ArrowDown, TrashOutline } from '@vicons/ionicons5';

type ShowDataItem = {
  name: string,
  doTask?: boolean,
  taskType?: TaskType,
  value?: number
}

const props = defineProps<{
  position: ShowDataItem[],
  aircraft?: string,
  useAircraft?: boolean
}>();

const emit = defineEmits<{
  (e: 'itemUp', index: number): void,
  (e: 'itemDown', index: number): void,
  (e: 'itemDelete', index: number): void,
  (e: 'addTask', index: number): void,
  (e: 'changeTask', index: number): void,
  (e: 'deleteTask', index: number): void
}>();
const message = useMessage();

const handleUp = (idx: number) => {
  if (idx == 0) {
    message.error('出发地点不能继续上移');
    return;
  }
  emit('itemUp', idx);
}
const handleDown = (idx: number) => {
  if (idx == props.position.length - 1) {
    message.error('目的地点不能继续下移');
    return;
  }
  emit('itemDown', idx);
}
const handleDelete = (idx: number) => {
  emit('itemDelete', idx);
}
const handleAddTask = (idx: number) => {
  emit('addTask', idx);
}
const isUseAircraft = computed(() => props.useAircraft === true);

const dataSuffix = (task?: string) => {
  switch (task) {
    case '装载':
    case '卸货':
      return 'kg';
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
      return '1000 kg';
    default:
      return undefined;
  }
}

const isEmpty = computed(() => props.position.length === 0);
</script>

<template>
  <NSpace v-if="isEmpty" align="center" justify="center" style="height: 440px;">
    <NEmpty description="暂无地点数据"/>
  </NSpace>
  <NList v-else hoverable clickable bordered>
    <template #header>
      <NThing title="途径地点">
      </NThing>
    </template>

    <NScrollbar style="max-height: 740px;">
      <NListItem v-for="(pos, index) in props.position">
        <template #prefix>
          {{ index }}
        </template>
        <template #suffix>
          <NButtonGroup>
            <NButton type="primary" ghost @click="() => handleUp(index)">
              <template #icon>
                <NIcon>
                  <ArrowUp />
                </NIcon>
              </template>
            </NButton>
            <NButton type="primary" ghost @click="() => handleDown(index)">
              <template #icon>
                <NIcon>
                  <ArrowDown />
                </NIcon>
              </template>
            </NButton>
            <NButton type="error" ghost @click="() => handleDelete(index)">
              <template #icon>
                <NIcon>
                  <TrashOutline />
                </NIcon>
              </template>
            </NButton>
          </NButtonGroup>
        </template>
        <NThing :title="pos.name" content-style="margin-top: 10px;">
          <div v-if="isUseAircraft">
            <div v-if="pos.doTask">
              <NSpace>
                <NTag type="success">
                  {{ pos.taskType }}
                </NTag>
                <NTag type="info" v-if="pos.value !== undefined">
                  {{ pos.value }} {{ dataSuffix(pos.taskType) }}
                </NTag>
                <NButton type="primary" size="small" @click="emit('changeTask', index)">修改</NButton>
                <NButton type="error" size="small" @click="emit('deleteTask', index)">删除</NButton>
              </NSpace>
            </div>
            <NButton v-else quaternary type="info" @click="handleAddTask(index)">
              {{ index === 0 ? "在此加油保障" : "添加任务" }}
            </NButton>
          </div>
        </NThing>
      </NListItem>
    </NScrollbar>
  </NList>
</template>