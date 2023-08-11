<script setup lang="ts">
import { NList, NListItem, useMessage, NScrollbar, useDialog, NButtonGroup, NButton, NEmpty, NIcon, NThing, NModal, NCard, NSwitch, SelectOption, SelectGroupOption, NSelect, NInputNumber, NDivider } from 'naive-ui';
import { useEditorStore, EditorAircraftMoveTo, EditorAircraftMoveStatus } from '@/store/editor';
import { usePositionStore } from '@/store/position';
import { TaskType, useAircraftStore } from '@/store/aircraft';
import { AirplaneOutline, TrashOutline, ArrowUp, ArrowDown, SettingsOutline } from '@vicons/ionicons5';
import { MoveHelper } from '@/utils/moveHelper';
import { v4 as uuidv4 } from 'uuid';

const dialog = useDialog();
const message = useMessage();
const editorStore = useEditorStore();
const positionStore = usePositionStore();
const aircraftStore = useAircraftStore();
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

const currentAircraft = computed(() => {
  return editorStore.get(editorStore.currentAircraftUuid)
})

const moveTo2String = (val: string | EditorAircraftMoveTo): string => {
  if (typeof val === 'string') {
    return val;
  } else {
    return `地点 (${val.latitude}, ${val.longitude})`
  }
}

