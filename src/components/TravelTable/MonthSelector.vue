<template>
  <select
    id="month-selector"
    :value="monthIndex"
    @input="setMonth($event.target.value)"
  >
    <option v-for="month in months" :key="month.index" :value="month.index">{{
      month.name
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

  get months() {
    return moment.months().map((name, index) => ({ name, index }));
  }

  setMonth(month: number) {
    this.$emit("date", moment(this.date).set("month", month));
  }
}
</script>
