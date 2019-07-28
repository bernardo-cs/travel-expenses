<template>
  <div>
    <h3>
      {{ $t("travelTable.currentMonth") }} :
      <month-selector @date="onDateChange($event)"></month-selector>
      <button @click="autoFill()">{{ $t("autoFill") }} {{ $d(month, 'month') }}</button>
      <button @click="clear()">{{ $t("clear") }} {{ $d(month, 'month') }}</button>
    </h3>

    <label for="type-of-worker">{{ $t("typeOfWorker") }}</label>
    <select
      id="type-of-worker"
      :value="workerType"
      @input="setWorkerType($event.target.value)"
    >
      <option value="directors">{{ $t("directors") }}</option>
      <option value="others">{{ $t("others") }}</option>
    </select>

    <label>
      {{ $t("travelTable.maxCompensation") }}
      {{ maxDailyCompensation }}
    </label>
    <label>
      {{ $t("travelTable.maxCompensationOutsideCountry") }}
      {{ maxDailyCompensationOutsideCountry }}
    </label>

    <table>
      <thead>
        <tr>
          <th>{{ $t("action") }}</th>
          <th>{{ $t("day") }}</th>
          <th>{{ $t("service") }}</th>
          <th>{{ $t("departure") }}</th>
          <th>{{ $t("arrival") }}</th>
          <th>{{ $t("sleepOver") }}</th>
          <th>{{ $t("outsideCountry") }}</th>
          <th>{{ $t("compensation") }}</th>
        </tr>
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

    <local></local>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { maxDailyExpense } from "./DayExpenses";
import TravelRow from "./TravelRow.vue";
import Local from "./Local.vue";
import MonthSelector from "./MonthSelector.vue";
import { IRow, TypeOfWorker } from "./TraveTable.interfaces";
import { mapGetters } from "vuex";
import moment from "moment";
import { round } from "@/math";

@Component({ components: { TravelRow, MonthSelector, Local } })
export default class TravelTable extends Vue {
  get rows() {
    return this.$store.getters.rows;
  }

  get workerType() {
    return this.$store.state.workerType;
  }

  get month() {
    return this.$store.state.date;
  }

  get total() {
    return round(this.$store.getters.total, 2);
  }

  get maxDailyCompensation(): number {
    const workerType: TypeOfWorker = this.$store.state.workerType;
    return maxDailyExpense.inside[workerType];
  }

  get maxDailyCompensationOutsideCountry(): number {
    const workerType: TypeOfWorker = this.$store.state.workerType;
    return maxDailyExpense.outside[workerType];
  }

  onDateChange(date: string) {
    this.$store.commit("setDate", date);
  }

  setDeparture(index: number, date: Date) {
    this.$store.commit("setDeparture", { index, date });
  }

  setService(index: number, service: string) {
    this.$store.commit("setService", { index, service });
  }

  setArrival(index: number, date: Date) {
    this.$store.commit("setArrival", { index, date });
  }

  setSleepOver(index: number, value: boolean) {
    this.$store.commit("setSleepOver", { index, value });
  }

  setOutsideCountry(index: number, value: boolean) {
    this.$store.commit("setOutsideCountry", { index, value });
  }

  setWorkerType(workerType: TypeOfWorker) {
    this.$store.commit("setWorkerType", workerType);
  }

  clearRow(index: number) {
    this.$store.commit("clearRow", index);
  }

  autoFillRow(index: number) {
    this.$store.commit("autoFillRow", index);
  }

  autoFill() {
    this.$store.commit("autoFillRows");
  }

  clear() {
    this.$store.commit("clearRows");
  }
}
</script>
