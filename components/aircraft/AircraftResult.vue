<script setup lang="ts">
import { NCard, NList, NListItem, NEmpty, NTable, NScrollbar } from 'naive-ui';
import { EditorAircraftMoveStatus, useEditorStore, EditorAircraftStatus } from '@/store/editor';
import { MoveHelper } from '@/utils/moveHelper';

const editorStore = useEditorStore()
const hasAircraft = computed(() => editorStore.currentAircraftUuid !== undefined);
const totalCost = ref('0');
const totalUsedTime = ref('0');
const totalFlyTime = ref('0');
const leftFuel = ref('0');
const leftFuelPercentage = ref(0);
const aircraftStatus = ref<EditorAircraftStatus>({
  supply: 0,
  rescue_people: 0,
  device: 0,
  trapped_people: 0,
  patient: 0,
  water: 0,
});

editorStore.$subscribe((mutation) => {
  updateResult();
});

const updateResult = () => {
  const currentAircraft = editorStore.get(editorStore.currentAircraftUuid);

  if (currentAircraft) {
    let cal: EditorAircraftMoveStatus[] = []
    if (currentAircraft.data.timeline_move === null) {
      cal = editorStore.GetAircraftMoves(currentAircraft.uuid);
    } else {
      cal = editorStore.GetAircraftMovesBefore(currentAircraft.uuid, currentAircraft.data.timeline_move);
    }

    const checkedResult = MoveHelper.CheckMoveValid(currentAircraft.base, cal);
    const result = MoveHelper.CalculateMoveResult(currentAircraft.base, cal);
    if (checkedResult[0]) {
      totalCost.value = (result.totalCost).toFixed(3);
      totalUsedTime.value = (result.totalUsedTime / 60).toFixed(3);
      totalFlyTime.value = (result.totalFlyTime / 60).toFixed(2);
      leftFuel.value = result.leftFuel.toFixed(2);
      leftFuelPercentage.value = result.leftFuelPercentage;
      aircraftStatus.value = checkedResult[1];
    }

  }
}

</script>


<template>
  <div class="m-father" style="overflow: auto;">
    <NList clickable hoverable style="height: calc(100% - 48px);">
      <template #header>
        计算结果
      </template>
      <NScrollbar>
        <div v-if="hasAircraft">
          <NListItem>
            <NCard size="small" title="总耗时 (分钟) / 总飞行时间 (分钟)">
              {{ totalUsedTime }} / {{ totalFlyTime }}
            </NCard>
          </NListItem>
          <NListItem>
            <NCard size="small" title="剩余油量 (kg) / 比例 (%)">
              <span :style="leftFuelPercentage < 0 ? 'color: red' : ''">
                {{ leftFuel }} / {{ leftFuelPercentage.toFixed(2) }}%
              </span>
            </NCard>
          </NListItem>
          <NListItem>
            <NCard size="small" title="总成本 (万元)">
              {{ totalCost }}
            </NCard>
          </NListItem>
          <NListItem>
            <NCard size="small" title="飞机状态">
              <NTable :single-line="false" :bordered="false" size="small">
                <tr>
                  <th>物资 (kg)</th>
                  <th>{{ aircraftStatus.supply }}</th>
                </tr>
                <tr>
                  <th>救援人员 (人)</th>
                  <th>{{ aircraftStatus.rescue_people }}</th>
                </tr>
                <tr>
                  <th>设备 (个)</th>
                  <th>{{ aircraftStatus.device }}</th>
                </tr>
                <tr>
                  <th>灾民 (人)</th>
                  <th>{{ aircraftStatus.trapped_people }}</th>
                </tr>
                <tr>
                  <th>病患 (人)</th>
                  <th>{{ aircraftStatus.patient }}</th>
                </tr>
                <tr>
                  <th>水 (t)</th>
                  <th>{{ aircraftStatus.water }}</th>
                </tr>
              </NTable>
            </NCard>
          </NListItem>
        </div>
        <div v-else class="m-full m-center">
          <NEmpty description="暂无数据"></NEmpty>
        </div>
      </NScrollbar>
    </NList>
  </div>
</template>

<style scoped>
.m-tright {
  text-align: right;
}

.m-father {
  width: 39%;
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