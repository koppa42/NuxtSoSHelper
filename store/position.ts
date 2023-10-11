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
      { name: '衢州（机场）', type: "Airport", longitude: 118.90, latitude: 28.97, location: "Land" },
      { name: '丽水（机场）', type: "Airport", longitude: 119.93, latitude: 28.47, location: "Land" },
      { name: '温州（机场）', type: "Airport", longitude: 120.84, latitude: 27.88, location: "Land" },
      { name: '义乌（机场）', type: "Airport", longitude: 120.04, latitude: 29.38, location: "Land" },
      { name: '台州（机场）', type: "Airport", longitude: 121.43, latitude: 28.66, location: "Land" },
      { name: '杭州（机场）', type: "Airport", longitude: 120.43, latitude: 30.23, location: "Land" },
      { name: '嘉兴（机场）', type: "Airport", longitude: 120.69, latitude: 30.70, location: "Land" },
      { name: '舟山（机场）', type: "Airport", longitude: 122.36, latitude: 29.93, location: "Land" },

      // 医院
      { name: '余杭院区（医院）', type: "Hospital", longitude: 120.29, latitude: 30.42, location: "Land" },
      { name: '之江院区（医院）', type: "Hospital", longitude: 120.15, latitude: 30.19, location: "Land" },

      // source
      { name: '开化（集结）', type: "Source", longitude: 118.42, latitude: 29.14, location: "Land" },
      { name: '文成（集结）', type: "Source", longitude: 120.10, latitude: 27.79, location: "Land" },
      { name: '青田（水源）', type: "Source", longitude: 120.29, latitude: 28.14, location: "Land" },
      { name: '玉环（集结）', type: "Source", longitude: 121.24, latitude: 28.14, location: "Land" },
      { name: '诸暨（集结）', type: "Source", longitude: 120.18, latitude: 29.76, location: "Land" },
      { name: '德清（集结）', type: "Source", longitude: 120.31, latitude: 30.59, location: "Land" },
      { name: '海盐（集结）', type: "Source", longitude: 120.95, latitude: 30.53, location: "Land" },
      { name: '宁波（集结）', type: "Source", longitude: 121.63, latitude: 29.87, location: "Land" },

      // destination
      { name: '东阳（安置）', type: "Destination", longitude: 120.25, latitude: 29.27, location: "Land" },
      { name: '天台（安置）', type: "Destination", longitude: 121.03, latitude: 29.14, location: "Land" },
      { name: '上虞（安置）', type: "Destination", longitude: 120.84, latitude: 30.12, location: "Land" },
      { name: '永嘉（安置）', type: "Destination", longitude: 120.69, latitude: 28.15, location: "Land" },
      { name: '大荆（安置）', type: "Destination", longitude: 120.96, latitude: 28.12, location: "Land" },
      { name: '救捞船（安置）', type: "Destination", longitude: 122.22, latitude: 28.39, location: "Sea" },

      // 灾区
      { name: '龙泉（灾区）', type: "DisasterArea", longitude: 119.15, latitude: 28.08, location: "Land" },
      { name: '建德（灾区）', type: "DisasterArea", longitude: 119.29, latitude: 29.48, location: "Land" },
      { name: '永康（灾区）', type: "DisasterArea", longitude: 120.04, latitude: 28.89, location: "Land" },
      { name: '缙云（灾区）', type: "DisasterArea", longitude: 120.16, latitude: 28.72, location: "Land" },
      { name: '鹿城（灾区）', type: "DisasterArea", longitude: 120.66, latitude: 28.01, location: "Land" },
      { name: '磐安（灾区）', type: "DisasterArea", longitude: 120.45, latitude: 29.05, location: "Land" },
      { name: '山早（灾区）', type: "DisasterArea", longitude: 120.67, latitude: 28.53, location: "Land" },
      { name: '仙居（灾区）', type: "DisasterArea", longitude: 120.73, latitude: 28.84, location: "Land" },
      { name: '搁浅渔船（事故）', type: "DisasterArea", longitude: 121.31, latitude: 27.98, location: "Sea" },
      { name: '新昌（灾区）', type: "DisasterArea", longitude: 120.90, latitude: 29.51, location: "Land" },
      { name: '临海（灾区）', type: "DisasterArea", longitude: 121.15, latitude: 28.86, location: "Land" },
      { name: '温岭（灾区）', type: "DisasterArea", longitude: 121.38, latitude: 28.37, location: "Land" },
      { name: '失联油轮（事故）', type: "DisasterArea", longitude: 121.28, latitude: 27.44, location: "Sea" },
      { name: '失联货轮（事故）', type: "DisasterArea", longitude: 122.25, latitude: 27.76, location: "Sea" },
      { name: '侧翻游轮（事故）', type: "DisasterArea", longitude: 122.00, latitude: 28.75, location: "Sea" },
      { name: '失联渔船（事故）', type: "DisasterArea", longitude: 122.14, latitude: 29.46, location: "Sea" },
      { name: '高位平台（事故）', type: "DisasterArea", longitude: 123.10, latitude: 28.41, location: "Sea" },
      { name: '海上平台（事故）', type: "DisasterArea", longitude: 123.37, latitude: 29.47, location: "Sea" },
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