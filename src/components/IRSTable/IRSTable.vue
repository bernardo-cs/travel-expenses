<template>
  <table>
    <thead>
      <tr>
        <th colspan="2">{{ title }}</th>
      </tr>
    </thead>

    <thead>
      <tr>
        <th></th>
        <th>Income</th>
        <th>Tax</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="([income, tax], index) in table" :key="income">
        <td>{{ selectedRow === index ? "👉" : "" }}</td>
        <td>{{ income }}</td>
        <td>{{ tax }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class IRSTable extends Vue {
  @Prop() public table?: Array<[number, number]>;
  @Prop() public title?: number;
  @Prop() public selectedRow?: number;
}
</script>
