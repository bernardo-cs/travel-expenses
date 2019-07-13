import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import {
  IRow,
  TypeOfWorker
} from "./components/TravelTable/TraveTable.interfaces";
import { dailyExpenses } from "./components/TravelTable/DayExpenses";

Vue.use(Vuex);

interface StoreState {
  date: Date;
  rowsByMonth: { [k: string]: Array<IRow> };
  workerType: TypeOfWorker;
}

interface StoreGetters {
  currentMonth: (state: StoreState) => string;
  rows: (state: StoreState, getters: { currentMonth: string }) => Array<IRow>;
  daysInMonth: (state: StoreState) => number;
  total: (state: StoreState, setters: { rows: Array<IRow> }) => number;
}

interface StoreMutations {
  setDate: (state: StoreState, date: string | Date) => void;
  setDeparture: (
    state: StoreState,
    { index, date }: { index: number; date: Date }
  ) => void;
  setArrival: (
    state: StoreState,
    { index, date }: { index: number; date: Date }
  ) => void;
  setSleepOver: (
    state: StoreState,
    { index, value }: { index: number; value: boolean }
  ) => void;
  clearRow: (state: StoreState, index: number) => void;
  setService: (
    state: StoreState,
    payload: { index: number; service: string }
  ) => void;
  autoFillRow: (state: StoreState, index: number) => void;
  clearRows: (state: StoreState) => void;
  autoFillRows: (state: StoreState, index: number) => void;
  setOutsideCountry: (
    state: StoreState,
    { index, value }: { index: number; value: boolean }
  ) => void;
  setWorkerType: (state: StoreState, workerType: TypeOfWorker) => void;
}

const ROWS_FORMAT = "MM-YYYY";
const initialDate = moment().set("date", 1);

const rowsByMonth: { [k: string]: Array<IRow> } = {};
rowsByMonth[initialDate.format(ROWS_FORMAT)] = initRows(initialDate.toDate());

const store: {
  state: StoreState;
  getters: StoreGetters;
  mutations: StoreMutations;
} = {
  state: {
    date: initialDate.toDate(),
    rowsByMonth,
    workerType: "directors"
  },
  getters: {
    currentMonth: state => {
      return moment(state.date).format(ROWS_FORMAT);
    },
    rows: (state, getters) => {
      return state.rowsByMonth[getters.currentMonth];
    },
    daysInMonth: state => {
      return moment(state.date).daysInMonth();
    },
    total: (state, getters) => {
      return getters.rows.reduce((acc: number, row: IRow) => {
        const countryTravel = row.outsideCountry ? "inside" : "outside";
        const expense = dailyExpenses(
          row.arrival,
          row.departure,
          row.sleepOver,
          countryTravel,
          state.workerType
        );

        return acc + expense;
      }, 0);
    }
  },
  mutations: {
    setDate(state, date: string | Date) {
      const d = date instanceof Date ? date : new Date(date);

      state.date = moment(d)
        .set("d", 1)
        .toDate();

      currentMonthRows(state);
    },
    setService(state: StoreState, payload: { index: number; service: string }) {
      const rows = currentMonthRows(state);
      rows[payload.index].service = payload.service;
    },
    clearRows(state: StoreState) {
      const rows = currentMonthRows(state);

      rows.forEach(row => {
        row.departure = undefined;
        row.arrival = undefined;
        row.service = "";
        row.sleepOver = false;
        row.outsideCountry = false;
      });
    },
    clearRow(state: StoreState, index: number) {
      const rows = currentMonthRows(state);

      rows[index].departure = undefined;
      rows[index].arrival = undefined;
      rows[index].service = "";
      rows[index].sleepOver = false;
      rows[index].outsideCountry = false;
    },
    setDeparture(
      state: StoreState,
      { index, date }: { index: number; date: Date }
    ) {
      const rows = currentMonthRows(state);
      rows[index].departure = date;
    },
    setArrival(
      state: StoreState,
      { index, date }: { index: number; date: Date }
    ) {
      const rows = currentMonthRows(state);
      rows[index].arrival = date;
    },
    autoFillRow(state: StoreState, index: number) {
      const rows = currentMonthRows(state);

      rows[index].service = "Deslocações";
      rows[index].outsideCountry = false;
      rows[index].sleepOver = false;
      rows[index].departure = moment(rows[index].day)
        .startOf("day")
        .set("hour", 9)
        .toDate();
      rows[index].arrival = moment(rows[index].day)
        .startOf("day")
        .set("hour", 18)
        .toDate();
    },
    autoFillRows(state: StoreState, index: number) {
      state.rowsByMonth[moment(state.date).format(ROWS_FORMAT)] = autoFillRows(
        state.date
      );
    },
    setSleepOver(
      state: StoreState,
      { index, value }: { index: number; value: boolean }
    ) {
      const rows = currentMonthRows(state);
      rows[index].sleepOver = value;
    },
    setOutsideCountry(
      state: StoreState,
      { index, value }: { index: number; value: boolean }
    ) {
      const rows = currentMonthRows(state);
      rows[index].outsideCountry = value;
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

    return {
      day: day.toDate(),
      service: "",
      sleepOver: false,
      outsideCountry: false,
      departure: undefined,
      arrival: undefined
    };
  });
}

function autoFillRow(index: number, date: Date): IRow {
  const day = moment(date).set("date", 1 + index);

  return [0, 6].includes(day.day())
    ? {
        day: day.toDate(),
        service: "",
        sleepOver: false,
        outsideCountry: false,
        departure: undefined,
        arrival: undefined
      }
    : {
        day: day.toDate(),
        service: "Deslocações",
        outsideCountry: false,
        sleepOver: false,
        departure: day
          .startOf("day")
          .set("hour", 9)
          .toDate(),
        arrival: day
          .startOf("day")
          .set("hour", 18)
          .toDate()
      };
}

function autoFillRows(date: Date): Array<IRow> {
  return Array.from({ length: moment(date).daysInMonth() }, (_, index) => {
    return autoFillRow(index, date);
  });
}

function currentMonthRows(state: StoreState): Array<IRow> {
  if (state.rowsByMonth[moment(state.date).format(ROWS_FORMAT)]) {
    return state.rowsByMonth[moment(state.date).format(ROWS_FORMAT)];
  } else {
    const r = initRows(state.date);
    state.rowsByMonth[moment(state.date).format(ROWS_FORMAT)] = r;

    return r;
  }
}
