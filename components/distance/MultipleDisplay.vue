<script setup lang="ts">
import { h } from 'vue';
import { NCard, NDataTable, DataTableColumn, NTag, NButton } from 'naive-ui';
import { AirTaskType, LandTaskType, useAircraftStore } from '@/store/aircraft';
import { AircraftCost } from '@/utils/aircraftCost';

const emit = defineEmits<{
  (e: 'close'): void
}>();
const aircraftStore = useAircraftStore();

interface DataItemBase {
  name: string,
  position: {
    longitude: number,
    latitude: number
  },

}

interface DataItemExtendDistance {
  distance: number
  totalDistance: number
}

interface DataItemExtendTaskFuel {
  taskType: '加油保障'
}

type DataItemExtendTaskOther = {
  taskType: LandTaskType,
  value: number
} | {
  taskType: AirTaskType,
  value: number
  taskFuel: number
  taskTotalFuel: number
  taskFlyTime: number
  taskTotalFlyTime: number
}

type DataItemExtendTaskTag = {
  doTask: true,
  taskTime: number,
  taskTotalTime: number
  flyTime: number,
  flyTotalTime: number,
};

interface DataItemExtendOther {
  fuel: number;
  total_fuel: number;
  time: number;
  total_time: number;
}
type DataItemTaskStarter = DataItemExtendTaskTag & DataItemExtendTaskFuel;
type DataItemTaskOther = DataItemExtendTaskTag & DataItemExtendTaskOther;
type DataItemStarter = DataItemBase | (DataItemBase & DataItemTaskStarter);
type DataItemItem = (DataItemBase & DataItemExtendDistance) | (DataItemBase & DataItemExtendDistance & DataItemExtendOther) | (DataItemBase & DataItemExtendDistance & DataItemExtendOther & DataItemTaskOther);

export type DataItem = DataItemStarter | DataItemItem;

const props = defineProps<{
  data: DataItem[],
  aircraft?: string
}>();

const aircraft = computed(() => {
  if (props.aircraft === undefined) {
    return undefined
  } else {
    return aircraftStore.getByName(props.aircraft)
  }
})

