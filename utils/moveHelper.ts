import { EditorAircraftStatus, EditorAircraftMoveStatus } from '@/store/editor'
import { Aircraft } from '@/store/aircraft';
import { usePositionStore } from '@/store/position';

export namespace MoveHelper {
  export function CheckMoveValid(aircraft: Aircraft, move: EditorAircraftMoveStatus[]): [true, EditorAircraftStatus] | [false, string, string] {
    const positionStore = usePositionStore();
    const status: EditorAircraftStatus = {
      supply: 0,
      rescue_people: 0,
      device: 0,
      trapped_people: 0,
      patient: 0,
      water: 0,
    }

    // 空返回
    if (move.length === 0) return [true, status];
    // 标志
    let flag = [false, false, false, false, false, false];

    function any_true(ex?: number): boolean {
      if (ex === undefined)
        return flag[0] || flag[1] || flag[2] || flag[3] || flag[4] || flag[5];
      else {
        let ret = false;
        for (let i = 0; i < flag.length; i++) {
          if (i === ex) continue;
          if (flag[i]) ret = true;
        }
        return ret;
      }
    }

    // console.log(move)
    let idx = 0;
    for (const m of move) {
      // console.log(m.to, idx)
      // console.log(m)

      if (typeof m.to === 'string') {
        const position = positionStore.getByName(m.to);
        if (position === undefined) {
          return [false, `地点 ${m.to} 不存在`, m.uuid];
        }
        if (idx === 0) {
          // console.log(idx)
          // 检验第一个到达的地点是不是机场
          // TODO 有无加油保障
          if (position.type !== 'Airport') {
            return [false, "出发地点必须是机场", m.uuid];
          }
        }

        // 检验是否进行任务
        if (m.do_task === true) {
          switch (m.task_type) {
            case '装载':
              if (any_true(0)) {
                return [false, "航空器无法装载货物", m.uuid];
              }
              if (m.task_addition! + status.supply <= aircraft.max_internal_load) {
                status.supply += m.task_addition!;
                flag[0] = true;
              } else {
                return [false, `航空器无法装载 ${m.task_addition} kg 货物`, m.uuid];
              }
              break;
            case '卸货':
              if (any_true(0)) {
                return [false, "航空器无法卸载货物", m.uuid];
              }
              if (status.supply - m.task_addition! >= 0) {
                status.supply -= m.task_addition!;
                if (status.supply === 0) flag[0] = false;
              } else {
                return [false, `航空器上没有 ${m.task_addition} kg 货物`, m.uuid];
              }
              break;
            case '运送':
              if (any_true(1)) {
                return [false, "航空器无法运送人员", m.uuid];
              }
              if (m.task_addition! + status.rescue_people <= aircraft.max_capacity) {
                status.rescue_people += m.task_addition!;
                flag[1] = true;
              } else {
                return [false, `航空器无法运送 ${m.task_addition} 人`, m.uuid];
              }
              break;
            case '投放':
            case '绞车投放':
              if (any_true(1)) {
                return [false, "航空器无法投放人员", m.uuid];
              }
              if (status.rescue_people - m.task_addition! >= 0) {
                status.rescue_people -= m.task_addition!;
                if (status.rescue_people === 0) flag[1] = false;
              } else {
                return [false, `航空器上没有 ${m.task_addition} 人`, m.uuid];
              }
              break;
            case '吊运':
              if (any_true(2)) {
                return [false, "航空器无法吊运设备", m.uuid];
              }
              if (m.task_addition! + status.device <= Math.floor(aircraft.max_external_load / 10000)) {
                status.device += m.task_addition!;
                flag[2] = true;
              } else {
                return [false, `航空器无法吊运 ${m.task_addition} 吨设备`, m.uuid];
              }
              break;
            case '卸载':
              if (any_true(2)) {
                return [false, "航空器无法卸载设备", m.uuid];
              }
              if (status.device - m.task_addition! >= 0) {
                status.device -= m.task_addition!;
                if (status.device === 0) flag[2] = false;
              } else {
                return [false, `航空器上没有 ${m.task_addition} 个设备`, m.uuid];
              }
              break;
            case '转移':
            case '绞车转移':
              if (any_true(3)) {
                return [false, "航空器无法转移被困人员", m.uuid];
              }
              if (m.task_addition! + status.trapped_people <= aircraft.max_capacity) {
                status.trapped_people += m.task_addition!;
                flag[3] = true;
              } else {
                return [false, `航空器无法转移 ${m.task_addition} 人`, m.uuid];
              }
              break;
            case '安置':
              if (any_true(3)) {
                return [false, "航空器无法安置被困人员", m.uuid];
              }
              if (status.trapped_people - m.task_addition! >= 0) {
                status.trapped_people -= m.task_addition!;
                if (status.trapped_people === 0) flag[3] = false;
              } else {
                return [false, `航空器上没有 ${m.task_addition} 人`, m.uuid];
              }
              break;
            case '转运':
            case '绞车转运':
              if (any_true(4)) {
                return [false, "航空器无法转运伤员", m.uuid];
              }
              if (m.task_addition! + status.patient <= aircraft.max_capacity) {
                status.patient += m.task_addition!;
                flag[4] = true;
              } else {
                return [false, `航空器无法转运 ${m.task_addition} 人`, m.uuid];
              }
              break;
            case '交接':
              if (any_true(4)) {
                return [false, "航空器无法交接伤员", m.uuid];
              }
              if (m.task_addition! + status.patient <= aircraft.max_capacity) {
                status.patient += m.task_addition!;
                flag[5] = true;
              } else {
                return [false, `航空器无法交接 ${m.task_addition} 人`, m.uuid];
              }
              break;
            case '取水':
              if (any_true(5)) {
                return [false, "航空器无法取水", m.uuid];
              }
              if (m.task_addition! + status.water <= aircraft.max_external_load / 1000) {
                status.water += m.task_addition!;
                flag[5] = true;
              } else {
                return [false, `航空器无法取 ${m.task_addition} 吨水`, m.uuid];
              }
              break;
            case '灭火':
              if (any_true(5)) {
                return [false, "航空器无法灭火", m.uuid];
              }
              if (status.water - m.task_addition! >= 0) {
                status.water -= m.task_addition!;
                if (status.water === 0) flag[5] = false;
              } else {
                return [false, `航空器上没有 ${m.task_addition} 吨水`, m.uuid];
              }
              break;
            case '侦查搜寻':
            default:
              break;
          }
        }
      } else {
        if (idx === 0) {
          return [false, "出发地点必须是机场", m.uuid];
        }
      }

      idx++;
    }
    return [true, status]
  }

  export function DeleteMoveTask(...moves: EditorAircraftMoveStatus[]) {
    moves.forEach(m => {
      m.task_addition = undefined;
      m.task_type = undefined;
      m.do_task = false;
    })
  }

  export function Swap<T>(lst: T[], idx1: number, idx2: number) {
    let tmp = lst[idx1];
    lst[idx1] = lst[idx2];
    lst[idx2] = tmp;
  }

  // export function GenerateStatusAfterMoves(aircraft: Aircraft, move: EditorAircraftMoveStatus[]): EditorAircraftStatus {
  //   return {}
  // }
}