/** 添加航空器途径地点 */
const handleClear = () => {
  dialog.warning({
    title: '警告',
    content: '确定要清空航空器的途径地点吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      editorStore.ClearAircraftMoves(currentAircraft.value!.uuid);
    }
  })
}
const handleAddMove = () => {
  addMoveTitle.value = '添加途径地点';
  showAddMoveModalSuerButtonText.value = '添加';
  showAddMoveModal.value = true;
}
const showAddMoveModalSuerButtonText = ref('添加')
const addMoveCurrentMoveUuid = ref<string>('');
const showAddMoveModal = ref(false);
const addMoveSpecial = ref(false);
const addMoveToString = ref<string | undefined>(undefined);
const addMoveToLatitude = ref<number | undefined>(undefined);
const addMoveToLongitude = ref<number | undefined>(undefined);
const addMoveTitle = ref('添加途径地点');
const handleAddMoveSure = () => {
  if (addMoveTitle.value === '添加途径地点') {
    if (addMoveSpecial.value) {
      if (addMoveToLatitude.value === undefined || addMoveToLongitude.value === undefined) {
        dialog.error({
          title: '添加失败',
          content: '经纬度不能为空',
          positiveText: '确定'
        })
        return;
      }
      if (editorStore.GetMoveNumber(currentAircraft.value!.uuid) <= 0) {
        dialog.error({
          title: '添加失败',
          content: '出发地点必须为机场',
          positiveText: '确定'
        })
        return;
      }

      editorStore.AddMove(currentAircraft.value!.uuid, {
        latitude: addMoveToLatitude.value,
        longitude: addMoveToLongitude.value
      });
      addMoveToLatitude.value = undefined;
      addMoveToLongitude.value = undefined;
      addMoveSpecial.value = false;
    } else {
      if (addMoveToString.value === undefined) {
        dialog.error({
          title: '添加失败',
          content: '地点不能为空',
          positiveText: '确定'
        })
        return;
      }
      const position = positionStore.default.find((item) => item.name === addMoveToString.value);
      if (position === undefined) {
        dialog.error({
          title: '添加失败',
          content: `地点 ${addMoveToString.value} 不存在}`,
          positiveText: '确定'
        })
        return;
      }

      if (editorStore.GetMoveNumber(editorStore.currentAircraftUuid!) <= 0 && position.type !== 'Airport') {
        dialog.error({
          title: '添加失败',
          content: '出发地点必须为机场',
          positiveText: '确定'
        })
        return;
      }
      editorStore.AddMove(editorStore.currentAircraftUuid!, addMoveToString.value);
      addMoveToString.value = undefined;
    }
    showAddMoveModal.value = false;
  } else {
    const currentAircraft = editorStore.get(editorStore.currentAircraftUuid!);
    const index = editorStore.GetAircraftMoveIndex(editorStore.currentAircraftUuid!, addMoveCurrentMoveUuid.value);
    const currentMove = editorStore.GetAircraftMove(editorStore.currentAircraftUuid!, addMoveCurrentMoveUuid.value);
    if (currentAircraft === undefined || index < 0 || currentMove === undefined) {
      dialog.error({
        title: '错误',
        content: '意料之外的错误，请稍后重试',
        positiveText: '确定'
      })
      return;
    }
    if (addMoveSpecial.value) {
      if (addMoveToLatitude.value === undefined || addMoveToLongitude.value === undefined) {
        dialog.error({
          title: '修改失败',
          content: '经纬度不能为空',
          positiveText: '确定'
        })
        return;
      }
      if (index === 0) {
        dialog.error({
          title: '修改失败',
          content: '出发地点必须为机场',
          positiveText: '确定'
        })
        return;
      }
    } else {
      if (addMoveToString.value === undefined) {
        dialog.error({
          title: '修改失败',
          content: '途径地点不能为空',
          positiveText: '确定'
        })
        return;
      }
      const position = positionStore.getByName(addMoveToString.value);
      if (position === undefined) {
        dialog.error({
          title: '修改失败',
          content: '途径地点不存在',
          positiveText: '确定'
        })
        return;
      }
      if (index === 0 && position.type !== 'Airport') {
        dialog.error({
          title: '修改失败',
          content: '出发地点必须为机场',
          positiveText: '确定'
        })
        return;
      }
    }

    // 任务冲突检验
    const checkedMoves = editorStore.GetAircraftMovesBefore(currentAircraft.uuid, currentMove.uuid);
    checkedMoves.pop();
    checkedMoves.push({
      uuid: uuidv4(),
      do_task: false,
      do_wait: currentMove.do_wait,
      wait_time: currentMove.do_wait ? currentMove.wait_time! : undefined,
      to: addMoveSpecial.value ? {
        longitude: addMoveToLongitude.value,
        latitude: addMoveToLatitude.value
      } as EditorAircraftMoveTo : addMoveToString.value!,
    })
    const afterMoves = editorStore.GetAircraftMovesAfter(currentAircraft.uuid, currentMove.uuid)

    const checkedResult = MoveHelper.CheckMoveValid(currentAircraft.base, checkedMoves.concat(afterMoves));

    if (checkedResult[0]) {
      MoveHelper.DeleteMoveTask(currentMove);
      currentMove.to = addMoveSpecial.value ? {
        longitude: addMoveToLongitude.value!,
        latitude: addMoveToLatitude.value!,
      } as EditorAircraftMoveTo : addMoveToString.value!
    } else {
      dialog.warning({
        title: '警告',
        content: '修改后，后续任务存在冲突，是否继续修改并清空后续任务',
        positiveText: '确定',
        onPositiveClick() {
          for (const m of afterMoves) {
            MoveHelper.DeleteMoveTask(m);
          }
          MoveHelper.DeleteMoveTask(currentMove);
          currentMove.to = addMoveSpecial.value ? {
            longitude: addMoveToLongitude.value,
            latitude: addMoveToLatitude.value
          } as EditorAircraftMoveTo : addMoveToString.value!

          message.info('修改成功');
          addMoveToLatitude.value = undefined;
          addMoveToLatitude.value = undefined;
          addMoveToString.value = undefined;
          addMoveSpecial.value = false;
          showAddMoveModal.value = false;
        },
        negativeText: '取消'
      })
      return;
    }

    message.info('修改成功');
    addMoveToLatitude.value = undefined;
    addMoveToLatitude.value = undefined;
    addMoveToString.value = undefined;
    addMoveSpecial.value = false;
    showAddMoveModal.value = false;
  }
}

