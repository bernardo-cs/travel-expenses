<template>
  <div>
    <month-selector></month-selector>
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
        <travel-row></travel-row>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TravelRow from "./TravelRow.vue";
import MonthSelector from "./MonthSelector.vue";

@Component({ components: { TravelRow, MonthSelector } })
export default class TravelTable extends Vue {}
</script>