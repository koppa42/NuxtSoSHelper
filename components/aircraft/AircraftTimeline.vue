<script setup lang="ts">
import { NTree, TreeOption, NDropdown, NDivider } from 'naive-ui';
import { useEditorStore, EditorAircraftMoveTo } from '@/store/editor';

const editorStore = useEditorStore();


const moveTo2String = (val: string | EditorAircraftMoveTo): string => {
  if (typeof val === 'string') {
    return val;
  } else {
    return `地点 (${val.latitude}, ${val.longitude})`
  }
}
const data = computed(() => {
  const result: TreeOption[] = []
  const aircraft = editorStore.get(editorStore.currentAircraftUuid);
  if (aircraft === undefined) {
    return []
  } else {
    for (const move of aircraft.data.move) {
      if (move.do_task || move.do_wait) {
        const tmp: TreeOption = {
          label: moveTo2String(move.to),
          key: move.uuid,
          children: [

          ]
        }
        if (move.do_task) {
          tmp.children!.push({
            label: move.task_type,
            key: `${move.uuid}-task`
          })
        }
        if (move.do_wait) {
          tmp.children!.push({
            label: '等待',
            key: `${move.uuid}-wait`
          })
        }
        result.push(tmp);
      } else {
        const tmp: TreeOption = {
          label: moveTo2String(move.to),
          key: move.uuid
        }
        result.push(tmp);
      }
    }
  }

  return result;
})

const showDropdown = ref(false);
const dropdownX = ref(0);
const dropdownY = ref(0);
const dropdownSelect = (cmd: string) => {
  showDropdown.value = false;
}
const dropdownClickOutside = () => {
  showDropdown.value = false;
}
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onclick() {

    },
    oncontextmenu(e: MouseEvent) {
      e.preventDefault();
      showDropdown.value = true;
      dropdownX.value = e.clientX;
      dropdownY.value = e.clientY;
    }
  }
}

const dropdownOptions = [
  {
    label: '前进到此',
    key: 'forward',
  },
  {
    label: '后退到此',
    key: 'backward',
  }
]
</script>

<template>
  <div style="height: 100; width: 100%;">
    <div style="padding-top: 6px;">
      <span>时间线</span>
    </div>
    <NTree :data="data" :selectable="false" style="height: 100%;" virtual-scroll :node-props="nodeProps" />
  </div>

  <NDropdown trigger="manual" placement="bottom-start" :show="showDropdown" :x="dropdownX" :y="dropdownY"
    @select="dropdownSelect" @clickoutside="dropdownClickOutside" :options="dropdownOptions" />
</template>