/** 添加停留时间 */
const showWaitModal = ref(false);
const waitTime = ref(0);
let currentMove: EditorAircraftMoveStatus | undefined = undefined;
const handleWaitAdd = (uuid: string) => {
  currentMove = editorStore.GetAircraftMove(editorStore.currentAircraftUuid!, uuid);
  if (currentMove === undefined) {
    dialog.error({
      title: '添加失败',
      content: '未找到该途径地点',
      positiveText: '确定'
    })
    return;
  }
  if (currentMove.do_wait) {
    waitTime.value = currentMove.wait_time!;
  } else {
    waitTime.value = 0;
  }

  showWaitModal.value = true;
}
const handleWaitAddSure = () => {
  if (waitTime.value < 0) {
    dialog.error({
      title: '添加失败',
      content: '停留时间不能小于 0',
      positiveText: '确定'
    })
    return;
  }
  if (currentMove === undefined) {
    dialog.error({
      title: '错误',
      content: '未知的错误，请稍后重试',
      positiveText: '确定'
    })
    return;
  }

  if (waitTime.value === 0) {
    currentMove.do_wait = false;
  } else {
    currentMove.do_wait = true;
    currentMove.wait_time = waitTime.value;
  }
  showWaitModal.value = false;
}
const waitTime2String = (move: EditorAircraftMoveStatus): string => {
  if (move.do_wait) {
    return `停留 ${move.wait_time!.toFixed(1)} s`;
  } else {
    return '无停留时间';
  }
}
const handleMoveUp = (uuid: string) => {
  const aircraft = editorStore.get(editorStore.currentAircraftUuid!);
  if (aircraft === undefined) {
    dialog.error({
      title: '删除失败',
      content: '未找到该航空器',
      positiveText: '确定'
    })
    return;
  }
  const move = editorStore.GetAircraftMove(editorStore.currentAircraftUuid!, uuid);
  if (move === undefined) {
    dialog.error({
      title: '删除失败',
      content: '未找到该途径地点',
      positiveText: '确定'
    })
    return;
  }

  const index = editorStore.GetAircraftMoveIndex(editorStore.currentAircraftUuid!, uuid);
  if (index === 0) {
    dialog.error({
      title: '移动失败',
      content: '该途径地点已经在最顶端',
      positiveText: '确定'
    })
    return;
  } else if (index === 1) {
    if (typeof move.to === 'string') {
      const position = positionStore.getByName(move.to);
      if (position === undefined) {
        dialog.error({
          title: '移动失败',
          content: '未找到该途径地点',
          positiveText: '确定'
        })
        return;
      }
      if (position.type !== 'Airport') {
        dialog.error({
          title: '移动失败',
          content: '出发地点必须为机场',
          positiveText: '确定'
        })
        return;
      }
    } else {
      dialog.error({
        title: '移动失败',
        content: '出发地点必须为机场',
        positiveText: '确定'
      })
      return;
    }
  }

  const moves = editorStore.GetAircraftMoves(editorStore.currentAircraftUuid!);
  const beforeUuid = moves[index - 1].uuid;
  MoveHelper.Swap(moves, index, index - 1);
  const result = MoveHelper.CheckMoveValid(aircraft.base, moves);
  if (result[0]) {
    message.info('移动成功');
    return;
  } else {
    MoveHelper.Swap(moves, index, index - 1);
    dialog.error({
      title: '移动失败',
      content: '移动后会发生人物冲突，是否清空任务',
      positiveText: '确定',
      onPositiveClick: () => {
        const tmp_moves = editorStore.GetAircraftMovesAfterInclude(editorStore.currentAircraftUuid!, beforeUuid);
        tmp_moves.forEach((item) => {
          MoveHelper.DeleteMoveTask(item);
        })
        MoveHelper.Swap(moves, index, index - 1);
        message.info('移动成功');
      },
      negativeText: '取消',
    })
  }
}

