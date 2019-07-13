<template>
  <div>
    <h3>Current Month: {{ month }}</h3>
    <month-selector @date="onDateChange($event)"></month-selector>

    <label for="type-of-worker">Type of worker:</label>
    <select id="type-of-worker" :value="workerType" @input="setWorkerType($event.target.value)">
      <option value="directors">Directors</option>
      <option value="others">Others</option>
    </select>

    <label>
      Max daily compensation for travels inside country:
      {{ maxDailyCompensation }}
    </label>
    <label>
      Max daily compensation for travels outside the country:
      {{ maxDailyCompensationOutsideCountry }}
    </label>

    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Service</th>
          <th>Departure</th>
          <th>Arrival</th>
          <th>Sleep Over</th>
          <th>Outside Country</th>
          <th>Compensation</th>
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
          @departureChanged="setDeparture(index, $event)"
          @descriptionChanged="setService(index, $event)"
          @arrivalChanged="setArrival(index, $event)"
          @outsideCountryChanged="setOutsideCountry(index, $event)"
          @sleepoverChanged="setSleepOver(index, $event)"
        ></travel-row>
      </tbody>
    </table>

    <div>
      <span>Total</span>
      {{ total }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { maxDailyExpense } from "./DayExpenses";
import TravelRow from "./TravelRow.vue";
import MonthSelector from "./MonthSelector.vue";
import { IRow, TypeOfWorker } from "./TraveTable.interfaces";
import { mapGetters } from "vuex";
import moment from "moment";

@Component({ components: { TravelRow, MonthSelector } })
export default class TravelTable extends Vue {
  get rows() {
    return this.$store.getters.rows;
  }

  get workerType() {
    return this.$store.state.workerType;
  }

  get month() {
    return moment(this.$store.state.date).format("MMMM");
  }

  get total() {
    return this.$store.getters.total;
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
}
</script>
