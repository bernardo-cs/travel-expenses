import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueI18n from "vue-i18n";
import "./registerServiceWorker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";

Vue.config.productionTip = false;

Vue.use(VueI18n);

export const messages = {
  en: {
    downloadAsExcel: "Download as Excel",
    action: "action",
    day: "day",
    service: "service",
    departure: "departure",
    arrival: "arrival",
    sleepOver: "sleep over",
    outsideCountry: "outside country",
    compensation: "compensation",
    directors: "directors",
    others: "others",
    defaultServiceDescription: "travel",
    total: "total",
    autoFill: "autofill",
    clear: "clear",
    typeOfWorker: "type of worker",
    pt: "Portuguese",
    en: "English",
    travelTable: {
      maxCompensation: "Max daily compensation for travels inside country:",
      maxCompensationOutsideCountry:
        "Max daily compensation for travels inside country:",
      currentMonth: "Current month"
    }
  },
  pt: {
    downloadAsExcel: "Download Excel",
    action: "acção",
    day: "dia",
    service: "serviço",
    departure: "partida",
    arrival: "chegada",
    sleepOver: "com dormida",
    outsideCountry: "fora do país",
    compensation: "compensação",
    directors: "directores",
    others: "outros",
    autoFill: "preencher automatico",
    defaultServiceDescription: "deslocações",
    total: "total",
    typeOfWorker: "tipo de empregrade",
    clear: "limpar",
    pt: "Portuguese",
    en: "English",
    travelTable: {
      maxCompensation: "Compensação diária máxima para viajens dentro do País",
      maxCompensationOutsideCountry:
        "Compensação diária máxima para viajens fora do País",
      currentMonth: "mes actual"
    }
  }
};

const dateTimeFormats = {
  en: {
    weekDay: {
      weekday: "short"
    },
    month: {
      month: "long"
    },
    short: {
      year: "numeric",
      month: "short",
      day: "numeric"
    },
    long: {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric"
    }
  },
  pt: {
    weekDay: {
      weekday: "short"
    },
    month: {
      month: "long"
    },
    short: {
      year: "numeric",
      month: "short",
      day: "numeric"
    },
    long: {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    }
  }
};

export const i18n = new VueI18n({
  locale: "en",
  fallbackLocale: "en",
  dateTimeFormats,
  messages
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
