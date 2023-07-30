import { defineStore } from 'pinia';

export type AircraftAbility = '侦查' | '货运' | '吊挂' | '载人' | '绞车' | '医护' | '消防' | '海上';
export interface Aircraft {
  name: string;
  type: "Helicopter" | "FixedWing";
  price: number;
  ability: AircraftAbility[];
  rotor_area: number;
  air_area: number;
  max_fuel: number;
  cruising_speed: number;
  fuel_consumption_per_unit_time: number;
  max_capacity: number;
  max_internal_load: number;
  max_external_load: number;
  fuel_fill_time: number;
  person_on_off_time: number;
  supply_load_time: number;
  device_load_time: number;
  patient_on_off_time: number;
  water_weight: number;
  water_load_time: number;
  extinguishing_time: number;
  search_time: number;
  winch_person_time: number;
  winch_patient_time: number;
}

export type AirTaskType = '绞车投放' | '吊运' | '卸载' | '绞车转移' | '绞车转运' | '取水' | '灭火' | '侦查搜寻';
export type LandTaskType = '装载' | '卸货' | '运送' | '投放' | '转移' | '安置' | '转运' | '交接' | '加油保障';
export type TaskType = AirTaskType | LandTaskType;

const getTaskByAblility = (ability: AircraftAbility[]): TaskType[] => {
  const result: TaskType[] = []
  if (ability.includes('侦查')) {
    result.push('侦查搜寻');
  }
  if (ability.includes('货运')) {
    result.push('装载');
    result.push('卸货');
  }
  if (ability.includes('吊挂')) {
    result.push('吊运');
    result.push('卸载');
  }
  if (ability.includes('载人')) {
    result.push('运送');
    result.push('投放');
    result.push('转移');
    result.push('安置');
    if (ability.includes('绞车')) {
      result.push('绞车投放');
      result.push('绞车转移');
    }
    if (ability.includes('医护')) {
      result.push('转运');
      result.push('交接');
      if (ability.includes('绞车')) {
        result.push('绞车转运');
      }
    }
  }
  if (ability.includes('消防')) {
    result.push('取水');
    result.push('灭火');
  }
  result.push('加油保障');
  return result;
}

