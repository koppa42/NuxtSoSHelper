import { defineStore } from 'pinia';

interface Position {
  name: string;
  type: "Airport" | "Hospital" | "Source" | "Destination" | "DisasterArea";
  longitude: number;
  latitude: number;
  location: "Land" | "Sea";
}

export const usePositionStore = defineStore('position', {
  state: (): { default: Position[] } => ({
    default: [
      // 机场
      { name: '丽水（机场）', type: "Airport", longitude: 119.93, latitude: 28.47, location: "Land" },
      { name: '义乌（机场）', type: "Airport", longitude: 120.04, latitude: 29.38, location: "Land" },
      { name: '台州（机场）', type: "Airport", longitude: 121.43, latitude: 28.66, location: "Land" },

      // 医院
      { name: '余杭院区（医院）', type: "Hospital", longitude: 120.29, latitude: 30.42, location: "Land" },
      { name: '之江院区（医院）', type: "Hospital", longitude: 120.15, latitude: 30.19, location: "Land" },

      // source
      { name: '青田（水源）', type: "Source", longitude: 120.29, latitude: 28.14, location: "Land" },
      { name: '永康（集结）', type: "Source", longitude: 120.04, latitude: 28.89, location: "Land" },
      // { name: '东阳（集结）', type: "Source", longitude: 120.25, latitude: 29.27, location: "Land" },
      { name: '新昌（集结）', type: "Source", longitude: 120.9, latitude: 29.51, location: "Land" },

      // destination
      // { name: '永嘉（安置）', type: "Destination", longitude: 120.69, latitude: 28.15, location: "Land" },
      // { name: '三门（安置）', type: "Destination", longitude: 121.37, latitude: 29.06, location: "Land" },
      { name: '救捞船（安置）', type: "Destination", longitude: 122.22, latitude: 28.39, location: "Land" },
      { name: '东阳（安置）', type: "Destination", longitude: 120.25, latitude: 29.27, location: "Land" },
      { name: '大荆（安置）', type: "Destination", longitude: 120.96, latitude: 28.12, location: "Land" },

      // 灾区
      { name: '三门（灾区）', type: "DisasterArea", longitude: 121.37, latitude: 29.06, location: "Land" },
      { name: '永嘉（灾区）', type: "DisasterArea", longitude: 120.69, latitude: 28.15, location: "Land" },
      { name: '缙云（灾区）', type: "DisasterArea", longitude: 120.16, latitude: 28.72, location: "Land" },
      { name: '山早（灾区）', type: "DisasterArea", longitude: 120.67, latitude: 28.53, location: "Land" },
      { name: '磐安（灾区）', type: "DisasterArea", longitude: 120.45, latitude: 29.05, location: "Land" },
      { name: '仙居（灾区）', type: "DisasterArea", longitude: 120.73, latitude: 28.84, location: "Land" },
      // { name: '大荆（灾区）', type: "DisasterArea", longitude: 120.96, latitude: 28.12, location: "Land" },
      { name: '临海（灾区）', type: "DisasterArea", longitude: 121.15, latitude: 28.26, location: "Land" },
      { name: '失事渔船（事故）', type: "DisasterArea", longitude: 121.78, latitude: 28.86, location: "Sea" },
      { name: '侧翻游轮（事故）', type: "DisasterArea", longitude: 122.0, latitude: 28.75, location: "Sea" },
      { name: '高危平台（事故）', type: "DisasterArea", longitude: 123.1, latitude: 28.41, location: "Sea" },
    ]
  }),
  actions: {
    getByName(name: string): Position | undefined {
      return this.default.find((aircraft) => aircraft.name === name);
    },
    add(pos: Position): boolean {
      if (this.getByName(pos.name)) {
        return false;
      }
      this.default.push(pos);
      return true;
    }
  }
})