import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import { IRow } from "./components/TravelTable/TraveTable.interfaces";

Vue.use(Vuex);

export const INPUT_DATE_FORMAT = "yyyy-mm-dd";
export default new Vuex.Store({
  state: {
    date: moment()
      .set("date", 1)
      .toDate()
  },
  getters: {
    dateSimple: state => {
      return state.date.toISOString().split("T")[0];
    },
    daysInMonth: state => {
      return moment(state.date).daysInMonth();
    },
    rows: (state, getters): Array<IRow> => {
      return Array.from({ length: getters.daysInMonth }, (_, index) => {
        return {
          day: moment(state.date)
            .set("date", 1 + index)
            .toDate(),
          service: "Deslocações",
          departure: moment(state.date)
            .set("date", 1 + index)
            .set("hour", 8)
            .toDate(),
          arrival: moment(state.date)
            .set("date", 1 + index)
            .set("hour", 13)
            .toDate()
        };
      });
    }
  },
  mutations: {
    setDate(state, date: string | Date) {
      const d = date instanceof Date ? date : new Date(date);

      state.date = moment(d)
        .set("d", 1)
        .toDate();
    }
  }
});
