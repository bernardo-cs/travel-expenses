<template>
  <div>
    <select
      id="month-selector"
      :value="monthIndex"
      @input="setMonth($event.target.value)"
    >
      <option v-for="month in months" :key="month" :value="month">{{
        $d(new Date(Date.UTC(0, month, 6, 6, 0, 0)), "month")
      }}</option>
    </select>

    <select
      id="year-selector"
      :value="year"
      @input="setYear($event.target.value)"
    >
      <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment";

@Component
export default class MonthSelector extends Vue {
  @Prop() date!: Date;

  get monthIndex() {
    return moment(this.date).month();
  }

  get year() {
    return moment(this.date).year();
  }

  get months(): Array<number> {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }

  get years(): Array<number> {
    const year = +moment(this.date).year();

    return [
      ...[...new Array(10)].map((x, i) => year - 1 - i).reverse(),
      year,
      ...[...new Array(10)].map((x, i) => year + 1 + i)
    ];
  }

  setMonth(month: number) {
    this.$emit("date", moment(this.date).month(month));
  }

  setYear(year: number) {
    this.$emit("date", moment(this.date).year(year));
  }
}
</script>
