import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import {
  IRow,
  TypeOfWorker,
  CountryTravel
} from "./components/TravelTable/TraveTable.interfaces";
import { dailyExpenses } from "./components/TravelTable/DayExpenses";

Vue.use(Vuex);

interface StoreState {
  date: Date;
  rows: Array<IRow>;
  workerType: TypeOfWorker;
}

interface StoreGetters {
  dateSimple: (state: StoreState) => string;
  daysInMonth: (state: StoreState) => number;
  total: (state: StoreState) => number;
}

interface StoreMutations {
  setDate: (state: StoreState, date: string | Date) => void;
  changeRow: (
    state: StoreState,
    payload: { index: number; property: keyof IRow; value: any }
  ) => void;
  setWorkerType: (state: StoreState, workerType: TypeOfWorker) => void;
}

const store: {
  state: StoreState;
  getters: StoreGetters;
  mutations: StoreMutations;
} = {
  state: {
    date: moment()
      .set("date", 1)
      .toDate(),
    rows: initRows(
      moment()
        .set("date", 1)
        .toDate()
    ),
    workerType: "directors"
  },
  getters: {
    dateSimple: state => {
      return state.date.toISOString().split("T")[0];
    },
    daysInMonth: state => {
      return moment(state.date).daysInMonth();
    },
    total: state => {
      return state.rows.reduce((acc: number, row: IRow) => {
        const expense = dailyExpenses(
          row.arrival,
          row.departure,
          false,
          "inside",
          state.workerType
        );

        return acc + expense;
      }, 0);
    }
  },
  mutations: {
    setDate(state, date: string | Date) {
      const d = date instanceof Date ? date : new Date(date);

      state.rows = initRows(d);
      state.date = moment(d)
        .set("d", 1)
        .toDate();
    },
    changeRow(state, { index, property, value }) {
      const row = state.rows[index];
      row[property] = value;
    },
    setWorkerType(state, workerType) {
      state.workerType = workerType;
    }
  }
};

export default new Vuex.Store<StoreState>(store as any);

function initRows(date: Date): Array<IRow> {
  return Array.from({ length: moment(date).daysInMonth() }, (_, index) => {
    const day = moment(date).set("date", 1 + index);

    return [0, 6].includes(day.day())
      ? {
          day: day.toDate(),
          service: "",
          departure: day
            .startOf("day")
            .set("hour", 0)
            .toDate(),
          arrival: day
            .startOf("day")
            .set("hour", 0)
            .toDate()
        }
      : {
          day: day.toDate(),
          service: "Deslocações",
          departure: day
            .startOf("day")
            .set("hour", 8)
            .toDate(),
          arrival: day
            .startOf("day")
            .set("hour", 22)
            .toDate()
        };
  });
}