const handleMoveDown = (uuid: string) => {
  const aircraft = editorStore.get(editorStore.currentAircraftUuid!);
  if (aircraft === undefined) {
    dialog.error({
      title: '删除失败',
      content: '未找到该航空器',
      positiveText: '确定'
    })
    return;
  }
  const move = editorStore.GetAircraftMove(editorStore.currentAircraftUuid!, uuid);
  if (move === undefined) {
    dialog.error({
      title: '删除失败',
      content: '未找到该途径地点',
      positiveText: '确定'
    })
    return;
  }

  const index = editorStore.GetAircraftMoveIndex(editorStore.currentAircraftUuid!, uuid);
  const length = editorStore.GetMoveNumber(editorStore.currentAircraftUuid!);
  const moves = editorStore.GetAircraftMoves(editorStore.currentAircraftUuid!);

  if (index === length - 1) {
    dialog.error({
      title: '移动失败',
      content: '该途径地点已经在最底端',
      positiveText: '确定'
    })
    return;
  } else if (index === 0) {
    const next_move = moves[index + 1];
    if (typeof next_move.to === 'string') {
      const position = positionStore.getByName(next_move.to);
      if (position === undefined) {
        dialog.error({
          title: '移动失败',
          content: '未找到该途径地点',
          positiveText: '确定'
        })
        return;
      }
      if (position.type !== 'Airport') {
        dialog.error({
          title: '移动失败',
          content: '出发地点必须为机场',
          positiveText: '确定'
        })
        return;
      }
    } else {
      dialog.error({
        title: '移动失败',
        content: '出发地点必须为机场',
        positiveText: '确定'
      })
      return;
    }
  }

  // const afterUuid = moves[index + 1].uuid;
  MoveHelper.Swap(moves, index, index + 1);
  const result = MoveHelper.CheckMoveValid(aircraft.base, moves);
  if (result[0]) {
    message.info('移动成功');
    return;
  } else {
    MoveHelper.Swap(moves, index, index + 1);
    dialog.error({
      title: '移动失败',
      content: '移动后会发生人物冲突，是否清空任务',
      positiveText: '确定',
      onPositiveClick: () => {
        const tmp_moves = editorStore.GetAircraftMovesAfterInclude(editorStore.currentAircraftUuid!, uuid);
        tmp_moves.forEach((item) => {
          MoveHelper.DeleteMoveTask(item);
        })
        MoveHelper.Swap(moves, index, index + 1);
        message.info('移动成功');
      },
      negativeText: '取消',
    })
  }
}

const handleMoveDelete = (uuid: string) => {
  const aircraft = editorStore.get(editorStore.currentAircraftUuid!);
  if (aircraft === undefined) {
    dialog.error({
      title: '删除失败',
      content: '未找到该航空器',
      positiveText: '确定'
    })
    return;
  }
  const move = editorStore.GetAircraftMove(editorStore.currentAircraftUuid!, uuid);
  if (move === undefined) {
    dialog.error({
      title: '删除失败',
      content: '未找到该途径地点',
      positiveText: '确定'
    })
    return;
  }

  if (editorStore.GetAircraftMoveIndex(editorStore.currentAircraftUuid!, uuid) === 0) {
    dialog.error({
      title: '删除失败',
      content: '出发地点不能删除，请尝试修改出发地点',
      positiveText: '确定'
    })
    return;
  }

  // 验证任务合法性
  const moves = editorStore.GetAircraftMoves(editorStore.currentAircraftUuid!).filter((item) => item.uuid !== uuid);
  const result = MoveHelper.CheckMoveValid(aircraft.base, moves);
  if (result[0]) {
    editorStore.DeleteAircraftMove(editorStore.currentAircraftUuid!, uuid);
    message.info('删除成功');
  } else {
    dialog.warning({
      title: '警告',
      content: '删除后后续任务存在冲突，是否清空后续任务',
      positiveText: '确定',
      onPositiveClick() {
        const afterMoves = editorStore.GetAircraftMovesAfter(editorStore.currentAircraftUuid!, uuid);
        afterMoves.forEach((item) => {
          MoveHelper.DeleteMoveTask(item);
        })
        editorStore.DeleteAircraftMove(editorStore.currentAircraftUuid!, uuid);
        message.info('删除成功');
      },
      negativeText: '取消'
    })
  }
}
const handleMoveChange = (uuid: string) => {
  addMoveTitle.value = '修改途径地点';
  showAddMoveModalSuerButtonText.value = '修改';

  const move = editorStore.GetAircraftMove(editorStore.currentAircraftUuid!, uuid);
  if (move === undefined) {
    dialog.error({
      title: '修改失败',
      content: '未找到该途径地点',
      positiveText: '确定'
    })
    return;
  }

  if (typeof move.to === 'string') {
    const position = positionStore.getByName(move.to);
    if (position === undefined) {
      dialog.error({
        title: '修改失败',
        content: '未找到该途径地点',
        positiveText: '确定'
      })
      return;
    }
    addMoveSpecial.value = false;
    addMoveToString.value = position.name;
  } else {
    addMoveSpecial.value = true;
    addMoveToLatitude.value = move.to.latitude;
    addMoveToLongitude.value = move.to.longitude;
  }

  addMoveCurrentMoveUuid.value = uuid;
  showAddMoveModal.value = true;
}

