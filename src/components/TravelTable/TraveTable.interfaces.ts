import { Moment } from "moment";

export interface IRow {
  day: Date;
  service: string;
  departure: Date;
  arrival: Date;
}

export interface MaxDailyExpense {
  inside: MaxValueByWorkerType;
  outside: MaxValueByWorkerType;
}

export interface MaxValueByWorkerType {
  directors: number;
  others: number;
}

export type CountryTravel = keyof MaxDailyExpense;
export type TypeOfWorker = keyof MaxValueByWorkerType;
