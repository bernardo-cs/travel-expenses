import Moment from "moment";
import moment from "moment";
import { extendMoment } from "moment-range";
import {
  MaxDailyExpense,
  CountryTravel,
  TypeOfWorker
} from "./TraveTable.interfaces";

const rangedMoment = extendMoment(Moment as any);
const maxDailyExpense: MaxDailyExpense = {
  inside: { directors: 69.19, others: 50.2 },
  outside: { directors: 100.24, others: 89.35 }
};

const expenseRules = [
  {
    name: "Lunch Expense",
    apply: (arrival: Date, departure: Date, _: boolean) => {
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
    apply: (arrival: Date, departure: Date, _: boolean) => {
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
    apply: (_: Date, __: Date, accomodation: boolean) => {
      return accomodation ? 0.5 : 0;
    }
  }
];

export function dailyExpenses(
  arrival: Date,
  departure: Date,
  accomodation: boolean,
  countryTravelType: CountryTravel,
  workerType: TypeOfWorker
): number {
  const percentage = expenseRules
    .map(rule => rule.apply(arrival, departure, accomodation))
    .reduce((res: number, p: number) => res + p, 0);

  return maxDailyExpense[countryTravelType][workerType] * percentage;
}