export const useAircraftStore = defineStore('aircraft', {
  state: (): { default: Aircraft[] } => ({
    default: [
      { name: 'AC311 搜救型', type: 'Helicopter', price: 0.2, ability: ['侦查', '货运', '载人'], rotor_area: 79, air_area: 79, max_fuel: 423, cruising_speed: 240, fuel_consumption_per_unit_time: 105, max_capacity: 4, max_internal_load: 500, max_external_load: 1000, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.4, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 13.46, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'AC312 救援型', type: 'Helicopter', price: 0.39, ability: ['货运', '载人', '绞车'], rotor_area: 112, air_area: 112, max_fuel: 580, cruising_speed: 270, fuel_consumption_per_unit_time: 165, max_capacity: 12, max_internal_load: 800, max_external_load: 1600, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.4, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'AC313 基本型', type: 'Helicopter', price: 1.0, ability: ['货运', '载人', '绞车', '消防'], rotor_area: 281, air_area: 281, max_fuel: 3500, cruising_speed: 251, fuel_consumption_per_unit_time: 1065, max_capacity: 27, max_internal_load: 4000, max_external_load: 5000, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.1, device_load_time: 1200, patient_on_off_time: 600, water_weight: 5, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'AC313 医疗型', type: 'Helicopter', price: 1.1, ability: ['货运', '载人', '绞车', '医护'], rotor_area: 281, air_area: 281, max_fuel: 3500, cruising_speed: 251, fuel_consumption_per_unit_time: 1065, max_capacity: 9, max_internal_load: 2000, max_external_load: 5000, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.2, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'AC352 基本型', type: 'Helicopter', price: 1.2, ability: ['侦查', '货运', '载人', '绞车', '消防', '海上'], rotor_area: 172, air_area: 172, max_fuel: 2066, cruising_speed: 244, fuel_consumption_per_unit_time: 533, max_capacity: 15, max_internal_load: 1200, max_external_load: 3000, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.1, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'AW169 基本型', type: 'Helicopter', price: 0.98, ability: ['货运', '载人', '绞车', '消防', '海上'], rotor_area: 116, air_area: 116, max_fuel: 904, cruising_speed: 272, fuel_consumption_per_unit_time: 220, max_capacity: 9, max_internal_load: 1800, max_external_load: 2000, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.1, device_load_time: 1200, patient_on_off_time: 600, water_weight: 2, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'AW169 医疗型', type: 'Helicopter', price: 1.01, ability: ['货运', '载人', '绞车', '医护', '海上'], rotor_area: 116, air_area: 116, max_fuel: 904, cruising_speed: 272, fuel_consumption_per_unit_time: 220, max_capacity: 3, max_internal_load: 900, max_external_load: 2000, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.4, device_load_time: 1200, patient_on_off_time: 300, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'Be11429 救援型', type: 'Helicopter', price: 0.26, ability: ['货运', '载人', '绞车'], rotor_area: 95, air_area: 95, max_fuel: 600, cruising_speed: 263, fuel_consumption_per_unit_time: 158, max_capacity: 6, max_internal_load: 600, max_external_load: 1200, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.4, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: '长鹰 5E 搜救型', type: 'FixedWing', price: 0.24, ability: ['侦查', '海上'], rotor_area: 192, air_area: 0, max_fuel: 40, cruising_speed: 180, fuel_consumption_per_unit_time: 1, max_capacity: 0, max_internal_load: 100, max_external_load: 300, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.1, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 3.96, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'H135 医疗型', type: 'Helicopter', price: 0.43, ability: ['货运', '载人', '医护'], rotor_area: 82, air_area: 82, max_fuel: 560, cruising_speed: 254, fuel_consumption_per_unit_time: 160, max_capacity: 2, max_internal_load: 700, max_external_load: 1400, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.4, device_load_time: 1200, patient_on_off_time: 300, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'H155 搜救型', type: 'Helicopter', price: 0.7, ability: ['侦查', '货运', '载人', '绞车', '海上'], rotor_area: 125, air_area: 125, max_fuel: 993, cruising_speed: 280, fuel_consumption_per_unit_time: 330, max_capacity: 11, max_internal_load: 900, max_external_load: 1600, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.4, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 15.84, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'H225 救援型', type: 'Helicopter', price: 1.86, ability: ['货运', '载人', '绞车', '海上'], rotor_area: 207, air_area: 207, max_fuel: 2336, cruising_speed: 276, fuel_consumption_per_unit_time: 559, max_capacity: 19, max_internal_load: 2200, max_external_load: 4500, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.2, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'H225 医疗型', type: 'Helicopter', price: 1.92, ability: ['货运', '载人', '绞车', '医护', '海上'], rotor_area: 207, air_area: 207, max_fuel: 2326, cruising_speed: 276, fuel_consumption_per_unit_time: 559, max_capacity: 6, max_internal_load: 2200, max_external_load: 4500, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.2, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'Mi-171 基本型', type: 'Helicopter', price: 0.46, ability: ['货运', '载人', '绞车', '消防'], rotor_area: 356, air_area: 356, max_fuel: 1700, cruising_speed: 240, fuel_consumption_per_unit_time: 1175, max_capacity: 26, max_internal_load: 4000, max_external_load: 3000, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.1, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'Mi-26 基本型', type: 'Helicopter', price: 2.1, ability: ['货运', '吊挂', '载人', '消防'], rotor_area: 805, air_area: 805, max_fuel: 12000, cruising_speed: 255, fuel_consumption_per_unit_time: 3000, max_capacity: 82, max_internal_load: 20000, max_external_load: 15000, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.1, device_load_time: 1200, patient_on_off_time: 600, water_weight: 15, water_load_time: 900, extinguishing_time: 900, search_time: 10.68, winch_person_time: 150, winch_patient_time: 600 },
      { name: 'S-76 搜救型', type: 'Helicopter', price: 0.9, ability: ['侦查', '货运', '载人', '绞车', '海上'], rotor_area: 141, air_area: 141, max_fuel: 818, cruising_speed: 269, fuel_consumption_per_unit_time: 273, max_capacity: 13, max_internal_load: 1100, max_external_load: 2300, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.1, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 12.76, winch_person_time: 150, winch_patient_time: 600 },
      { name: '翼龙 2H 搜救型', type: 'FixedWing', price: 0.19, ability: ['侦查'], rotor_area: 330, air_area: 0, max_fuel: 2000, cruising_speed: 300, fuel_consumption_per_unit_time: 100, max_capacity: 0, max_internal_load: 200, max_external_load: 400, fuel_fill_time: 1200, person_on_off_time: 60, supply_load_time: 0.1, device_load_time: 1200, patient_on_off_time: 600, water_weight: 3, water_load_time: 900, extinguishing_time: 900, search_time: 2.58, winch_person_time: 150, winch_patient_time: 600 },
    ]
  }),
  actions: {
    getByName(name: string): Aircraft | undefined {
      return this.default.find((aircraft) => aircraft.name === name);
    },
    getPossibleTaskByName(name: string): TaskType[] | undefined {
      const tmp = this.getByName(name);
      if (!tmp) return undefined;
      return getTaskByAblility(tmp.ability);
    }
  }
})