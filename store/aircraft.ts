import { defineStore } from 'pinia';

interface Aircraft {
    name: string;
    type: "Helicopter" | "FixedWing";
    cruising_speed: number;
    max_fuel: number;
    fuel_consumption_per_unit_time: number;
}

export const useAircraftStore = defineStore('aircraft', {
    state: (): { default: Aircraft[] } => ({
        default: [
            { name: 'AC311 搜救型', type: "Helicopter", cruising_speed: 240, max_fuel: 423, fuel_consumption_per_unit_time: 105 },
            { name: 'AC312 救援型', type: "Helicopter", cruising_speed: 270, max_fuel: 580, fuel_consumption_per_unit_time: 165 },
            { name: 'AC313 基本型', type: "Helicopter", cruising_speed: 251, max_fuel: 3500, fuel_consumption_per_unit_time: 1065 },
            { name: 'AC313 医疗型', type: "Helicopter", cruising_speed: 251, max_fuel: 3500, fuel_consumption_per_unit_time: 1065 },
            { name: 'AC352 基本型', type: "Helicopter", cruising_speed: 244, max_fuel: 2066, fuel_consumption_per_unit_time: 533 },
            { name: 'AW169 基本型', type: "Helicopter", cruising_speed: 272, max_fuel: 904, fuel_consumption_per_unit_time: 220 },
            { name: 'AW169 医疗型', type: "Helicopter", cruising_speed: 272, max_fuel: 904, fuel_consumption_per_unit_time: 220 },
            { name: 'Be11429 救援型', type: "Helicopter", cruising_speed: 263, max_fuel: 600, fuel_consumption_per_unit_time: 158 },
            { name: '长鹰 5E 搜救型', type: "FixedWing", cruising_speed: 180, max_fuel: 40, fuel_consumption_per_unit_time: 1 },
            { name: 'H135 医疗型', type: "Helicopter", cruising_speed: 254, max_fuel: 560, fuel_consumption_per_unit_time: 160 },
            { name: 'H155 搜救型', type: "Helicopter", cruising_speed: 280, max_fuel: 993, fuel_consumption_per_unit_time: 330 },
            { name: 'H225 救援型', type: "Helicopter", cruising_speed: 276, max_fuel: 2336, fuel_consumption_per_unit_time: 559 },
            { name: 'H225 医疗型', type: "Helicopter", cruising_speed: 276, max_fuel: 2326, fuel_consumption_per_unit_time: 559 },
            { name: 'Mi-171 基本型', type: "Helicopter", cruising_speed: 240, max_fuel: 1700, fuel_consumption_per_unit_time: 1175 },
            { name: 'Mi-26 基本型', type: "Helicopter", cruising_speed: 255, max_fuel: 12000, fuel_consumption_per_unit_time: 3000 },
            { name: 'S-76 搜救型', type: "Helicopter", cruising_speed: 269, max_fuel: 818, fuel_consumption_per_unit_time: 273 },
            { name: '翼龙 2H 搜救型', type: "FixedWing", cruising_speed: 300, max_fuel: 2000, fuel_consumption_per_unit_time: 100 },
        ]
    }),
    actions: {
        getByName(name: string): Aircraft | undefined {
            return this.default.find((aircraft) => aircraft.name === name);
        }
    }
})