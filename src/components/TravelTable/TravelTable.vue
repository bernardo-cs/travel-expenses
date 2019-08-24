<template>
  <v-container>
    <v-data-table :headers="headers" :items="items">
      <v-toolbar flat color="white">
        <v-toolbar-title>Travel Expenses for Month</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </v-data-table>

    <table>
      <thead>
        <tr></tr>
      </thead>
      <tbody>
        <travel-row
          v-for="(row, index) in rows"
          :day="row.day"
          :description="row.service"
          :key="row.number"
          :departure="row.departure"
          :arrival="row.arrival"
          :sleepover="row.sleepOver"
          :outsideCountry="row.outsideCountry"
          @clearRow="clearRow(index)"
          @autoFillRow="autoFillRow(index)"
          @departureChanged="setDeparture(index, $event)"
          @descriptionChanged="setService(index, $event)"
          @arrivalChanged="setArrival(index, $event)"
          @outsideCountryChanged="setOutsideCountry(index, $event)"
          @sleepoverChanged="setSleepOver(index, $event)"
        ></travel-row>
      </tbody>
    </table>

    <div>
      <span>{{ $t("total") }}</span>
      {{ total }}
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { maxDailyExpense, dailyExpenses } from "./DayExpenses";
import TravelRow from "./TravelRow.vue";
import MonthSelector from "./MonthSelector.vue";
import { IRow, TypeOfWorker } from "./TraveTable.interfaces";
import { mapGetters } from "vuex";
import moment from "moment";
import { round } from "@/math";
import { downloadToExcel } from "./ExcelExporter";
import { getModule } from "vuex-module-decorators";
import { TravelTableModule } from "@/store/TravelTableModule";
import { i18n } from "../../main";

const HEADERS = [
  "action",
  "day",
  "service",
  "departure",
  "arrival",
  "sleepOver",
  "outsideCountry",
  "compensation"
];
@Component({ components: { TravelRow } })
export default class TravelTable extends Vue {
  store: TravelTableModule = getModule(TravelTableModule, this.$store);

  get headers() {
    return HEADERS.map(header => {
      return {
        text: i18n.t(header),
        value: header,
        align: "left",
        sortable: false
      };
    });
  }

  get items() {
    return this.store.rows.map(row => {
      const outsideCountry = row.outsideCountry ? "outside" : "inside";
      const compensation = dailyExpenses(
        row.arrival,
        row.departure,
        row.sleepOver,
        outsideCountry,
        this.store.workerType
      );
      const day = `${row.day.getUTCDate()}  | ${i18n.d(row.day, "weekDay")}`;
      const departure = row.departure
        ? moment(row.departure).format("HH:mm a")
        : "";
      const arrival = row.arrival ? moment(row.arrival).format("HH:mm a") : "";

      return {
        day,
        compensation,
        departure,
        arrival
      };
    });
  }

  get rows() {
    return this.store.rows;
  }

  get month() {
    return this.store.date;
  }

  get total() {
    return round(this.store.total, 2);
  }

  get maxDailyCompensation(): number {
    const workerType: TypeOfWorker = this.store.workerType;
    return maxDailyExpense.inside[workerType];
  }

  get maxDailyCompensationOutsideCountry(): number {
    const workerType: TypeOfWorker = this.store.workerType;
    return maxDailyExpense.outside[workerType];
  }

  setDeparture(index: number, date: Date) {
    this.store.setDeparture({ index, date });
  }

  setService(index: number, service: string) {
    this.store.setService({ index, service });
  }

  setArrival(index: number, date: Date) {
    this.store.setArrival({ index, date });
  }

  setSleepOver(index: number, value: boolean) {
    this.store.setSleepOver({ index, value });
  }

  setOutsideCountry(index: number, value: boolean) {
    this.store.setOutsideCountry({ index, value });
  }

  clearRow(index: number) {
    this.store.clearRow(index);
  }

  autoFillRow(index: number) {
    this.store.autoFillRow(index);
  }
}
</script>