const columns = computed((): DataTableColumn[] => {
  if (props.aircraft === undefined && aircraft.value === undefined) {
    return [
      {
        title: "序号",
        key: "Number",
        width: 50,
        align: 'center',
        render(rowData, rowIndex) {
          return h('span', rowIndex);
        },
      },
      {
        title: '地点',
        align: 'center',
        key: 'name'
      },
      {
        title: '坐标',
        key: 'Position',
        align: 'center',
        render(rowData: any, rowIndex) {
          return h('span', `(${rowData.position.longitude.toFixed(2)}, ${rowData.position.latitude.toFixed(2)})`);
        },
      },
      {
        title: '单程距离 (km) / 总距离 (km)',
        key: 'Distance',
        align: 'center',
        render(rowData: any, rowIndex) {
          if (rowData.distance === undefined || rowData.totalDistance === undefined) {
            return undefined
          } else {
            return h('span', `${rowData.distance.toFixed(2)} / ${rowData.totalDistance.toFixed(2)}`)
          }
        },
      }
    ]
  } else {
    return [
      {
        title: '位置信息',
        key: 'PositionInfo',
        align: 'center',
        children: [
          {
            title: "序号",
            key: "Number",
            width: 50,
            align: 'center',
            render(rowData, rowIndex) {
              return h('span', rowIndex);
            },
          },
          {
            title: '地点',
            key: 'name',
            align: 'center',
          },
          {
            title: '坐标',
            key: 'Position',
            align: 'center',
            width: 140,
            render(rowData: any, rowIndex) {
              return h('span', `(${rowData.position.longitude.toFixed(2)}, ${rowData.position.latitude.toFixed(2)})`);
            },
          },
        ]
      },
      {
        title: "基础信息",
        key: "BaseInfo",
        align: 'center',
        children: [
          {
            title: '单程距离 (km) / 总距离 (km)',
            key: 'Distance',
            align: 'center',
            render(rowData: any, rowIndex) {
              if (rowData.distance === undefined || rowData.totalDistance === undefined) {
                return undefined
              } else {
                return h('span', `${rowData.distance.toFixed(2)} / ${rowData.totalDistance.toFixed(2)}`)
              }
            },
          },
          {
            title: '过程耗油 (kg) / 百分比 (%)',
            key: 'Fuel',
            align: 'center',
            render(rowData: any, rowIndex) {
              if (rowData.fuel === undefined) {
                return undefined
              } else {
                return h('span', `${rowData.fuel.toFixed(2)} / ${(rowData.fuel / aircraft.value!.max_fuel * 100).toFixed(2)}%`)
              }
            },
          },
          {
            title: '总耗油 (kg) / 百分比 (%)',
            key: 'TotalFuel',
            align: 'center',
            render(rowData: any, rowIndex) {
              if (rowData.fuel === undefined) {
                return undefined
              } else {
                const t = rowData.total_fuel / aircraft.value!.max_fuel * 100;
                if (t > 100) {
                  return h(NTag, { bordered: false, type: "error" }, () => `${rowData.total_fuel.toFixed(2)} / ${t.toFixed(2)}%`)
                } else {
                  return h(NTag, { bordered: false, type: "success" }, () => `${rowData.total_fuel.toFixed(2)} / ${t.toFixed(2)}%`)
                }
              }
            },
          },
          {
            title: '过程耗时 (min) / 总耗时 (min)',
            key: 'Time',
            align: 'center',
            render(rowData: any, rowIndex) {
              if (rowData.time === undefined || rowData.total_time === undefined) {
                return undefined
              } else {
                // console.log(rowData.time, rowData.total_time)
                return h('span', `${(rowData.time / 60).toFixed(2)} / ${(rowData.total_time / 60).toFixed(2)}`)
              }
            },
          },
        ]
      },
      {
        title: '任务',
        key: 'Task',
        align: 'center',
        children: [
          {
            title: '任务类型',
            key: 'TaskType',
            width: 100,
            align: 'center',
            render(rowData, rowIndex) {
              if (rowData.taskType === undefined) {
                return undefined
              } else {
                return h(NTag, rowData.taskType)
              }
            },
          },
          {
            title: '任务耗时 (min) / 总耗时 (min)',
            key: 'TaskTime',
            align: 'center',
            render(rowData: any, rowIndex) {
              if (rowData.taskTime === undefined || rowData.taskTotalTime === undefined) {
                return undefined
              } else {
                return h('span', `${(rowData.taskTime / 60).toFixed(2)} / ${(rowData.taskTotalTime / 60).toFixed(2)}`)
              }
            },
          },
          {
            title: '任务耗油 (kg) / 百分比 (%)',
            key: 'TaskTime',
            align: 'center',
            render(rowData: any, rowIndex) {
              if (rowData.taskFuel === undefined) {
                return undefined
              } else {
                return h('span', `${rowData.taskFuel.toFixed(2)} / ${(rowData.taskFuel / aircraft.value!.max_fuel * 100).toFixed(2)}%`)
              }
            },
          },
          {
            title: '任务总耗油 (kg) / 百分比 (%)',
            key: 'TaskTime',
            align: 'center',
            render(rowData: any, rowIndex) {
              if (rowData.taskTotalFuel === undefined) {
                return undefined
              } else {
                const t = rowData.taskTotalFuel / aircraft.value!.max_fuel * 100;
                if (t > 100) {
                  return h(NTag, { bordered: false, type: "error" }, () => `${rowData.taskTotalFuel.toFixed(2)} / ${t.toFixed(2)}%`)
                } else {
                  return h(NTag, { bordered: false, type: "success" }, () => `${rowData.taskTotalFuel.toFixed(2)} / ${t.toFixed(2)}%`)
                }
              }
            },
          }
        ]
      },
      {
        title: '成本',
        key: 'Cost',
        align: 'center',
        children: [
          {
            title: '飞行成本 (万元)',
            key: 'FlyCost',
            align: 'center',
            render(rowData: any, rowIndex) {
              if (rowData.flyTime === undefined || rowIndex === 0) {
                return undefined
              } else {
                // console.log(AircraftCost.DepreciationExpense(aircraft.value!.price), 
                //   AircraftCost.MaintenanceExpense(aircraft.value!.price),
                //   AircraftCost.FuelOilExpense(aircraft.value!.fuel_consumption_per_unit_time),
                //   AircraftCost.PilotExpense(aircraft.value!.with_person),
                //   AircraftCost.GroundStaffExpense(aircraft.value!.with_person),
                //   AircraftCost.InsuranceExpense(aircraft.value!.price));
                // console.log(rowData.flyTime, AircraftCost.Total(aircraft.value!))
                return h('span', `${(rowData.flyTime * AircraftCost.Total(aircraft.value!) / 3600).toFixed(3)}`)
              }
            },
          },
          {
            title: '任务成本 (万元)',
            key: 'TaskCost',
            align: 'center',
            render(rowData: any, rowIndex) {
              if (rowData.taskFlyTime === undefined) {
                return undefined
              } else {
                return h('span', `${(rowData.taskFlyTime * AircraftCost.Total(aircraft.value!) / 3600).toFixed(3)}`)
              }
            },
          }
        ]
      }
    ];
  }
})
</script>
<template>
  <NCard title="计算结果">
    <div class="tright">
      <!-- <NButton circle @click="generatePDF()">
        <template #icon>
          <NIcon>
            <DownloadOutline />
          </NIcon>
        </template>
      </NButton> -->
      <NButton type="primary" @click="emit('close')">确认</NButton>
    </div>
    <NDataTable :columns="columns" :data="props.data" :single-line="false" :pagination="{ pageSize: 10 }" virtual-scroll
      :max-height="700" :scroll-x="1800" />
  </NCard>
</template>

<style scoped>
.n-card {
  width: 86%;
}

.tright {
  /* display: flex;
  flex-direction: row;
  justify-content: space-between; */
  text-align: right;
  margin-bottom: 10px;
}
</style>