/** 添加任务 */
// helper
function deleteHelper<T>(lst: T[], el: T): void {
  const index = lst.indexOf(el);
  if (index !== -1) {
    lst.splice(index, 1);
  }
}
const airTaskType = ['绞车投放', '吊运', '卸载', '绞车转移', '绞车转运', '取水', '灭火', '侦查搜寻'];
const landTaskType = ['装载', '卸货', '运送', '投放', '转移', '安置', '转运', '交接', '加油保障'];
const generateTasks = (uuid: string): (SelectOption | SelectGroupOption)[] => {
  const currentAircraft = editorStore.get(editorStore.currentAircraftUuid)
  if (currentAircraft === undefined) {
    dialog.error({
      title: '添加失败',
      content: '当前选中的航空器为空',
      positiveText: '确定'
    });
    return [];
  }
  const currentMove = editorStore.GetAircraftMove(currentAircraft.uuid, uuid);
  if (currentMove === undefined) {
    dialog.error({
      title: '添加失败',
      content: '未找到该途径地点',
      positiveText: '确定'
    });
    return [];
  }
  const maybeTasks = aircraftStore.getPossibleTaskByName(currentAircraft.baseName) || [];
  if (typeof currentMove.to === 'string') {
    const position = positionStore.default.find((item) => item.name === currentMove.to);
    if (position === undefined) {
      dialog.error({
        title: '添加失败',
        content: `地点 ${currentMove.to} 不存在`,
        positiveText: '确定'
      });
      return [];
    } else {
      if (position.location === 'Sea' && !currentAircraft.base.ability.includes('海上')) {
        return []
      } else {
        if (position.type !== 'Airport') {
          deleteHelper(maybeTasks, '加油保障');
        }
        if (position.type !== 'Hospital') {
          deleteHelper(maybeTasks, '交接');
        }
        if (position.type !== 'DisasterArea') {
          deleteHelper(maybeTasks, '卸货');
          deleteHelper(maybeTasks, '投放');
          deleteHelper(maybeTasks, '绞车投放');
          deleteHelper(maybeTasks, '卸载');
          deleteHelper(maybeTasks, '绞车转移');
          deleteHelper(maybeTasks, '转移');
          deleteHelper(maybeTasks, '转运');
          deleteHelper(maybeTasks, '绞车转运');
          deleteHelper(maybeTasks, '灭火');
          deleteHelper(maybeTasks, '侦查搜寻');
        }
        if (position.type !== 'Source') {
          deleteHelper(maybeTasks, '取水');
          deleteHelper(maybeTasks, '装载');
          deleteHelper(maybeTasks, '运送');
          deleteHelper(maybeTasks, '吊运');
        }
        if (position.type !== 'Destination') {
          deleteHelper(maybeTasks, '安置');
        }
        return [
          {
            type: 'group',
            label: '地面',
            key: 'land',
            children: maybeTasks.filter((item) => landTaskType.includes(item)).map((item) => ({
              label: item,
              value: item
            }))
          },
          {
            type: 'group',
            label: '空中',
            key: 'air',
            children: maybeTasks.filter((item) => airTaskType.includes(item)).map((item) => ({
              label: item,
              value: item
            }))
          }
        ]
      }
    }
  } else {
    return [];
  }
}
const addTaskDataTip = computed(() => {
  if (addTaskSelectValue.value === undefined && addTaskSelectValue.value !== "加油保障") {
    return undefined;
  }
  switch (addTaskSelectValue.value) {
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

const CalTasksuffix = (tasktype: TaskType) => {
  switch (tasktype) {
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
      return 't';
    default:
      return undefined;
  }
}
const taskSuffix = computed(() => CalTasksuffix(addTaskSelectValue.value as TaskType))
const addTaskValueMax = computed(() => {
  if (addTaskSelectValue.value === undefined) {
    return 0;
  }
  const currentAircraft = editorStore.get(editorStore.currentAircraftUuid)
  if (currentAircraft === undefined) {
    dialog.error({
      title: '错误',
      content: '当前选中的航空器为空',
      positiveText: '确定'
    });
    return 0;
  }

  switch (addTaskSelectValue.value) {
    case '装载':
    case '卸货':
      return currentAircraft.base.max_internal_load;
    case '运送':
    case '投放':
    case '绞车投放':
      return currentAircraft.base.max_capacity;
    case '吊运':
    case '卸载':
      return Math.floor(currentAircraft.base.max_external_load / 10000);
    case '转移':
    case '绞车转移':
    case '安置':
      return currentAircraft.base.max_capacity;
    case '转运':
    case '绞车转运':
    case '交接':
      return currentAircraft.base.max_capacity;
    case '取水':
    case '灭火':
      return currentAircraft.base.max_external_load / 1000;
    case '侦查搜寻':
      return 10000;
    default:
      return 0;
  }
})


const showAddTaskModal = ref(false);
const addTaskTitle = ref<string>('添加任务')
const addTaskSelectValue = ref<string | undefined>(undefined);
const addTaskCurrentMoveUuid = ref<string>('');
const addTaskSelectOptions = ref<(SelectOption | SelectGroupOption)[]>([]);
const addTaskShowAddition = computed(() => {
  if (addTaskSelectValue.value === undefined) {
    return false;
  }
  if (addTaskSelectValue.value !== "加油保障") {
    return true;
  } else {
    return false;
  }
})
const addTaskAddition = ref<number>(0);
// handler
const handleChangeTask = (uuid: string) => {
  addTaskTitle.value = '修改任务';
  const move = editorStore.GetAircraftMove(editorStore.currentAircraftUuid!, uuid);
  addTaskSelectValue.value = move?.task_type
  addTaskAddition.value = move?.task_addition || 0;
  addTaskSelectOptions.value = generateTasks(uuid);
  addTaskCurrentMoveUuid.value = uuid;
  showAddTaskModal.value = true;
}

const handleAddTask = (uuid: string, e: MouseEvent) => {
  addTaskTitle.value = '添加任务';
  addTaskSelectValue.value = undefined;
  addTaskSelectOptions.value = generateTasks(uuid);
  addTaskCurrentMoveUuid.value = uuid;
  showAddTaskModal.value = true;
}

const addTaskModalCancel = () => {
  addTaskSelectValue.value = undefined;
  addTaskAddition.value = 0;
  showAddTaskModal.value = false;
}

const addTaskModalSure = () => {
  const currentAircraft = editorStore.get(editorStore.currentAircraftUuid)
  if (currentAircraft === undefined) {
    dialog.error({
      title: '添加失败',
      content: '当前选中的航空器为空',
      positiveText: '确定'
    });
    return;
  }
  const currentMove = editorStore.GetAircraftMove(currentAircraft.uuid, addTaskCurrentMoveUuid.value);
  if (currentMove === undefined) {
    dialog.error({
      title: '添加失败',
      content: '未找到该途径地点',
      positiveText: '确定'
    });
    return;
  }

  if (addTaskAddition.value <= 0) {
    if (addTaskSelectValue.value !== '加油保障') {
      dialog.error({
        title: '添加失败',
        content: '任务需要的数值必须为正值',
        positiveText: '确定',
        onPositiveClick() {
          addTaskAddition.value = 0;
        }
      });
      return;
    }
  }

  currentMove.do_task = true;
  currentMove.task_type = addTaskSelectValue.value as TaskType;
  currentMove.task_addition = addTaskAddition.value;

  const beforeMoves = editorStore.GetAircraftMovesBefore(currentAircraft.uuid, currentMove.uuid);
  const result = MoveHelper.CheckMoveValid(currentAircraft.base, beforeMoves);
  if (result[0] === false) {
    dialog.error({
      title: '添加失败',
      content: result[1],
      positiveText: '确定'
    });
    currentMove.task_type = undefined;
    currentMove.task_addition = undefined;
    currentMove.do_task = false;
    return;
  }
  const lastMove = editorStore.GetAircraftLastMove(currentAircraft.uuid);
  if (lastMove === undefined) {
    dialog.error({
      title: '错误',
      content: '意料之外的错误，请稍后重试',
      positiveText: '确定'
    });
    currentMove.task_type = undefined;
    currentMove.task_addition = undefined;
    currentMove.do_task = false;
    return;
  }
  const afterResult = MoveHelper.CheckMoveValid(currentAircraft.base, editorStore.GetAircraftMoves(currentAircraft.uuid));
  if (afterResult[0] === false) {
    const task_type = currentMove.task_type;
    const task_addition = currentMove.task_addition;
    const do_task = currentMove.do_task;

    currentMove.task_type = undefined;
    currentMove.task_addition = undefined;
    currentMove.do_task = false;

    dialog.error({
      title: '错误',
      content: '任务冲突，是否清空后续任务',
      positiveText: '确定',
      onPositiveClick: () => {
        const afterMoves = editorStore.GetAircraftMovesAfter(currentAircraft.uuid, currentMove.uuid);
        afterMoves.forEach((move) => {
          move.task_type = undefined;
          move.task_addition = undefined;
          move.do_task = false;
        });
        currentMove.task_type = task_type;
        currentMove.task_addition = task_addition;
        currentMove.do_task = do_task;
      },
      negativeText: '取消'
    });
  }
  showAddTaskModal.value = false;
  addTaskAddition.value = 0;
}
</script>

<template>
  <div class="m-father">
    <div class="m-full m-center" v-if="currentAircraft === undefined">
      <NEmpty description="暂未选中飞机">
        <template #icon>
          <NIcon>
            <AirplaneOutline />
          </NIcon>
        </template>
      </NEmpty>
    </div>
    <NList hoverable clickable class="m-full" v-else>
      <template #header>
        <div class="m-header" style="max-height: 59px; overflow: hidden;">
          <div style="max-height: 100%; overflow: hidden;">航空器 {{ currentAircraft.baseName }} - {{ currentAircraft.name }}
          </div>
          <NButtonGroup>
            <NButton type="error" @click="handleClear">清空</NButton>
            <NButton type="primary" @click="handleAddMove">添加</NButton>
          </NButtonGroup>
        </div>
      </template>
      <NScrollbar style="max-height: calc(100% - 59px)">
        <NListItem v-for="(move, index) in currentAircraft.data.move" :key="currentAircraft.uuid">
          <NThing :title="moveTo2String(move.to)">
            <div v-if="(typeof move.to === 'string')" style="display: inline-block;">
              <NButton quaternary v-if="move.do_task" @click="handleChangeTask(move.uuid)">
                <span>
                  {{ move.task_type }}
                </span>
                <span v-if="move.task_type !== '加油保障'" style="margin-left: 4px;">
                  {{ move.task_addition }}
                  {{ CalTasksuffix(move.task_type!) }}
                </span>
              </NButton>
              <NButton v-else quaternary type="info" @click="(e) => handleAddTask(move.uuid, e)">
                添加任务
              </NButton>
            </div>
            <NButton quaternary type="warning" @click="handleWaitAdd(move.uuid)">
              {{ waitTime2String(move) }}
            </NButton>
          </NThing>

          <template #prefix>
            <span style="color: darkgrey;">{{ index }}</span>
          </template>
          <template #suffix>
            <NButtonGroup>
              <NButton type="primary" ghost @click="handleMoveUp(move.uuid)">
                <template #icon>
                  <NIcon>
                    <ArrowUp />
                  </NIcon>
                </template>
              </NButton>
              <NButton type="primary" ghost @click="handleMoveDown(move.uuid)">
                <template #icon>
                  <NIcon>
                    <ArrowDown />
                  </NIcon>
                </template>
              </NButton>
              <NButton type="warning" ghost @click="handleMoveChange(move.uuid)">
                <template #icon>
                  <NIcon>
                    <SettingsOutline />
                  </NIcon>
                </template>
              </NButton>
              <NButton type="error" ghost @click="handleMoveDelete(move.uuid)">
                <template #icon>
                  <NIcon>
                    <TrashOutline />
                  </NIcon>
                </template>
              </NButton>
            </NButtonGroup>
          </template>
        </NListItem>
      </NScrollbar>
    </NList>
  </div>

  <!-- 添加途径地点 -->
  <NModal v-model:show="showAddMoveModal">
    <NCard :title="addMoveTitle" class="m-card">
      <div class="m-box">
        <div style="margin-bottom: 6px;">
          自定义地点：
          <NSwitch v-model:value="addMoveSpecial" />
        </div>
        <div v-if="addMoveSpecial">
          <div>纬度：
            <NInputNumber v-model:value="addMoveToLatitude" placeholder="请输入纬度" :min="-90" :max="90" />
          </div>
          <div>经度：
            <NInputNumber v-model:value="addMoveToLongitude" placeholder="请输入经度" :min="-180" :max="180" />
          </div>
        </div>
        <div v-else>
          <NSelect v-model:value="addMoveToString" :options="positionOptions" placeholder="请选择地点" clearable />
        </div>
        <!-- <NDivider /> -->
      </div>
      <div class="m-box m-tright">
        <NButtonGroup>
          <NButton @click="showAddMoveModal = false;">取消</NButton>
          <NButton type="primary" @click="handleAddMoveSure">{{ showAddMoveModalSuerButtonText }}</NButton>
        </NButtonGroup>
      </div>
    </NCard>
  </NModal>

  <!-- 添加停留时间 -->
  <NModal v-model:show="showWaitModal">
    <NCard title="添加任务完成后停留时间" class="m-card">
      <div class="m-box">
        <div style="margin-bottom: 6px;">停留时间（秒）：</div>
        <NInputNumber v-model:value="waitTime" :min="0" placeholder="停留时间" />
      </div>
      <div class="m-box m-tright">
        <NButtonGroup>
          <NButton @click="showWaitModal = false;">取消</NButton>
          <NButton type="primary" @click="handleWaitAddSure">添加</NButton>
        </NButtonGroup>
      </div>
    </NCard>
  </NModal>

  <!-- 添加任务 -->
  <NModal v-model:show="showAddTaskModal">
    <NCard :title="addTaskTitle" class="m-card">
      <div class="m-box">
        <span>任务类型：</span>
        <NSelect v-model:value="addTaskSelectValue" placeholder="请选择任务类型" :options="addTaskSelectOptions" />
      </div>
      <div class="m-box" v-if="addTaskShowAddition">
        <div style="margin-bottom: 8px;">
          <span>{{ addTaskDataTip }}</span>
          <NButton quaternary type="info" @click="addTaskAddition = addTaskValueMax">最大</NButton>
        </div>
        <NInputNumber placeholder="请输入数据" style="width: 50%;" :min="0" :max="addTaskValueMax"
          v-model:value="addTaskAddition">
          <template #suffix>
            {{ taskSuffix }}
          </template>
        </NInputNumber>
      </div>

      <template #footer>
        <div class="m-tright">
          <NButtonGroup>
            <NButton type="error" strong secondary @click="addTaskModalCancel">取消</NButton>
            <NButton type="primary" @click="addTaskModalSure">确定</NButton>
          </NButtonGroup>
        </div>
      </template>
    </NCard>
  </NModal>
</template>

<style scoped>
.m-tright {
  text-align: right;
}

.m-father {
  width: 60%;
  height: 100%;
}

.m-full {
  width: 100%;
  height: 100%;
}

.m-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.m-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.m-card {
  width: 40%;
}

.m-box {
  padding-bottom: 16px;
}
</style>