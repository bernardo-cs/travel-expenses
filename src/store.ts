import Vue from "vue";
import Vuex from "vuex";
import { TravelTableModule } from "./store/TravelTableModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    travelTableModule: TravelTableModule
  }
});
