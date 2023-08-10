<script setup lang="ts">
import { NList, NListItem, NModal, NButton, NIcon, NCard, NButtonGroup, SelectOption, SelectGroupOption, NSelect, NInput, useMessage, NDropdown, useDialog } from 'naive-ui';
import { AddOutline, TrashOutline } from '@vicons/ionicons5';
import { useAircraftStore } from '@/store/aircraft';
import { useEditorStore } from '@/store/editor';

const aircraftStore = useAircraftStore();
const message = useMessage();
const dialog = useDialog();
const editorStore = useEditorStore();

export interface AircraftShowItem {
  uuid: string
  name: string
  baseName: string
}


const showAddModal = ref(false);
const handleAdd = () => {
  showAddModal.value = true;
}

const baseAircraftName = ref<string | undefined>(undefined);
const baseAircraftOptions = computed(() => {
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
  return options;
})
const aircraftName = ref<string | undefined>(undefined);
const handleSure = () => {
  if (baseAircraftName.value === undefined) {
    message.error('请选择航空器基类');
    return;
  }
  if (aircraftName.value === undefined) {
    message.error('请输入航空器名称');
    return;
  }
  // 检验航空器是否存在
  if (aircraftStore.getByName(baseAircraftName.value) === undefined) {
    message.error('不存在的航空器基类');
    return;
  }

  editorStore.Add(baseAircraftName.value, aircraftName.value);
  showAddModal.value = false;
  baseAircraftName.value = undefined;
  aircraftName.value = undefined;
}
const showRenameModal = ref(false);
const newAircraftName = ref<string | undefined>(undefined);
const handleRenameSure = () => {
  if (selectedUUID.value === undefined) {
    dialog.error({
      title: '错误',
      content: '尝试重命名不存在的航空器',
      positiveText: '确定',
    });
    return;
  }
  if (newAircraftName.value === undefined) {
    dialog.error({
      title: '错误',
      content: '请输入新的航空器名称',
      positiveText: '确定',
    });
    return;
  }
  
  showRenameModal.value = false;
  editorStore.Rename(selectedUUID.value, newAircraftName.value);
  newAircraftName.value = undefined;
}

const selectedUUID = ref<string | undefined>(undefined);
const dropdownX = ref<number>(0);
const dropdownY = ref<number>(0);
const showDropdown = ref<boolean>(false);
const dropdownOptions = [
  {
    label: '重命名',
    key: 'rename',
  },
  {
    label: '删除',
    key: 'delete',
  }
]
const handleContextMenu = (e: MouseEvent, uuid: string) => {
  e.preventDefault();
  selectedUUID.value = uuid;
  nextTick().then(() => {
    showDropdown.value = true;
    dropdownX.value = e.clientX;
    dropdownY.value = e.clientY;
  })
}
const handleClickOutside = () => {
  showDropdown.value = false;
}
const handleSelect = (key: string) => {
  showDropdown.value = false;
  // console.log(key);
  if (key === 'delete') {
    dialog.warning({
      title: '删除航空器',
      content: '确定删除该航空器吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        if (selectedUUID.value === undefined) {
          dialog.error({
            title: '错误',
            content: '尝试删除不存在的航空器',
            positiveText: '确定',
          });
          return;
        }
        editorStore.Delete(selectedUUID.value);
      }
    });
  } else if (key === 'rename') {
    showRenameModal.value = true;
  }
}

const handleDblclick = (e: MouseEvent, uuid: string) => {
  editorStore.SetCurrent(uuid);
}
</script>

<template>
  <NList hoverable clickable>
    <template #header>
      <div class="header-box">
        <div>航空器列表</div>
        <NButton text @click="handleAdd">
          <template #icon>
            <NIcon>
              <AddOutline />
            </NIcon>
          </template>
        </NButton>
      </div>
    </template>
    <NListItem v-for="item in editorStore.default" :key="item.uuid" @contextmenu="(e) => handleContextMenu(e, item.uuid)"
      @dblclick="(e) => handleDblclick(e, item.uuid)" :class="item.uuid === editorStore.currentAircraftUuid ? 'mselect' : ''">
      {{ item.name }}
    </NListItem>
  </NList>

  <NModal v-model:show="showAddModal">
    <NCard title="新建航空器" style="width: 38%;">
      <div class="mbox">
        航空器基类：
        <NSelect v-model:value="baseAircraftName" :options="baseAircraftOptions" placeholder="请选择航空器基类" />
      </div>
      <div class="mbox">
        航空器名称：
        <NInput placeholder="请输入航空器名称" v-model:value="aircraftName" />
      </div>
      <div class="mbox" style="text-align: right;">
        <NButtonGroup>
          <NButton @click="showAddModal = false;">取消</NButton>
          <NButton type="primary" @click="handleSure">确定</NButton>
        </NButtonGroup>
      </div>
    </NCard>
  </NModal>

  <NModal v-model:show="showRenameModal">
    <NCard title="重命名航空器" style="width: 38%;">
      <div class="mbox">
        航空器 uuid：
        {{ selectedUUID }}
      </div>
      <div class="mbox">
        航空器基类：
        {{ editorStore.get(selectedUUID)?.baseName }}
      </div>
      <div class="mbox">
        新的航空器名称：
        <NInput placeholder="请输入航空器名称" v-model:value="newAircraftName" />
      </div>
      <div class="mbox" style="text-align: right;">
        <NButtonGroup>
          <NButton @click="showRenameModal = false;">取消</NButton>
          <NButton type="primary" @click="handleRenameSure">确定</NButton>
        </NButtonGroup>
      </div>
    </NCard>
  </NModal>

  <NDropdown :x="dropdownX" :y="dropdownY" placement="bottom-start" trigger="manual" :options="dropdownOptions"
    :show="showDropdown" @clickoutside="handleClickOutside" @select="handleSelect" />
</template>

<style scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mbox {
  margin-bottom: 16px;
}

.mselect {
  color: #63e2b7;
}
</style>