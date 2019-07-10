<template>
  <div>
    <h3>Current Month: {{ month }}</h3>
    <month-selector @date="onDateChange($event)"></month-selector>

    <label for="type-of-worker">Type of worker:</label>
    <select id="type-of-worker" :value="workerType" @input="setWorkerType($event.target.value)">
      <option value="directors">Directors</option>
      <option value="others">Others</option>
    </select>

    <label>Max daily compensation: {{ maxDailyCompensation}}</label>

    <table>
      <thead>
        <tr>
          <th>Dia</th>
          <th>Serviço</th>
          <th>Hora de Saida</th>
          <th>Hora de Chegada</th>
          <th>Valor</th>
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
          @departureChanged="changeRow(index, 'departure', $event)"
          @arrivalChanged="changeRow(index, 'arrival', $event)"
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
    return this.$store.state.rows;
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

  onDateChange(date: string) {
    this.$store.commit("setDate", date);
  }

  changeRow(index: number, property: string, value: string) {
    this.$store.commit("changeRow", { index, value, property });
  }

  setWorkerType(workerType: TypeOfWorker) {
    this.$store.commit("setWorkerType", workerType);
  }
}
</script>
