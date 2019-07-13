import Moment from "moment";
import moment from "moment";
import { extendMoment } from "moment-range";
import {
  MaxDailyExpense,
  CountryTravel,
  TypeOfWorker
} from "./TraveTable.interfaces";
import { round } from "../../math";

const rangedMoment = extendMoment(Moment as any);
export const maxDailyExpense: MaxDailyExpense = {
  inside: { directors: 69.19, others: 50.2 },
  outside: { directors: 100.24, others: 89.35 }
};

const expenseRules = [
  {
    name: "Lunch Expense",
    apply: (
      arrival: Date | undefined,
      departure: Date | undefined,
      sleepOver: boolean
    ) => {
      if (!arrival && !departure) {
        return sleepOver ? 0.25 : 0;
      }

      if (!arrival) {
        arrival = moment(departure)
          .endOf("day")
          .toDate();
      }

      if (!departure) {
        departure = moment(arrival)
          .startOf("day")
          .toDate();
      }

      const travelRange = rangedMoment.range(departure, arrival);
      const lunchBreak = rangedMoment.range(
        moment(arrival)
          .startOf("day")
          .set("h", 13),
        moment(arrival)
          .startOf("day")
          .set("h", 14)
      );

      return travelRange.overlaps(lunchBreak) ? 0.25 : 0;
    }
  },
  {
    name: "Dinner Expense",
    apply: (
      arrival: Date | undefined,
      departure: Date | undefined,
      sleepOver: boolean
    ) => {
      if (!arrival && !departure) {
        return sleepOver ? 0.25 : 0;
      }

      if (!arrival) {
        arrival = moment(departure)
          .endOf("day")
          .toDate();
      }

      if (!departure) {
        departure = moment(arrival)
          .startOf("day")
          .toDate();
      }

      const travelRange = rangedMoment.range(departure, arrival);
      const dinnerBreak = rangedMoment.range(
        moment(arrival)
          .startOf("day")
          .set("h", 20),
        moment(arrival)
          .startOf("day")
          .set("h", 21)
      );

      return travelRange.overlaps(dinnerBreak) ? 0.25 : 0;
    }
  },
  {
    name: "Accomodation Expense",
    apply: (
      _: Date | undefined,
      __: Date | undefined,
      accomodation: boolean
    ) => {
      return accomodation ? 0.5 : 0;
    }
  }
];

export function dailyExpenses(
  arrival: Date | undefined,
  departure: Date | undefined,
  accomodation: boolean,
  countryTravelType: CountryTravel,
  workerType: TypeOfWorker
): number {
  const percentage = expenseRules
    .map(rule => rule.apply(arrival, departure, accomodation))
    .reduce((res: number, p: number) => res + p, 0);

  return round(maxDailyExpense[countryTravelType][workerType] * percentage, 2);
}
