<template>
  <select
    id="month-selector"
    :value="monthIndex"
    @input="setMonth($event.target.value)"
  >
    <option v-for="month in months" :key="month" :value="month">{{
      $d(new Date(Date.UTC(0, month, 6, 6, 0, 0)), "month")
    }}</option>
  </select>
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

  get months(): Array<number> {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }

  setMonth(month: number) {
    this.$emit("date", moment(this.date).set("month", month));
  }
}
</script>
