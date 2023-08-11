import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { Aircraft, useAircraftStore } from "./aircraft";
import { usePositionStore } from "./position";
import { TaskType } from "@/store/aircraft";

export interface EditorAircraftMoveTo {
  longitude: number,
  latitude: number,
}

type EditorAircraftMoveStatusBase = {
  uuid: string,
  to: string | EditorAircraftMoveTo
  do_wait: boolean
  wait_time?: number
}

export type EditorAircraftMoveStatus = (EditorAircraftMoveStatusBase & {
  do_task: boolean,
  task_type?: TaskType,
  task_addition?: number
})

export interface EditorAircraftStatus {
  supply: number,
  rescue_people: number,
  device: number,
  trapped_people: number,
  patient: number,
  water: number,
}

export interface EditorAircraft {
  uuid: string,
  baseName: string,
  name: string,
  base: Aircraft
  data: {
    move: EditorAircraftMoveStatus[],
    status: EditorAircraftStatus
    timeline_move: string | null
  }
}

export const useEditorStore = defineStore("editor", {
  state: () => ({
    default: [] as EditorAircraft[],
    currentAircraftUuid: undefined as string | undefined,
  }),

  actions: {
    get(uuid?: string): EditorAircraft | undefined {
      return this.default.find((aircraft) => aircraft.uuid === uuid);
    },
    Add(baseAircraftName: string, aircraftName: string) {
      const aircraftStore = useAircraftStore();
      const aircraft = aircraftStore.getByName(baseAircraftName);
      if (!aircraft) throw new Error("未找到该航空器");

      const uuid = uuidv4();
      this.default.push({
        uuid,
        baseName: baseAircraftName,
        base: aircraft,
        name: aircraftName,
        data: {
          move: [],
          status: {
            supply: 0,
            rescue_people: 0,
            device: 0,
            trapped_people: 0,
            patient: 0,
            water: 0,
          },
          timeline_move: null
        }
      });
    },
    Rename(uuid: string, newName: string) {
      const aircraft = this.get(uuid);
      if (aircraft) {
        aircraft.name = newName;
      } else {
        throw new Error("未找到该航空器");
      }
    },
    Delete(uuid: string) {
      const aircraft = this.get(uuid);
      if (aircraft) {
        this.default.splice(this.default.indexOf(aircraft), 1);
      } else {
        throw new Error("未找到该航空器");
      }
    },
    SetCurrent(uuid: string) {
      const aircraft = this.get(uuid);
      if (aircraft) {
        this.currentAircraftUuid = uuid;
      } else {
        throw new Error("未找到该航空器");
      }
    },
    AddMove(aircraftUuid: string, pos: string | EditorAircraftMoveTo) {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        const positionStore = usePositionStore();
        if (typeof pos === 'string') {
          const position = positionStore.getByName(pos);
          if (!position) throw new Error("未找到该位置");
        }
        aircraft.data.move.push({
          uuid: uuidv4(),
          to: pos,
          do_task: false,
          do_wait: false,
        });
      } else {
        throw new Error("未找到该航空器");
      }
    },
    GetAircraftMove(aircraftUuid: string, moveUuid: string): EditorAircraftMoveStatus | undefined {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        return aircraft.data.move.find((move) => move.uuid === moveUuid);
      } else {
        throw new Error("未找到该航空器");
      }
    },
    // 含 moveUuid
    GetAircraftMovesBefore(aircraftUuid: string, moveUuid: string): EditorAircraftMoveStatus[] {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        const index = aircraft.data.move.findIndex((move) => move.uuid === moveUuid);
        if (index === -1) throw new Error("未找到该移动");
        return aircraft.data.move.slice(0, index + 1);
      } else {
        throw new Error("未找到该航空器");
      }
    },
    GetMoveNumber(aircraftUuid: string): number {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        return aircraft.data.move.length;
      } else {
        throw new Error("未找到该航空器");
      }
    },
    GetAircraftLastMove(aircraftUuid: string): EditorAircraftMoveStatus | undefined {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        return aircraft.data.move[aircraft.data.move.length - 1];
      } else {
        throw new Error("未找到该航空器");
      }
    },
    GetAircraftMoves(aircraftUuid: string): EditorAircraftMoveStatus[] {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        return aircraft.data.move;
      } else {
        throw new Error("未找到该航空器");
      }
    },
    GetAircraftMoveIndex(aircraftUuid: string, moveUuid: string): number {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        return aircraft.data.move.findIndex((move) => move.uuid === moveUuid);
      } else {
        throw new Error("未找到该航空器");
      }
    },
    // 不含 moveUuid
    GetAircraftMovesAfter(aircraftUuid: string, moveUuid: string): EditorAircraftMoveStatus[] {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        const index = aircraft.data.move.findIndex((move) => move.uuid === moveUuid);
        if (index === -1) throw new Error("未找到该移动");
        return aircraft.data.move.slice(index + 1);
      } else {
        throw new Error("未找到该航空器");
      }
    },
    GetAircraftMovesAfterInclude(aircraftUuid: string, moveUuid: string): EditorAircraftMoveStatus[] {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        const index = aircraft.data.move.findIndex((move) => move.uuid === moveUuid);
        if (index === -1) throw new Error("未找到该移动");
        return aircraft.data.move.slice(index);
      } else {
        throw new Error("未找到该航空器");
      }
    },
    ClearAircraftMoves(aircraftUuid: string) {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        aircraft.data.move = [];
      } else {
        throw new Error("未找到该航空器");
      }
    },
    DeleteAircraftMove(aircraftUuid: string, moveUuid: string) {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        const index = aircraft.data.move.findIndex((move) => move.uuid === moveUuid);
        if (index === -1) throw new Error("未找到该移动");
        aircraft.data.move.splice(index, 1);
      } else {
        throw new Error("未找到该航空器");
      }
    },
    AircraftMoveUp(aircraftUuid: string, moveUuid: string) {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        const index = aircraft.data.move.findIndex((move) => move.uuid === moveUuid);
        if (index === -1) throw new Error("未找到该移动");
        if (index === 0) throw new Error("已经是第一个了");
        const tmp = aircraft.data.move[index - 1];
        aircraft.data.move[index - 1] = aircraft.data.move[index];
        aircraft.data.move[index] = tmp;
      } else {
        throw new Error("未找到该航空器");
      }
    },
    SetTimelineMove(aircraftUuid: string, moveUuid: string | null) {
      const aircraft = this.get(aircraftUuid);
      if (aircraft) {
        if (moveUuid) {
          const move = this.GetAircraftMove(aircraftUuid, moveUuid);
          if (!move) throw new Error("未找到该移动");
          aircraft.data.timeline_move = move.uuid;
        } else {
          moveUuid = null;
        }
      } else {
        throw new Error("未找到该航空器");
      }
    }
  }
})