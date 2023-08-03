<script setup lang="ts">
import { NList, NListItem, NEmpty, NSwitch, NThing, NIcon, NTag, NButton, NSpace, NScrollbar } from 'naive-ui';
import { LockClosedOutline, TrashOutline } from '@vicons/ionicons5';

export interface AircraftItem {
  uuid: string,
  name: string,
  locked: boolean,
  price: number,
  // number: number,
}

const props = defineProps<{
  aircraftList: AircraftItem[],
}>();
const nShow = computed(() => props.aircraftList.length <= 0);
const emit = defineEmits<{
  (e: 'lock', index: number,): void,
  (e: 'delete', index: number): void
}>();
</script>

<template>
  <div>
    <div v-if="nShow">
      <NEmpty description="没有数据" />
    </div>
    <div v-else>
      <NList bordered>
        <template #header>
          <div style="text-align: center;">
            <span style="font-size: 1.2rem; font-weight: 700;">生成数据</span>
          </div>
        </template>
        <NScrollbar style="max-height: 500px;">
          <NListItem v-for="(item, index) in props.aircraftList" :key="item.uuid">
            <NThing :title="item.name">
              <NTag type="info">{{ item.price }} 亿</NTag>
            </NThing>
            <template #suffix>
              <NSpace :inline="true" align="center" :wrap="false">
                <NSwitch v-model:checked="item.locked" @click="emit('lock', index)">
                  <template #icon>
                    <NIcon>
                      <LockClosedOutline />
                    </NIcon>
                  </template>
                </NSwitch>
                <NButton circle type="error" @click="emit('delete', index)">
                  <template #icon>
                    <NIcon>
                      <TrashOutline />
                    </NIcon>
                  </template>
                </NButton>
              </NSpace>
            </template>
          </NListItem>
        </NScrollbar>
      </NList>
    </div>
  </div>
</template>
