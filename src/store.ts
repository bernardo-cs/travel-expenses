import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import { IRow } from "./components/TravelTable/TraveTable.interfaces";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    date: new Date()
  },
  getters: {
    dateSimple: state => {
      return state.date.toISOString().split("T")[0];
    },
    daysInMonth: state => {
      return moment(state.date).daysInMonth();
    },
    rows: (_, getters): Array<IRow> => {
      return Array.from({ length: getters.daysInMonth }, (_, index) => {
        return {
          number: index + 1,
          service: "Deslocações",
          departureTime: "18",
          arrivalTime: "13"
        };
      });
    }
  },
  mutations: {
    setDate(state, date: string | Date) {
      const d = date instanceof Date ? date : new Date(date);
      state.date = d;
    }
  }
});
