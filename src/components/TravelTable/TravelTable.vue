<template>
  <div>
    <h3>
      {{ $t("travelTable.currentMonth") }} :

      <month-selector
        :date="date"
        @date="onDateChange($event)"
      ></month-selector>

      <button @click="autoFill()">{{ $t("autoFill") }} {{ month }}</button>
      <button @click="clear()">{{ $t("clear") }} {{ month }}</button>
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

    <button @click="downloadAsExcel()">{{ $t("downloadAsExcel") }}</button>

    <local></local>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { maxDailyExpense } from "./DayExpenses";
import TravelRow from "./TravelRow.vue";
import Local from "./Local.vue";
import MonthSelector from "./MonthSelector.vue";
import { TypeOfWorker } from "./TraveTable.interfaces";
import { round } from "@/math";
import { downloadToExcel } from "./ExcelExporter";
import { getModule } from "vuex-module-decorators";
import { TravelTableModule } from "@/store/TravelTableModule";
import { Moment } from "moment";

@Component({ components: { TravelRow, MonthSelector, Local } })
export default class TravelTable extends Vue {
  store: TravelTableModule = getModule(TravelTableModule, this.$store);

  get rows() {
    return this.store.rows;
  }

  get workerType() {
    return this.store.workerType;
  }

  get month() {
    return this.$d(this.store.date, "month");
  }

  get date() {
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

  onDateChange(date: Moment) {
    this.store.setDate(date);
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

  setWorkerType(workerType: TypeOfWorker) {
    this.store.setWorkerType(workerType);
  }

  clearRow(index: number) {
    this.store.clearRow(index);
  }

  autoFillRow(index: number) {
    this.store.autoFillRow(index);
  }

  autoFill() {
    this.store.autoFillRows();
  }

  clear() {
    this.store.clearRows();
  }

  downloadAsExcel() {
    downloadToExcel(
      {
        rows: this.store.rows,
        total: this.store.total
      },
      {
        workerType: this.store.workerType,
        date: this.store.date
      }
    );
  }
}
</script>
