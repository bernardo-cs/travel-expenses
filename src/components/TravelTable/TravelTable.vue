<template>
  <div>
    <month-selector v-on:date="onDateChange($event)"></month-selector>
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
        <travel-row v-for="row in rows" v-bind:index="row.number" v-bind:key="row.number"></travel-row>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TravelRow from "./TravelRow.vue";
import MonthSelector from "./MonthSelector.vue";

@Component({ components: { TravelRow, MonthSelector } })
export default class TravelTable extends Vue {
  rows: Array<IRow> = [];

  onDateChange(sDate: string) {
    const r = rowsInMonth(sDate);
    console.log(sDate, r.length);
    this.rows = r;
  }

  created() {
    this.onDateChange(new Date().toISOString().split("T")[0]);
  }
}

interface IRow {
  number: Number;
  service: String;
  departureTime: String;
  arrivalTime: String;
}

function daysInMonth(sDate: string): number {
  const date = new Date(sDate);
  const year = date.getFullYear();
  const month = date.getMonth();

  return new Date(year, month, 0).getDate();
}

function rowsInMonth(sDate: string): Array<IRow> {
  const date = new Date(sDate);
  const numberOfDays = daysInMonth(sDate);

  return Array.from({ length: numberOfDays }, (val, index) => {
    return {
      number: index + 1,
      service: "Deslocações",
      departureTime: "18",
      arrivalTime: "13"
    };
  });
}
</script>
