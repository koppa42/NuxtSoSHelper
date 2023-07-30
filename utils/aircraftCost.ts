import { Aircraft } from '@/store/aircraft';

export namespace AircraftCost {
  // 机体折旧费
  // price: 机体价格
  export const DepreciationExpense = (price: number): number => {
    return 1.03 * (1 - 0.1) * (1 + 0.1) * price * 10000 / (20 * 300);
  }

  // 维修费
  // price: 机体价格
  export const MaintenanceExpense = (price: number): number => {
    return ((1 * price * 10000 * 0.15 + 1.5 * 0.1 * price * 10000 * 0.25 + 0.5 * price * 10000 * 0.1) / (20 * 300)) + 0.15;
  }

  // 燃滑油费
  // fuel_per_hour: 每小时燃油量
  export const FuelOilExpense = (fuel_per_hour: number): number => {
    return 1.03 * 8.45 * fuel_per_hour / 10000;
  }

  // 驾驶人员费
  // S1: 驾驶员每人年工资，有人机 60，无人机 20
  export const PilotExpense = (person: boolean): number => {
    const S1 = person ? 60: 8.870689655172413;
    return 2 * 2 * S1 / 300 + 0.015 * 2;
  }

  // 地勤人员费
  // m3: 地勤人员人数，有人机取 4，无人机取 2
  export const GroundStaffExpense = (person: boolean): number => {
    const m3 = person ? 4 : 2;
    return 2 * m3 * 15 / 300;
  }

  // 保险费
  // price: 机体价格
  // r1: 保险费率，取 0.02 ~ 0.03 之间
  export const InsuranceExpense = (price: number, r1: number = 0.02484787018255578): number => {
    return 0.85 * price * 10000 * r1 / 300;
  }

  export const Total = (aircraft: Aircraft): number => {
    return DepreciationExpense(aircraft.price)
      + MaintenanceExpense(aircraft.price)
      + FuelOilExpense(aircraft.fuel_consumption_per_unit_time)
      + PilotExpense(aircraft.with_person)
      + GroundStaffExpense(aircraft.with_person)
      + InsuranceExpense(aircraft.price);
  }
}