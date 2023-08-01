<script setup lang="ts">
import type { ShowDataItem } from '@/pages/distance/multiple.vue';
import { NList, NListItem, NButton, NIcon, NEmpty, NScrollbar, NThing, NButtonGroup, useDialog, NModal, NCard, NSwitch, NInput } from 'naive-ui';
import { SaveOutline } from '@vicons/ionicons5';

export interface HistoryItem {
  time: string
  name?: string
  aircraft?: string
  data: ShowDataItem[]
}

const props = defineProps<{
  data: HistoryItem[]
}>();

const emit = defineEmits<{
  (e: 'save', name?: string): void,
  (e: 'view', index: number): void,
  (e: 'delete', index: number): void
}>();

const dialog = useDialog();
const handleDelete = (index: number) => {
  dialog.warning({
    title: '删除计算历史',
    content: '确定要删除这条计算历史吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      emit('delete', index);
    }
  })
}

const showModal = ref<boolean>(false);
const userSaveName = ref<boolean>(false);
const handleSave = () => {
  showModal.value = true;
}
const userName = ref<string | undefined>(undefined);
const handleClick = () => {
  if (userSaveName.value) {
    if (userName.value === undefined || userName.value.trim() === '') {
      dialog.error({
        title: '错误',
        content: '计算结果名称不能为空',
        positiveText: '确定'
      })
      return;
    } else {
      showModal.value = false;
      emit('save', userName.value.trim())
      return;
    }
  }
  showModal.value = false;
  emit('save')
}

const isHistoryNull = computed(() => props.data.length === 0);

</script>
<template>
  <div class="h">
    <NButton @click="handleSave">
      <template #icon>
        <NIcon>
          <SaveOutline />
        </NIcon>
      </template>
      保存计算结果
    </NButton>
  </div>
  <div>
    <NScrollbar style="max-height: 560px;">
      <NEmpty v-if="isHistoryNull" description="没有计算历史" />
      <NList bordered clickable hoverable v-else>
        <NListItem v-for="(item, index) in props.data">
          <NThing :title="item.name ? item.name : `${item.time} 的记录`">
            <div style="text-align: right;">
              <NButtonGroup size="small">
                <NButton type="primary" @click="emit('view', index)">查看</NButton>
                <NButton type="error" @click="handleDelete(index)">删除</NButton>
              </NButtonGroup>
            </div>
          </NThing>
        </NListItem>
      </NList>
    </NScrollbar>
  </div>
  <NModal v-model:show="showModal">
    <NCard title="保存计算结果" style="width: 34%;">
      <div class="box">
        自定义保存名称：
        <NSwitch v-model:value="userSaveName" />
      </div>
      <div class="box">
        <NInput v-model:value="userName" v-if="userSaveName" placeholder="请输入名称" />
      </div>
      <div class="box" style="text-align: right;">
        <NButtonGroup>
          <NButton @click="showModal = false">取消</NButton>
          <NButton type="primary" @click="handleClick">确定</NButton>
        </NButtonGroup>
      </div>
    </NCard>
  </NModal>
</template>

<style scoped>
.h {
  text-align: right;
  margin-bottom: 12px;
}

.box {
  margin-bottom: 16px;
}
</style>