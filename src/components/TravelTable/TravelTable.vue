<template>
  <div>
    <h3>Current Month: {{ month }}</h3>
    <month-selector @date="onDateChange($event)"></month-selector>
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TravelRow from "./TravelRow.vue";
import MonthSelector from "./MonthSelector.vue";
import { IRow } from "./TraveTable.interfaces";
import { mapGetters } from "vuex";
import moment from "moment";

@Component({ components: { TravelRow, MonthSelector } })
export default class TravelTable extends Vue {
  get rows() {
    return this.$store.state.rows;
  }

  get month() {
    return moment(this.$store.state.date).format("MMMM");
  }

  onDateChange(date: string) {
    this.$store.commit("setDate", date);
  }

  changeRow(index: number, property: string, value: string) {
    this.$store.commit("changeRow", { index, value, property });
  }
}
</script>
